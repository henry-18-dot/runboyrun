import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const reviewDir = path.join(repoRoot, "public", "review");

const candidateManifestPath = path.join(repoRoot, "src", "assets", "candidateManifest.json");
const reviewStatePath = path.join(repoRoot, "src", "assets", "reviewState.json");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeFile(fileName, content) {
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(reviewDir, fileName), `${content.trim()}\n`);
}

function main() {
  const candidateManifest = readJson(candidateManifestPath, { version: 1, items: [] });
  const reviewState = readJson(reviewStatePath, { version: 1, batchId: "local-asset-review", items: [] });

  writeFile("index.html", buildHtml());
  writeFile("review.css", buildCss());
  writeFile("review.js", buildJs(candidateManifest, reviewState));

  console.log("审查页面已生成：public/review/index.html");
}

function buildHtml() {
  return `
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Run boy run 资产审查</title>
    <link rel="stylesheet" href="./review.css">
  </head>
  <body>
    <main class="app-shell">
      <header class="review-header">
        <div>
          <p class="eyebrow">Run boy run</p>
          <h1>资产审查</h1>
        </div>
        <button id="export-review" class="primary-action" type="button">导出审查 JSON</button>
      </header>

      <section class="notice">
        静态页面不能直接写回仓库。审查修改会先保存在这个浏览器里。
        导出 JSON 后，请用它覆盖 <code>src/assets/reviewState.json</code>，再运行入库脚本。
      </section>

      <section class="toolbar" aria-label="资产筛选">
        <label>
          类型
          <select id="type-filter"></select>
        </label>
        <label>
          生物群系
          <select id="biome-filter"></select>
        </label>
        <label>
          状态
          <select id="status-filter"></select>
        </label>
      </section>

      <section id="summary" class="summary" aria-live="polite"></section>
      <section id="asset-list" class="asset-list"></section>
    </main>

    <script src="./review.js"></script>
  </body>
</html>
`;
}

