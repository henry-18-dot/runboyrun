# Current Version / 当前版本

## Version

`v0.1.0`

Source: `package.json` version is `0.1.0`.

Product definition baseline: `Product Document v0`. See `docs/project/PRODUCT_DOCUMENT_V0.md`.

## Technical State / 当前技术状态

- Vite + native JS + Canvas 技术骨架已存在。
- 已有 game loop、settings、input、renderer、world managers、rider/horse placeholder animation、audio managers 和 UI managers。
- 已有本地资产审查 MVP：`candidateManifest.json`、`reviewState.json`、`visualManifest.json`、`audioManifest.json` 与 `tools/asset-pipeline/` 脚本。

## Content State / 当前内容状态

- 当前主要是 first-playable technical skeleton。
- 世界主题、天气、昼夜切换已有数据与管理模块。
- 角色、背景、音乐、环境声和音效仍以 placeholder 或 manifest 占位为主。

## Asset State / 当前资产状态

- Candidate manifest 当前为空。
- Review state 当前为空。
- Approved visual/audio manifests 当前为空或占位。
- 资产生产线已具备手动候选登记、审查页面生成、审查状态导出和 approved manifest 写入流程。

## Biggest Risks / 当前最大风险

- 多助手输出如果直接拼接，容易形成过期、重复、冲突的上下文。
- 资产分类和 approved 自动接入边界尚未完全锁定。
- ComfyUI / Asset Orchestrator 过早自动化会放大风格漂移和审查成本。

## Next Version Candidates / 下一版候选方向

- 完成多助手 Version Pack 工作流。
- 锁定 visual asset taxonomy 的最低可用分类。
- 明确 Asset Orchestrator v1 是否只支持 visual。
- 让下一轮助手输出可以直接转为 Codex-ready tasks。

## Hypotheses Being Tested / 当前正在验证的假设

- 一个独立开发者可以用 repo-centered Version Pack 驱动五个 ChatGPT 助手和 Codex 协作。
- 先稳定文档/决策流，再做生成自动化，会比直接接入 AI 生成 API 更可控。
- Candidate -> review -> approved 比直接写入 game manifest 更适合当前阶段。
