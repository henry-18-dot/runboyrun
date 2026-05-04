import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(repoRoot, "public");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webp": "image/webp"
};

function resolveSafe(root, relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return resolved;
}

function resolveRequest(url) {
  const parsed = new URL(url || "/", `http://${host}:${port}`);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === "/") {
    return path.join(repoRoot, "index.html");
  }

  if (pathname === "/review") {
    pathname = "/review/";
  }

  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  if (pathname.startsWith("/assets/") || pathname.startsWith("/review/")) {
    return resolveSafe(publicRoot, pathname.slice(1));
  }

  if (pathname.startsWith("/src/")) {
    return resolveSafe(repoRoot, pathname.slice(1));
  }

  return resolveSafe(repoRoot, pathname.slice(1));
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequest(request.url);

  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Run Boy Run dev server: http://${host}:${port}/`);
});
