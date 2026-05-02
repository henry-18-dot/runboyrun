import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const paths = {
  candidateManifest: path.join(repoRoot, "src", "assets", "candidateManifest.json"),
  reviewState: path.join(repoRoot, "src", "assets", "reviewState.json"),
  visualManifest: path.join(repoRoot, "src", "assets", "visualManifest.json"),
  audioManifest: path.join(repoRoot, "src", "assets", "audioManifest.json"),
  publicRoot: path.join(repoRoot, "public")
};

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`无法读取有效 JSON：${relative(filePath)}。${error.message}`);
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function itemsFromManifest(manifest) {
  return Array.isArray(manifest?.items) ? manifest.items : [];
}

function publicUrlToFilePath(publicUrl) {
  if (typeof publicUrl !== "string" || !publicUrl.startsWith("/")) {
    return null;
  }

  const resolved = path.resolve(paths.publicRoot, publicUrl.slice(1));
  const relativeToPublic = path.relative(paths.publicRoot, resolved);
  if (relativeToPublic.startsWith("..") || path.isAbsolute(relativeToPublic)) {
    return null;
  }

  return resolved;
}

function approvedUrlFor(item) {
  const extension = path.extname(item.path).toLowerCase();
  return `/assets/approved/${item.type}/${item.id}${extension}`;
}

function toManifestItem(item, approvedUrl) {
  const manifestItem = {
    id: item.id,
    role: item.role,
    biome: item.biome,
    src: approvedUrl
  };

  if (item.type === "visual" && item.layer) {
    manifestItem.layer = item.layer;
  }

  if (Array.isArray(item.tags) && item.tags.length > 0) {
    manifestItem.tags = item.tags;
  }

  return manifestItem;
}

function main() {
  const candidateManifest = readJson(paths.candidateManifest, { version: 1, items: [] });
  const reviewState = readJson(paths.reviewState, { version: 1, items: [] });
  const visualManifest = readJson(paths.visualManifest, { version: 1, items: [] });
  const audioManifest = readJson(paths.audioManifest, { version: 1, items: [] });

  const candidatesById = new Map(itemsFromManifest(candidateManifest).map((item) => [item.id, item]));
  const reviewItems = itemsFromManifest(reviewState);
  const approvedReviewIds = new Set(
    reviewItems.filter((item) => item.status === "approved").map((item) => item.id)
  );

  const targetManifests = {
    visual: visualManifest,
    audio: audioManifest
  };

  for (const manifest of Object.values(targetManifests)) {
    if (!Array.isArray(manifest.items)) {
      manifest.items = [];
    }
    if (!manifest.version) {
      manifest.version = 1;
    }
  }

  const existingIds = {
    visual: new Set(visualManifest.items.map((item) => item.id)),
    audio: new Set(audioManifest.items.map((item) => item.id))
  };

  const approved = [];
  const skipped = [];
  const errors = [];

  for (const id of approvedReviewIds) {
    const candidate = candidatesById.get(id);

    if (!candidate) {
      errors.push(`${id}：没有对应的候选素材条目。`);
      continue;
    }

    if (candidate.type !== "visual" && candidate.type !== "audio") {
      errors.push(`${id}：不支持的类型 "${candidate.type}"。`);
      continue;
    }

    if (existingIds[candidate.type].has(id)) {
      skipped.push(`${id}：已存在于 ${candidate.type} manifest。`);
      continue;
    }

    const source = publicUrlToFilePath(candidate.path);
    if (!source || !fs.existsSync(source)) {
      errors.push(`${id}：找不到源文件 ${candidate.path}。`);
      continue;
    }

    const approvedUrl = approvedUrlFor(candidate);
    const destination = publicUrlToFilePath(approvedUrl);
    if (!destination) {
      errors.push(`${id}：无法解析 approved 目标路径。`);
      continue;
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);

    targetManifests[candidate.type].items.push(toManifestItem(candidate, approvedUrl));
    existingIds[candidate.type].add(id);
    approved.push(`${id}：已复制到 ${relative(destination)}。`);
  }

  writeJson(paths.visualManifest, visualManifest);
  writeJson(paths.audioManifest, audioManifest);

  console.log("已入库资产：");
  console.log(approved.length > 0 ? approved.map((item) => `- ${item}`).join("\n") : "- 无");
  console.log("已跳过资产：");
  console.log(skipped.length > 0 ? skipped.map((item) => `- ${item}`).join("\n") : "- 无");

  if (errors.length > 0) {
    console.error("错误：");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
