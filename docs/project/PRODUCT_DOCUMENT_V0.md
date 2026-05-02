# Run boy run Product Document v0 / 第 0 版产品文档

> 用途：这份文档是可以反喂给 ChatGPT 顾问的项目说明。它不是最终设计案，而是当前第 0 版事实、意图、工作方式和开放问题的集中描述。

## 1. Game Information / 游戏信息

### 1.1 Project identity / 项目身份

Run boy run 是一个 2D 横版氛围游戏，目前是 Vite + native JavaScript + Canvas 实现的 first-playable technical skeleton。它的核心不是闯关、战斗或数值成长，而是让玩家进入一种“持续向前、安静陪伴、被世界变化包围”的状态。

项目的主体验可以概括为：

- A rider and horse moving through an endless side-scrolling world.
- The world changes through biome, weather and time of day.
- Player agency is light, but the rhythm, scenery and sound should feel alive.
- The game should be calm, readable and emotionally durable for long sessions.

中文表达就是：玩家看着并轻度控制一名骑手与马，在不断生成的横版世界里前进。画面、天气、昼夜、音乐、环境声和马蹄声共同形成一种长期陪伴感。

### 1.2 Current version meaning / 当前“第 0 版”的含义

从现在开始，这份产品描述是项目的第 0 版产品基线。代码包版本仍是 `0.1.0`，但产品定义层面把当前状态称为 `Product Document v0`。

第 0 版不是完整游戏，也不是美术最终版。它代表：

- 项目方向已经被初步定义。
- 技术骨架已经存在。
- 多助手 + Codex + Version Pack 的工作方式开始成为正式流程。
- 后续所有建议都应该先对照这份文档，再进入版本包和任务列表。

### 1.2.1 How to run the current scaffold / 如何运行当前骨架

当前项目是本地 Vite 项目。运行方式：

```bash
npm install
npm run dev
```

然后在 Chrome 或 Edge 中打开终端打印出的 local URL。

### 1.3 Player fantasy / 玩家幻想

玩家不是在“赢下一局”，而是在“跟随一次持续的旅程”。骑手和马像是一个安静的中心，世界从身边流过。体验重点不是刺激，而是节奏、空间感、风景变化、天气情绪、声音层次，以及一种“还可以继续跑下去”的感觉。

期望的玩家感受：

- 稳定：操作和画面节奏不会让人焦虑。
- 流动：世界持续变化，但不混乱。
- 孤独但不空：画面和声音给人陪伴感。
- 轻介入：玩家能影响速度、状态或节奏，但不需要频繁高压操作。
- 可久留：音乐、色彩、动画和音效都不应让人快速疲劳。

### 1.4 Core loop / 核心循环

当前第 0 版的核心循环是：

```text
进入游戏
-> 骑手与马开始在横版世界中前进
-> 玩家轻度控制速度或状态
-> 世界按 segment / biome / weather / time 变化
-> 画面、音乐、环境声、马蹄声反馈当前状态
-> 玩家继续观察、调整、前进
```

这是一个 atmosphere-first loop。它暂时不依赖关卡胜负、复杂任务、战斗掉落或经济系统。

### 1.5 Player input / 玩家输入

当前已有键盘输入模型，支持速度层级和有限向左移动。未来输入设计应继续保持轻量：

- 不把游戏变成高频反应动作游戏。
- 不让操作打断氛围。
- 输入应影响节奏、状态和观察，而不是不断制造失败惩罚。
- 如果未来支持 controller 或 remapping，应沿用现有 input manager 思路。

### 1.6 World and structure / 世界结构

当前世界是无限横版生成结构。已有的技术概念包括：

- Tile
- Segment
- Biome chunk
- Theme / biome
- Weather preset
- Time preset
- Landmark placeholder

世界生成的目标不是复杂模拟，而是让风景有连续性和变化感。后续新增内容时，应优先考虑：

- 横版视差层级是否清楚。
- 素材是否能循环或平滑拼接。
- 地貌变化是否服务情绪，而不是只展示资产数量。
- 天气和昼夜变化是否能被玩家看见、听见、感受到。

### 1.7 Visual direction / 视觉方向

当前视觉方向是 pixel-art side-scrolling atmosphere，重点是：

