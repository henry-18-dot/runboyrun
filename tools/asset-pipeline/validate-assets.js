import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const manifestPath = path.join(repoRoot, "src", "assets", "candidateManifest.json");

const requiredFields = ["id", "type", "role", "biome", "path", "status"];
const allowedTypes = new Set(["visual", "audio"]);
const allowedStatuses = new Set(["pending", "approved", "rejected", "needs_edit"]);
const allowedExtensions = {
  visual: new Set([".png", ".webp", ".jpg", ".jpeg"]),
  audio: new Set([".wav", ".mp3", ".ogg"])
};

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`无法读取有效 JSON：${relative(filePath)}。${error.message}`);
  }
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function publicUrlToFilePath(publicUrl) {
  if (typeof publicUrl !== "string" || !publicUrl.startsWith("/")) {
    return null;
  }

  const normalizedUrl = publicUrl.replaceAll("\\", "/");
  const withoutSlash = normalizedUrl.slice(1);
  const resolved = path.resolve(repoRoot, "public", withoutSlash);
  const publicRoot = path.resolve(repoRoot, "public");
  const relativeToPublic = path.relative(publicRoot, resolved);

  if (relativeToPublic.startsWith("..") || path.isAbsolute(relativeToPublic)) {
    return null;
  }

  return resolved;
}

function getItems(manifest) {
  if (Array.isArray(manifest)) {
    return manifest;
  }

  if (manifest && Array.isArray(manifest.items)) {
    return manifest.items;
  }

  return null;
}

function validateManifest() {
  const errors = [];

  if (!fs.existsSync(manifestPath)) {
    return [`缺少 ${relative(manifestPath)}`];
  }

  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch (error) {
    return [error.message];
  }

  const items = getItems(manifest);
  if (!items) {
    return [`${relative(manifestPath)} 必须是数组，或包含 items 数组的对象。`];
  }

  const ids = new Set();

  items.forEach((item, index) => {
    const label = item?.id ? `条目 "${item.id}"` : `索引 ${index} 的条目`;

    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${label} 必须是对象。`);
      return;
    }

    for (const field of requiredFields) {
      if (typeof item[field] !== "string" || item[field].trim() === "") {
        errors.push(`${label} 缺少必需的字符串字段 "${field}"。`);
      }
    }

    if (typeof item.id === "string") {
      if (ids.has(item.id)) {
        errors.push(`重复 id "${item.id}"。`);
      }
      ids.add(item.id);

      if (/[\\/]/.test(item.id)) {
        errors.push(`${label} 的 id 不能包含路径分隔符。`);
      }
    }

    if (typeof item.type === "string" && !allowedTypes.has(item.type)) {
      errors.push(`${label} 的 type "${item.type}" 无效。请使用 visual 或 audio。`);
    }

    if (typeof item.status === "string" && !allowedStatuses.has(item.status)) {
      errors.push(`${label} 的 status "${item.status}" 无效。`);
    }

    if (typeof item.path === "string" && item.path.trim() !== "") {
      const assetPath = publicUrlToFilePath(item.path);
      if (!assetPath) {
        errors.push(`${label} 的 path 必须是 /assets/candidates/visual/name.png 这样的 public 绝对路径。`);
      } else if (!fs.existsSync(assetPath)) {
        errors.push(`${label} 指向不存在的文件 ${relative(assetPath)}。`);
      }

      if (allowedTypes.has(item.type)) {
        const extension = path.extname(item.path).toLowerCase();
        if (!allowedExtensions[item.type].has(extension)) {
          errors.push(`${label} 的 ${item.type} 扩展名 "${extension || "(无)"}" 无效。`);
        }
      }
    }

    if (item.tags !== undefined && (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== "string"))) {
      errors.push(`${label} 的 tags 如果提供，必须是字符串数组。`);
    }
  });

  return errors;
}

const errors = validateManifest();

if (errors.length > 0) {
  console.error("资产校验失败：");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("资产校验通过。");
