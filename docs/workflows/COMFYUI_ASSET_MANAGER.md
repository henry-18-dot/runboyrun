# ComfyUI Asset Manager / ComfyUI 管家

## Purpose / 目的

让 Codex 代管 Run Boy Run 的 ComfyUI 视觉资产生成细节。用户只需要提供参考图、提示词或修改意见；Codex 负责归档输入、迭代 prompt、运行 ComfyUI、生成分层候选图、制作 compact 预览，并把候选资产放入本项目审核区。

AI 生成图像永远先进入 `candidate`。不要直接写入 `approved`，不要绕过人工审核，不要自动修改游戏运行时代码。

## Default Workflow / 默认工作流

1. 接收输入：用户可在 Codex 对话框贴图、写 prompt、写修改意见，或把参考图放入本轮约定的 ComfyUI 输入目录。
2. 归档输入：Codex 在 ComfyUI 工作包内保存参考图、prompt JSON、运行脚本、运行报告和中间输出。
3. 生成分层图：默认生成横版分层图片，而不是把完整游戏场景杂糅成一张概念图。
4. 制作 compact：每批必须生成 contact sheet / compact 预览，用于快速横向比较。
5. 生成风格校准文件：每批必须附带 `STYLE_REVIEW.md`，帮助用户快速选择更接近产品基调的方向。
6. 写入候选区：最终候选 PNG 复制到 `public/assets/candidates/visual/`。
7. 登记 manifest：更新 `src/assets/candidateManifest.json`，所有新条目状态为 `pending`。
8. 验证审核入口：运行 `npm run assets:validate`，需要审查页面时再运行 `npm run assets:prepare` 和 `npm run assets:serve`。

## Layer Contract / 图层规范

默认输出五个横版 parallax 图层：

- `sky`: 天空、云、时间与天气基调。
- `far`: 远山、远地平线、大气透视。
- `mid`: 中景草坡、树带、湖泊、主要自然形体。
- `ground`: 可横向行进的地面带、道路感、角色活动区域。
- `foreground`: 稀疏近景草、近景遮挡、速度感元素。

默认生成独立横向层 PNG。后续如需透明切片、mask 或整图合成，应在当批任务中显式说明。

## Naming And Manifest / 命名与 Manifest

候选文件命名必须稳定、可读：

```text
{biome}_{layer}_{assetRole}_{index}.png
```

示例：

```text
grassland_far_mountain_ridge_001.png
grassland_ground_meadow_route_001.png
```

`biome` 使用现有项目值：

```text
grassland / forest / snow_wasteland / desert / seaside
```

候选 manifest 条目使用当前 asset pipeline schema：

```json
{
  "id": "grassland_far_mountain_ridge_001",
  "type": "visual",
  "role": "mountain_ridge",
  "biome": "grassland",
  "layer": "far",
  "path": "/assets/candidates/visual/grassland_far_mountain_ridge_001.png",
  "status": "pending",
  "notes": "AI-generated candidate. Layered parallax source; not approved.",
  "tags": ["ai-generated", "pixel-art-inspired", "parallax", "grassland"]
}
```

不要把 AI 图像直接写入 `src/assets/visualManifest.json`。只有用户在审查页面批准后，才通过 `npm run assets:approve` 进入正式 manifest。

## How Codex Runs ComfyUI / 我是如何工作的

- 检测 ComfyUI API 是否运行，默认优先 `http://127.0.0.1:8188`。
- 检测 checkpoint、模型目录、输出目录和 GPU 可用性。
- 优先使用简单、可复盘的 API workflow：checkpoint -> prompt encode -> latent -> sampler -> VAE decode -> save image。
- 自动选择可用 sampler / scheduler；失败时降低分辨率、减少 steps 或记录失败原因。
- 不把失败伪装成成功。若缺模型、API 启动失败或图片不存在，必须写清楚 `RUN_REPORT.md` 和下一步修复方式。
- 每批保留 ComfyUI 原始输出、prompt JSON、candidate manifest 草稿、compact 预览和运行报告。

## Inputs Users Can Provide / 你如何给我输入

用户可以提供任意组合：

- 直接在 Codex 对话框贴参考图。
- 在 Codex 对话框写提示词、风格要求、负面反馈或修改意见。
- 把参考图放进当批约定的输入目录，并告诉 Codex 批次目标。
- 指定 biome、weather、time preset、色彩倾向、图层数量、assetRole、生成张数、是否沿用上一批方向。

