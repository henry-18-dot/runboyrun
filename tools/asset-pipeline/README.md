# 资产审查生产线

这条生产线的目标是：AI 生成的素材先进入候选区，只有经过你确认后，才会进入游戏正式 manifest。

## 1. 添加候选文件

把生成好的文件放到这里：

```text
public/assets/candidates/visual/
public/assets/candidates/audio/
```

文件名要稳定、可读：

```text
{biome}_{layer}_{assetRole}_{index}.{ext}
grassland_mid_tree_cluster_001.png
forest_ambience_loop_001.wav
```

## 2. 编辑候选 manifest

把每个候选素材登记到 `src/assets/candidateManifest.json`。

视觉素材示例：

```json
{
  "id": "grassland_mid_tree_cluster_001",
  "type": "visual",
  "role": "tree_cluster",
  "biome": "grassland",
  "layer": "midground",
  "path": "/assets/candidates/visual/grassland_mid_tree_cluster_001.png",
  "status": "pending",
  "notes": "安静的中景树丛，自然的像素剪影。",
  "tags": ["pixel-art", "nature", "calm"]
}
```

音频素材示例：

```json
{
  "id": "forest_ambience_loop_001",
  "type": "audio",
  "role": "ambience_loop",
  "biome": "forest",
  "path": "/assets/candidates/audio/forest_ambience_loop_001.wav",
  "status": "pending",
  "notes": "柔和的森林环境循环，没有刺耳鸟叫。",
  "tags": ["ambient", "loop", "forest"]
}
```

## 3. 准备审查页面

运行：

```bash
npm run assets:prepare
```

这会校验 `candidateManifest.json`，并重新生成 `public/review/`。

## 4. 审查候选素材

启动本地静态服务器：

```bash
npm run assets:serve
```

打开：

```text
http://127.0.0.1:4173/review/
```

页面会先把审查修改保存在浏览器的 `localStorage` 里。

每个素材可以选择：

```text
pending
approved
rejected
needs_edit
```

需要时可以补充审查备注。

## 5. 导出审查状态

在审查页面点击 `导出审查 JSON`。然后用下载得到的文件覆盖：

```text
src/assets/reviewState.json
```

也就是把导出的 `reviewState.json` 放到上面这个路径。

静态网页不能直接写回你的仓库，所以 MVP 版本保留这个手动覆盖步骤。

## 6. 把通过的素材写入正式 manifest

运行：

```bash
npm run assets:approve
```

脚本会读取：

```text
src/assets/candidateManifest.json
src/assets/reviewState.json
```

凡是在 `reviewState.json` 中状态为 `approved` 的素材，都会被复制到：

```text
public/assets/approved/visual/
public/assets/approved/audio/
```

并写入：

```text
src/assets/visualManifest.json
src/assets/audioManifest.json
```

重复 id 会被跳过。

## 7. 这个 MVP 不会自动做什么

- 不会调用图片或音频生成 API。
- 不会修改 renderer、audio manager 或游戏玩法代码。
- 不会删除被拒绝的素材。
- 不会转码音频，也不会测量 LUFS。
- 不会部署审查页面。
- 不会从浏览器里自动覆盖 `src/assets/reviewState.json`。

推荐使用流程：

```text
AI 生成候选素材
-> 你添加文件和 manifest 条目
-> npm run assets:prepare
-> 在 public/review/ 审查
-> 导出 reviewState.json
-> npm run assets:approve
-> 通过的素材 manifest 就准备好给游戏接入了
```
