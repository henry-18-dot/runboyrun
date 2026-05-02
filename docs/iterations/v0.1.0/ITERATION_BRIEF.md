# Iteration Brief / v0.1.0 Version Pack

## Version

`v0.1.0`

## Theme

Repo-centered multi-assistant workflow / 仓库驱动的多助手工作流

## Goal

建立一套让 Codex 与 5 个 ChatGPT 助手协作的 Version Pack 文档系统，使后续每次改版都能被追踪、整合、复盘。

## Why this iteration exists

原始对话会越来越长，不能作为长期事实源。当前项目已经有可运行技术骨架和本地资产审查 MVP，因此下一步需要稳定文档、决策和助手交接流程。

## What changed

- 建立 `docs/project/` 作为项目事实源。
- 建立 `docs/assistants/` 作为五助手对话入口。
- 建立 `docs/workflows/` 和 `docs/templates/` 支持后续迭代。
- 建立首个 `v0.1.0` Version Pack。

## What is locked

- Repo 是 single source of truth。
- ChatGPT 项目园只同步摘要。
- 五助手输出必须结构化，Codex 综合而非拼接。
- AI 资产必须经过 candidate -> review -> approved。

## What is still open

- Asset Orchestrator v1 是否只支持 visual。
- ComfyUI 第一版采用 watcher 还是 API runner。
- Visual taxonomy 是否已锁定。
- Approved 资产是否自动进入游戏运行时 manifest。

## What Codex should do next

读取五助手输出，更新 `ASSISTANT_INPUTS.md`、`CODEX_SYNTHESIS.md`、`DECISIONS.md`、`NEXT_QUESTIONS.md` 和 `NEXT_PROMPTS.md`。

## What the 5 assistants should review next

围绕 v0.2 候选方向评估风险、优先级、开放问题和 Codex-ready tasks。
