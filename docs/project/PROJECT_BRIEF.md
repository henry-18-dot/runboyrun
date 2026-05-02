# Project Brief / 项目简介

## Positioning / 项目定位

Run boy run 是一个 Vite + native JavaScript + Canvas 的 2D 横版氛围游戏技术骨架。核心不是高强度战斗，而是长时间陪伴感、稳定奔跑节奏、天气/时间/地貌变化带来的情绪流动。

## Core Experience / 核心体验

- 玩家观看并轻度控制骑手与马在无限横版世界中前进。
- 世界通过 theme、weather、time preset 和 procedural segment 形成持续变化。
- 视觉、音乐、环境声和马蹄声共同服务于 calm but moving 的体验。

## Technical Route / 技术路线

- Runtime: Vite + native JS modules + full-screen Canvas。
- Architecture: `game/`, `core/`, `world/`, `entities/rider/`, `render/`, `audio/`, `ui/`。
- Assets: 先使用 manifest 与 placeholder，允许 optional assets 加载失败而不阻塞游戏。
- Pipeline: AI 生成资产必须先进入 candidate，经 review 后再进入 approved manifest。

## Non-goals / 当前不做什么

- 不迁移到大型游戏引擎。
- 不把 ChatGPT 原始长对话当作长期事实源。
- 不在没有 Version Pack 支持时随意扩展玩法系统。
- 不在 v0.1 阶段自动调用图片、音频或音乐生成 API。

## Current v0.1 Priority / 当前第一版优先级

- 保持可运行技术骨架稳定。
- 稳定 repo 内文档、决策、开放问题和多助手交接流程。
- 在 Asset Orchestrator 之前，先让 candidate -> review -> approved 资产管线可审查、可复盘。

## Creative Directions / 视听方向

- Visual: 像素风、横版视差、清晰层级、低疲劳度色彩。
- Audio: 环境声与马蹄声要可长期聆听，循环点平滑，响度稳定。
- Music: 少旋律、低侵入、可长时间陪伴，和 ambience 留出频段空间。

## Current Workflow / 当前工作方式

仓库是 single source of truth。Codex 维护 Version Pack 并整合五个 ChatGPT 助手的结构化输出；ChatGPT 项目园只同步关键摘要，方便助手读取同一上下文。