- 清晰可读的横版层级。
- 远景、中景、地面、前景、UI 的职责明确。
- 主题之间有差异，但不应风格漂移。
- 色彩应有低疲劳度，避免过度饱和或强噪点。
- 资产应适合 Canvas renderer 和 layered parallax。

当前需要的视觉资产方向：

- Biome backgrounds: grassland, forest, snow wasteland, desert, seaside.
- Layered scenery: sky, far, mid, ground, foreground.
- Rider/horse sprite sheets: idle, walk, run, fast run, tired or transition states.
- Weather overlays or small motion loops: rain, snow, wind, clouds, sea movement.
- Landmark candidates: rare visual punctuation, not constant clutter.

所有 AI 生成视觉资产都应先进入 candidate，经人工 review 后再进入 approved。

### 1.8 Audio direction / 音效方向

音效服务长期聆听舒适度，而不是短时冲击力。当前已有 audio managers 和 audio manifest 占位，未来音效重点包括：

- Ambience loops: forest, wind, rain, snow, sea, night insects if appropriate.
- Hoofstep one-shots: grass, sand, stone or other surfaces.
- UI sounds: 如果加入，必须轻、短、不刺耳。
- Transition sounds: weather/time/theme change 可考虑极轻提示。

音频要求：

- Loop point 平滑。
- 响度稳定。
- 高频不要刺耳。
- 马蹄声需要多个变体，避免机械重复。
- 环境声不能抢音乐主空间。

音频自动生成当前不急。推荐先定义 manifest 字段、审查标准和少量人工筛选样例。

### 1.9 Music direction / 音乐方向

音乐应提供陪伴感，而不是抢占注意力。方向关键词：

- Ambient game loop.
- Minimal melody.
- No vocals by default.
- Soft dynamics.
- Low fatigue.
- Theme-aware but not over-scored.

音乐和 ambience 的关系很重要：音乐不应该把频段填满，尤其要给马蹄声、环境底噪和 UI 留空间。未来可以考虑按 theme/time/weather 切换，但第 0 版更需要先确定少量主循环的情绪标准。

### 1.10 Technical state / 技术状态

当前项目技术栈和结构：

- Vite project.
- Native JavaScript modules.
- Full-screen Canvas renderer.
- `requestAnimationFrame` game loop.
- Smooth pause timescale.
- Resize handling.
- Keyboard input model for speed tiers and limited left walk.
- Settings persistence.
- Event bus.
- Layered renderer.
- World managers.
- Rider/horse placeholder animation and state machine.
- Audio architecture placeholders.
- Settings drawer with bilingual toggle and required controls.
- Loading screen with optional asset failure tolerance.

主要目录：

- `src/game/`: game loop, time, orchestration.
- `src/core/`: input, settings, asset loading, random utilities.
- `src/world/`: biome, day/night, weather, segments, tiles, landmarks.
- `src/entities/rider/`: rider/horse state and animation.
- `src/render/`: Canvas renderer, camera, pixel scaler, render layers.
- `src/audio/`: music, ambience, hoofstep and crossfade managers.
- `src/ui/`: loading, settings, pause and text prompts.
- `tools/asset-pipeline/`: local asset review pipeline.

当前已实现的 technical scaffold 包括：

- Full-screen Canvas with resize handling.
- `requestAnimationFrame` game loop with smooth pause timescale.
- Theme/weather/time preset switching with non-repeating theme picks.
- Infinite segment generation using the Tile -> Segment -> Biome Chunk shape.
- Layered renderer: sky, far, mid, ground, rider, foreground, ui.
- Rider/horse placeholder silhouette animation and state machine.
- Audio architecture placeholders with non-blocking fallback.
- Loading screen that continues even when optional assets fail.

当前仍是 placeholder 或接口预留的部分：

- Landmark system through `LandmarkManager`.
- Deterministic seeded journey implementation through `SeededRandom` stub.
- Sprite atlas playback through `SpriteAnimator`.
- Real audio asset playback and content-filled manifests.
- Focus Journey progression and achievements.

### 1.11 Asset pipeline / 资产管线

当前已有本地资产审查 MVP：

```text
AI or manual asset
-> public/assets/candidates/
-> src/assets/candidateManifest.json
-> npm run assets:prepare
-> local review site
-> export reviewState.json
-> npm run assets:approve
-> approved manifests
```