如果用户只给模糊方向，Codex 使用当前项目默认值：横版、pixel-art inspired、低疲劳色彩、Canvas layered parallax、candidate only、每批 compact。

## Batch Outputs / 每批输出什么

每批默认产出：

- ComfyUI 原始输出图。
- 分层候选 PNG。
- compact/contact sheet 预览。
- `STYLE_REVIEW.md` 风格校准文件。
- prompt JSON。
- `RUN_REPORT.md`。
- `candidateManifest` 草稿或直接合并到 `src/assets/candidateManifest.json`。

写入 Run Boy Run 审核区后，必须确认：

- 候选 PNG 文件存在于 `public/assets/candidates/visual/`。
- `src/assets/candidateManifest.json` 中路径指向真实文件。
- 新条目 `status` 全部是 `pending`。
- `public/assets/approved/visual/` 和 `src/assets/visualManifest.json` 未被绕过修改。

## Style Calibration / 产品基调校准

每批生成后，Codex 必须附带一个 `STYLE_REVIEW.md`。它不替代审核页面，而是用于把用户的美术偏好沉淀成下一批 prompt 和候选标准。

`STYLE_REVIEW.md` 默认包含：

- 本批 compact 路径和候选文件列表。
- “最接近产品基调”的 1-3 个候选编号。
- “明确不要继续”的候选编号。
- 分辨率偏好：更高细节、当前尺寸、或更像像素预览。
- 风格偏好：更明亮、更克制、更诗意、更游戏资产化、更少 AI 绘画感。
- 层级偏好：sky/far/mid/ground/foreground 哪些层最成功，哪些层需要重做。
- 疲劳度判断：哪些图适合长期观看，哪些太吵、太艳或太复杂。
- 下一批 prompt 修改建议：Codex 根据用户反馈写成可执行的 prompt delta。

如果当批已经写入 Run Boy Run 审核区，Codex 也可以把简短问题写进候选条目的 `notes`，但正式偏好记录仍以工作包里的 `STYLE_REVIEW.md` 为准。审核页面负责素材状态，`STYLE_REVIEW.md` 负责产品基调校准。

推荐模板：

```markdown
# Style Review

## Pick

- Best direction:
- Keep exploring:
- Reject direction:

## Product Tone

- Resolution preference:
- Color preference:
- Layer readability:
- Long-session comfort:
- Game-asset readiness:

## Next Prompt Delta

- More:
- Less:
- Must keep:
- Must avoid:
```

## How To Adjust The Manager / 如何调整我

可以直接用自然语言调整：

- `biome`: 例如 `grassland`、`forest`、`snow_wasteland`。
- `weather`: 例如 clear、rain、snow、wind、cloudy。
- `time preset`: dawn、noon、dusk、night。
- 色彩：更亮、更灰、更低饱和、更诗意、更像黄昏。
- 构图：更空、更横向、更少角色、更明确 parallax 层级。
- 图层：只生成某几层，或增加 cloud / overlay 等临时层。
- 参考图权重：更贴近参考图，或只取 mood 不取构图。
- 批量规模：默认小批量可审查；需要时再扩大。

## Manual Operation / 自己亲手跑需要知道什么

常用位置：

```text
ComfyUI workspace: D:\ComfyUI
ComfyUI API: http://127.0.0.1:8188
ComfyUI checkpoints: D:\ComfyUI\models\checkpoints
Run Boy Run repo: C:\Users\Henry_1\Desktop\runboyrun
Visual candidate folder: public/assets/candidates/visual/
Candidate manifest: src/assets/candidateManifest.json
Review state: src/assets/reviewState.json
Approved visual manifest: src/assets/visualManifest.json
```

审核命令：

```powershell
npm run assets:prepare
npm run assets:serve
```

打开本地审查页：

```text
http://127.0.0.1:4173/review/
```

审查页面导出 `reviewState.json` 后，用它覆盖：

```text
src/assets/reviewState.json
```

再把 approved 候选写入正式 manifest：

```powershell
npm run assets:approve
```

## Guardrails / 边界

- 不把 AI 候选图直接放入 approved。
- 不把候选图直接接入 renderer。
- 不自动修改游戏运行时代码。
- 不删除已有 ComfyUI 输出。
- 不声称生成成功，除非图片文件、compact、`STYLE_REVIEW.md` 和 manifest 记录都真实存在。
- 当前流程只固定视觉资产；音频、动画、正式接入继续延后。
