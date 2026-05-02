const candidateManifest = {
  "version": 1,
  "items": []
};
const initialReviewState = {
  "version": 1,
  "batchId": "local-asset-review",
  "items": []
};

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
    `${candidates.length} 个候选 · ${counts.pending} 个待定 · ${counts.approved} 个通过 · ${counts.rejected} 个拒绝 · ${counts.needs_edit} 个需修改`;
}

function renderCard(item) {
  const reviewItem = getReviewItem(item.id);
  const card = document.createElement("article");
  card.className = "asset-card";

  card.append(renderPreview(item));

  const body = document.createElement("div");
  body.className = "asset-body";
  body.innerHTML = `
    <div class="asset-title">
      <h2>${escapeHtml(item.id)}</h2>
      <span class="badge">${escapeHtml(item.type)}</span>
    </div>
    <div class="meta">
      <span>${escapeHtml(item.biome || "未知生物群系")}</span>
      <span>${escapeHtml(item.role || "未知用途")}</span>
      ${item.layer ? `<span>${escapeHtml(item.layer)}</span>` : ""}
    </div>
    <p class="notes">${escapeHtml(item.notes || "暂无备注。")}</p>
  `;
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

  const blob = new Blob([JSON.stringify(payload, null, 2) + "\n"], { type: "application/json" });
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