function buildCss() {
  return `
:root {
  color-scheme: dark;
  --bg: #111416;
  --panel: #171d20;
  --panel-soft: #1d2529;
  --line: #2a363b;
  --text: #e0e4df;
  --muted: #9da9a1;
  --accent: #b8c98c;
  --accent-strong: #d0e0a0;
  --danger: #d9967e;
  --warn: #d8be7b;
  --shadow: rgba(0, 0, 0, 0.28);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #0e1213 0%, var(--bg) 36%, #151813 100%);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
select,
textarea {
  border: 1px solid var(--line);
}

.app-shell {
  width: min(1440px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 28px 0 40px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 0 20px;
}

.eyebrow {
  margin: 0 0 5px;
  color: var(--accent);
  font-size: 0.78rem;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4.25rem);
  line-height: 0.95;
  letter-spacing: 0;
}

.primary-action,
.status-button {
  min-height: 40px;
  border-radius: 6px;
  background: var(--panel-soft);
  color: var(--text);
  cursor: pointer;
}

.primary-action {
  padding: 0 18px;
  background: var(--accent);
  border-color: var(--accent);
  color: #15170f;
  font-weight: 700;
}

.notice,
.toolbar,
.summary {
  border: 1px solid var(--line);
  background: rgba(23, 29, 32, 0.88);
  box-shadow: 0 16px 40px var(--shadow);
}

.notice {
  padding: 14px 16px;
  border-radius: 8px;
  color: var(--muted);
}

code {
  color: var(--accent-strong);
}

.toolbar {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 16px;
  padding: 14px;
  border-radius: 8px;
}

label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 0.82rem;
}

select,
textarea {
  width: 100%;
  border-radius: 6px;
  background: #101416;
  color: var(--text);
}

select {
  min-height: 40px;
  padding: 0 10px;
}

.summary {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  color: var(--muted);
}

.asset-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.asset-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: 0 18px 44px var(--shadow);
}

.asset-preview {
  display: grid;
  place-items: center;
  min-height: 210px;
  background: #0b0d0e;
  border-bottom: 1px solid var(--line);
}

.asset-preview img {
  display: block;
  max-width: 100%;
  max-height: 320px;
  image-rendering: pixelated;
  object-fit: contain;
}

.audio-preview {
  width: 100%;
  padding: 28px 18px;
}

audio {
  width: 100%;
}

.asset-body {
  padding: 14px;
}

.asset-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.asset-title h2 {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 1rem;
  letter-spacing: 0;
}

.badge {
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: #253035;
  color: var(--muted);
  font-size: 0.72rem;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
  color: var(--muted);
  font-size: 0.82rem;
}

.notes {
  margin: 0;
  color: #c8d0c9;
  line-height: 1.5;
}

.review-controls {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--line);
  background: rgba(10, 13, 14, 0.24);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.status-button {
  padding: 0 8px;
  color: var(--muted);
}

.status-button.is-active {
  border-color: var(--accent);
  background: rgba(184, 201, 140, 0.16);
  color: var(--accent-strong);
}

.status-button[data-status="rejected"].is-active {
  border-color: var(--danger);
  background: rgba(217, 150, 126, 0.14);
  color: #efb9a6;
}

.status-button[data-status="needs_edit"].is-active {
  border-color: var(--warn);
  background: rgba(216, 190, 123, 0.14);
  color: #edda9b;
}

textarea {
  min-height: 84px;
  padding: 10px;
  resize: vertical;
  line-height: 1.4;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 40px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  color: var(--muted);
  text-align: center;
}

@media (max-width: 760px) {
  .app-shell {
    width: min(100vw - 20px, 720px);
    padding-top: 16px;
  }

  .review-header,
  .toolbar {
    grid-template-columns: 1fr;
  }

  .review-header {
    display: grid;
  }

  .asset-list {
    grid-template-columns: 1fr;
  }

  .status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
}

function buildJs(candidateManifest, reviewState) {
  return `
const candidateManifest = ${JSON.stringify(candidateManifest, null, 2)};
const initialReviewState = ${JSON.stringify(reviewState, null, 2)};

const STORAGE_KEY = "run-boy-run.asset-review.v1";
const statuses = ["pending", "approved", "rejected", "needs_edit"];
const statusLabels = {
  pending: "待定",
  approved: "通过",
  rejected: "拒绝",
  needs_edit: "需修改"
};

const elements = {
  list: document.querySelector("#asset-list"),
  summary: document.querySelector("#summary"),
  typeFilter: document.querySelector("#type-filter"),
  biomeFilter: document.querySelector("#biome-filter"),
  statusFilter: document.querySelector("#status-filter"),
  exportButton: document.querySelector("#export-review")
};

const candidates = Array.isArray(candidateManifest.items) ? candidateManifest.items : [];
let reviewState = loadReviewState();

function loadReviewState() {
  const fromDisk = normalizeReviewState(initialReviewState);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return fromDisk;
  }

  try {
    return mergeReviewState(fromDisk, normalizeReviewState(JSON.parse(stored)));
  } catch (error) {
    console.warn("已忽略无效的本地审查状态。", error);
    return fromDisk;
  }
}

function normalizeReviewState(state) {
  return {
    version: state?.version || 1,
    batchId: state?.batchId || "local-asset-review",
    items: Array.isArray(state?.items) ? state.items : []
  };
}

function mergeReviewState(base, overlay) {
  const byId = new Map(base.items.map((item) => [item.id, item]));
  for (const item of overlay.items) {
    if (item?.id) {
      byId.set(item.id, { ...byId.get(item.id), ...item });
    }
  }
  return { ...base, ...overlay, items: Array.from(byId.values()) };
}

function getReviewItem(id) {
  let item = reviewState.items.find((entry) => entry.id === id);
  if (!item) {
    const candidate = candidates.find((entry) => entry.id === id);
    item = {
      id,
      status: candidate?.status || "pending",
      reviewNote: ""
    };
    reviewState.items.push(item);
  }
  return item;
}

function saveReviewState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewState, null, 2));
}

function setOptions(select, values, label) {
  select.innerHTML = "";
  select.append(new Option(label, "all"));
  for (const value of values) {
    select.append(new Option(value, value));
  }
}

function setupFilters() {
  const types = [...new Set(candidates.map((item) => item.type).filter(Boolean))].sort();
  const biomes = [...new Set(candidates.map((item) => item.biome).filter(Boolean))].sort();

  setOptions(elements.typeFilter, types, "全部类型");
  setOptions(elements.biomeFilter, biomes, "全部生物群系");
  setOptions(elements.statusFilter, statuses, "全部状态");

  for (const select of [elements.typeFilter, elements.biomeFilter, elements.statusFilter]) {
    select.addEventListener("change", render);
  }
}

