# Shared Context / 五助手共享上下文

## Project / 项目

Run boy run 是一个 Vite + native JavaScript + Canvas 的 2D 横版氛围游戏。当前目标是稳住 first-playable technical skeleton，并建立 repo-centered Version Pack 工作流。

## Current Version / 当前版本

- Version: `v0.1.0`
- Runtime: Canvas renderer、infinite world managers、theme/weather/time switching、rider/horse placeholder animation、audio placeholders、UI managers。
- Asset pipeline: 已有 candidate -> review -> approved 的本地 MVP，但 manifest 当前基本为空。

## Current Goal / 当前目标

不要复制长对话全文。五助手各自输出结构化建议，Codex 在 repo 中提炼为 Version Pack、决策记录、开放问题和下一版 prompts。

## Technical Limits / 技术限制

- 不改大型架构，不引入大型引擎。
- 可选资产失败不应阻塞 loading。
- AI 资产必须先进 candidate，经 review 后再进入 approved。
- ComfyUI / Asset Orchestrator 未来采用 workflow preset。

## Workflow / 工作流

1. Codex 读取 `docs/project/` 和最新 `docs/iterations/`。
2. Codex 生成 5 个助手入口。
3. 用户把入口复制给 5 个 ChatGPT 助手。
4. 用户把助手输出贴回 Codex。
5. Codex 综合而非拼接，找冲突、共识、问题和下一版任务。
6. 用户回答 must-answer questions。
7. Codex 更新 Version Pack 和项目事实源。

## Not Now / 当前不做

- 不自动读取 ChatGPT 对话。
- 不保存原始长对话作为长期事实源。
- 不直接接入生成 API。
- 不绕过人工 asset review。

## Shared Questions / 本轮共同问题

- 下一版优先稳定 visual taxonomy，还是推进 Asset Orchestrator v1？
- approved 资产是否只进入 manifest，还是同步接入 renderer/audio manager？
- 哪些风险必须在 v0.2 前关闭？