关键原则：

- Candidate 是候选，不等于能进游戏。
- Review 是人工判断，不应跳过。
- Approved 才能进入正式 manifest。
- 通过 manifest 管理资产，而不是在代码里散落硬编码路径。

当前 manifest 基本为空，因此下一阶段适合先锁定 taxonomy 和审查标准，而不是急着批量生成。

### 1.12 Current risks / 当前风险

产品风险：

- 游戏可能变成素材展示，而不是有节奏的旅程体验。
- 核心体验如果不清楚，后续功能会不断膨胀。
- 多助手建议可能互相冲突，需要 Codex 统一整合。

技术风险：

- 过早自动化 ComfyUI / Asset Orchestrator 会放大错误资产和风格漂移。
- Approved 资产如何进入 renderer/audio manager 的边界还没完全锁定。
- 如果不维护 Version Pack，决策会散落在聊天记录里。

美术风险：

- Pixel art 风格不统一。
- 背景不可循环或层级不清。
- 天气和时间变化只换颜色，缺少实际体验差异。

音频和音乐风险：

- 循环疲劳。
- 马蹄声机械重复。
- 音乐太满，压住环境声。
- 响度不统一，长时间听感不舒服。

### 1.13 Current non-goals / 当前不做

第 0 版不做：

- 大型游戏引擎迁移。
- 战斗系统。
- 复杂任务系统。
- 经济、背包、装备系统。
- 云端资产审查。
- 自动调用图片/音频/音乐生成 API。
- 保存原始长对话作为长期事实源。
- 绕过人工 review 的资产接入。

## 2. Developer Operation Model / 开发者如何操作这个项目

### 2.1 Developer role / 开发者角色

开发者是项目方向的最终拍板者。Codex 和 5 个 ChatGPT 助手都不是事实源本身，而是协作工具。

开发者负责：

- 提出下一版想验证的方向。
- 把 Codex 生成的入口复制给对应 ChatGPT 助手。
- 把 5 个助手的结构化输出贴回 Codex。
- 回答 must-answer questions。
- 决定哪些建议进入下一版。
- 审查资产是否从 candidate 进入 approved。

### 2.2 Codex role / Codex 角色

Codex 是 repo executor + version integrator。

Codex 负责：

- 读取 repo 当前事实。
- 维护 `docs/project/`、`docs/iterations/`、`docs/assistants/`。
- 把 5 个助手输出提炼为 Version Pack。
- 找出共识、冲突、过期建议、开放问题。
- 把用户拍板的内容写入 decision log。
- 在 Version Pack 支持时实施代码或文档改动。
- 运行验证并说明风险。

Codex 不应该：

- 机械拼接五个助手长对话。
- 把 ChatGPT 项目园当唯一事实源。
- 在没有版本包支持时随意改核心代码。
- 把 AI 资产直接接入游戏。

### 2.3 Five ChatGPT assistants / 五个 ChatGPT 助手

当前有 5 个助手：

1. 项目核心与设计风险  
   负责核心体验、范围控制、设计风险、玩家感受和版本目标。

2. 项目结构与技术风险  
   负责技术架构、代码结构、pipeline 风险、Codex prompt 和落地可行性。

3. 音乐风格设计与规划  
   负责音乐风格、动态播放策略、长期陪伴感、音乐与 ambience 的关系。

4. 美术规范  
   负责视觉风格、pixel art 规范、ComfyUI visual preset、参考图分析和 taxonomy。

5. 音效规划  
   负责环境声、马蹄声、audio manifest、响度、循环点和长期听感。

每个助手都应该按固定结构输出：

- Summary
- Domain-specific risks
- Recommended changes
- Questions for user
- Codex-ready tasks
- Things to avoid
- Confidence level

### 2.4 Normal iteration loop / 常规迭代流程

每一轮改版按这个顺序进行：

```text
1. Codex 读取 repo 当前 Version Pack
2. Codex 生成或更新五助手入口
3. 开发者把入口复制给 5 个 ChatGPT 助手
4. 5 个助手分别输出结构化建议
5. 开发者把 5 份输出贴回 Codex
6. Codex 综合，不拼接
7. Codex 输出共识、冲突、推荐方向、必答问题
8. 开发者回答必答问题
9. Codex 锁定下一版 Version Pack
10. Codex 按版本包实施必要改动
11. 开发者把共享摘要同步回 ChatGPT 项目园
```

