export function renderVisualLayers(ctx, viewport, cameraX, cache, layers) {
  for (const layer of layers) {
    const image = cache.get(layer.src);
    if (!image) {
      continue;
    }
    renderTiledImage(ctx, viewport, cameraX, image, layer);
  }
}

function renderTiledImage(ctx, viewport, cameraX, image, layer) {
  const sourceWidth = layer.width || image.naturalWidth || image.width;
  const sourceHeight = layer.height || image.naturalHeight || image.height;
  const scale = viewport.height / sourceHeight;
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const parallax = Number.isFinite(layer.parallax) ? layer.parallax : 1;
  const offset = positiveModulo(cameraX * parallax, drawWidth);

  let x = -offset - drawWidth;
  while (x < viewport.width + drawWidth) {
    ctx.drawImage(image, Math.round(x), 0, Math.ceil(drawWidth), Math.ceil(drawHeight));
    x += drawWidth;
  }
}

function positiveModulo(value, size) {
  return ((value % size) + size) % size;
}
