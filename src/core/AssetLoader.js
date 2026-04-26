export class AssetLoader {
  async loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }
    return response.json();
  }

  async loadAll({ entries, onProgress }) {
    const result = {};
    let completed = 0;
    for (const entry of entries) {
      try {
        result[entry.key] = await this.loadJson(entry.url);
      } catch (error) {
        result[entry.key] = null;
      }
      completed += 1;
      onProgress?.(completed / entries.length, entry.key);
    }
    return result;
  }
}