### 2.5 What developer copies to ChatGPT / 开发者复制给 ChatGPT 的内容

每轮建议复制：

- `docs/assistants/00_SHARED_CONTEXT.md`
- 最新 `docs/iterations/<version>/ITERATION_BRIEF.md`
- 最新 `docs/iterations/<version>/NEXT_PROMPTS.md`
- 对应助手自己的入口文档
- 必要时复制本产品文档 `docs/project/PRODUCT_DOCUMENT_V0.md`

不建议复制：

- 全部历史长对话。
- 整个代码库。
- 所有旧版本包。
- 没有被 Codex 提炼过的散乱建议。

### 2.6 How versioning works / 版本如何运转

产品文档层面：

- 当前是 `Product Document v0`。
- 它是最初版产品基线。
- 后续如果核心体验、工作流或边界发生较大变化，可以生成 `Product Document v1`。

代码和迭代包层面：

- 当前 package version 是 `0.1.0`。
- 当前 Version Pack 是 `docs/iterations/v0.1.0/`。
- `v0.1.x` 主要处理文档、工作流和技术骨架稳定。
- `v0.2.x` 进入 asset pipeline 和 visual taxonomy。
- `v0.3.x` 再考虑 ComfyUI / Asset Orchestrator preset。
- `v0.4.x` 进入 real visual asset integration。
- `v0.5.x` 进入 audio/music integration。

### 2.7 How assets are handled / 开发者如何处理资产

开发者拿到图片、音频或音乐素材后，不应直接让它们进入游戏。

推荐步骤：

```text
1. 把素材放入 public/assets/candidates/
2. 在 src/assets/candidateManifest.json 登记
3. 运行 npm run assets:prepare
4. 打开本地 review site 审查
5. 导出 reviewState.json
6. 覆盖 src/assets/reviewState.json
7. 运行 npm run assets:approve
8. Approved 资产进入正式 manifest
```

当前阶段，资产进入 manifest 不代表已经完全接入 gameplay 或 renderer。是否接入运行时，需要由 Version Pack 决定。

### 2.8 How decisions are made / 决策如何进入项目

不是所有建议都进入项目。建议进入项目需要经过：

```text
Assistant suggestion
-> Codex synthesis
-> User decision
-> DECISION_LOG or Version Pack
-> Codex task
-> Implementation
-> Validation
```

如果一个建议没有写进 `docs/project/DECISION_LOG.md`、`docs/project/OPEN_QUESTIONS.md` 或最新 Version Pack，它就不应被当成长期事实。

### 2.9 How ChatGPT should give advice / 给 ChatGPT 顾问的要求

ChatGPT 顾问阅读这份文档后，应该输出：

- 当前理解摘要。
- 最大产品风险。
- 最大技术或管线风险。
- 下一版最值得验证的目标。
- 不建议现在做的内容。
- 需要开发者拍板的问题。
- 可交给 Codex 的任务列表。

ChatGPT 顾问不应该：

- 假设项目已经有完整美术、音乐或音频资产。
- 建议马上重写技术栈。
- 用长篇设定代替可执行任务。
- 建议跳过人工资产审查。
- 把所有好点子都塞进下一版。

## 3. Suggested Questions for ChatGPT / 建议反问 ChatGPT 的问题

把这份文档喂给 ChatGPT 后，可以问：

1. 你认为这个第 0 版产品定义里，最不清楚的部分是什么？
2. 哪些内容会让游戏偏离“安静、持续、陪伴感”的核心体验？
3. v0.2 应该优先验证 visual taxonomy、asset pipeline，还是玩家可感知的画面变化？
4. 哪些功能现在看起来诱人，但应该明确放进 Not now？
5. 五助手工作流里，哪个环节最容易产生上下文污染？
6. 如果只允许下一版做 3 件事，你建议是哪 3 件？

## 4. Current Ask / 当前希望 ChatGPT 帮忙的事

请基于这份第 0 版产品文档，给出结构化建议：

- Summary
- Product risks
- Workflow risks
- Recommended v0.2 direction
- Must-answer questions for the developer
- Codex-ready tasks
- Things to avoid
- Confidence level