function selectedFilters() {
  return {
    type: elements.typeFilter.value,
    biome: elements.biomeFilter.value,
    status: elements.statusFilter.value
  };
}

function candidateStatus(item) {
  return getReviewItem(item.id).status || item.status || "pending";
}

function filteredCandidates() {
  const filters = selectedFilters();
  return candidates.filter((item) => {
    if (filters.type !== "all" && item.type !== filters.type) {
      return false;
    }
    if (filters.biome !== "all" && item.biome !== filters.biome) {
      return false;
    }
    if (filters.status !== "all" && candidateStatus(item) !== filters.status) {
      return false;
    }
    return true;
  });
}

function render() {
  const items = filteredCandidates();
  elements.list.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "没有符合当前筛选条件的候选资产。";
    elements.list.append(empty);
  } else {
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      fragment.append(renderCard(item));
    }
    elements.list.append(fragment);
  }

  renderSummary();
}

function renderSummary() {
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const item of candidates) {
    counts[candidateStatus(item)] += 1;
  }

  elements.summary.textContent =
    \`\${candidates.length} 个候选 · \${counts.pending} 个待定 · \${counts.approved} 个通过 · \${counts.rejected} 个拒绝 · \${counts.needs_edit} 个需修改\`;
}

function renderCard(item) {
  const reviewItem = getReviewItem(item.id);
  const card = document.createElement("article");
  card.className = "asset-card";

  card.append(renderPreview(item));

  const body = document.createElement("div");
  body.className = "asset-body";
  body.innerHTML = \`
    <div class="asset-title">
      <h2>\${escapeHtml(item.id)}</h2>
      <span class="badge">\${escapeHtml(item.type)}</span>
    </div>
    <div class="meta">
      <span>\${escapeHtml(item.biome || "未知生物群系")}</span>
      <span>\${escapeHtml(item.role || "未知用途")}</span>
      \${item.layer ? \`<span>\${escapeHtml(item.layer)}</span>\` : ""}
    </div>
    <p class="notes">\${escapeHtml(item.notes || "暂无备注。")}</p>
  \`;
  card.append(body);

  const controls = document.createElement("div");
  controls.className = "review-controls";

  const buttonGrid = document.createElement("div");
  buttonGrid.className = "status-grid";
  for (const status of statuses) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "status-button";
    button.dataset.status = status;
    button.textContent = statusLabels[status];
    button.classList.toggle("is-active", reviewItem.status === status);
    button.addEventListener("click", () => {
      reviewItem.status = status;
      reviewItem.updatedAt = new Date().toISOString();
      if (status === "approved") {
        reviewItem.approvedAt = reviewItem.approvedAt || new Date().toISOString();
      } else {
        delete reviewItem.approvedAt;
      }
      saveReviewState();
      render();
    });
    buttonGrid.append(button);
  }

  const note = document.createElement("textarea");
  note.placeholder = "审查备注";
  note.value = reviewItem.reviewNote || "";
  note.addEventListener("input", () => {
    reviewItem.reviewNote = note.value;
    reviewItem.updatedAt = new Date().toISOString();
    saveReviewState();
  });

  controls.append(buttonGrid, note);
  card.append(controls);

  return card;
}

function renderPreview(item) {
  const preview = document.createElement("div");
  preview.className = "asset-preview";

  if (item.type === "visual") {
    const image = document.createElement("img");
    image.src = item.path;
    image.alt = item.id;
    image.loading = "lazy";
    preview.append(image);
    return preview;
  }

  if (item.type === "audio") {
    const wrapper = document.createElement("div");
    wrapper.className = "audio-preview";
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.loop = true;
    audio.src = item.path;
    wrapper.append(audio);
    preview.append(wrapper);
    return preview;
  }

  preview.textContent = "不支持的资产类型。";
  return preview;
}

function exportReviewState() {
  const candidateIds = new Set(candidates.map((item) => item.id));
  const items = reviewState.items
    .filter((item) => candidateIds.has(item.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  const payload = {
    version: 1,
    batchId: reviewState.batchId || "local-asset-review",
    exportedAt: new Date().toISOString(),
    items
  };

  const blob = new Blob([JSON.stringify(payload, null, 2) + "\\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reviewState.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

elements.exportButton.addEventListener("click", exportReviewState);
setupFilters();
render();
`;
}

try {
  main();
} catch (error) {
  console.error(`生成审查页面失败：${error.message}`);
  process.exit(1);
}
