# Decision Log / 决策记录

Status values: `proposed`, `accepted`, `rejected`, `superseded`.

## DEC-001 - Runtime stack

- Date: 2026-05-02
- Status: accepted
- Context: 项目需要轻量、可快速迭代的 2D Canvas 技术骨架。
- Decision: 使用 Vite + native JavaScript + Canvas，不使用大型游戏引擎。
- Rationale: 当前代码已经围绕 Canvas renderer、world managers 和 JS module 结构展开。
- Consequences: 玩法和渲染能力保持轻量，但复杂编辑器工作流需要自行设计。

## DEC-002 - Multi-assistant workflow

- Date: 2026-05-02
- Status: accepted
- Context: 用户已在 ChatGPT 本体中设置 5 个专业助手。
- Decision: 五助手负责专业评审和建议，Codex 负责 repo 内整合、版本包和执行任务拆解。
- Rationale: 避免单个助手承担所有上下文，降低设计、技术、音频、美术和产品风险混杂。
- Consequences: 所有助手输出必须被 Codex 结构化提炼后才能进入长期事实源。

## DEC-003 - Asset review gate

- Date: 2026-05-02
- Status: accepted
- Context: AI 生成资产可能风格漂移、质量不稳定、许可不清。
- Decision: AI 生成资产必须先进入 `candidate`，由人工 review 后才能进入 `approved`。
- Rationale: 当前 `tools/asset-pipeline/` 已支持 candidate -> review -> approved 的手动审查 MVP。
- Consequences: 资产接入速度较慢，但可审查、可回退、可记录。

## DEC-004 - Workflow presets for generation

- Date: 2026-05-02
- Status: accepted
- Context: ComfyUI / Asset Orchestrator 如果允许无限自由生成，会难以复盘和统一风格。
- Decision: Asset Orchestrator 采用 workflow preset，而不是无限自由生成工作流。
- Rationale: Preset 能把参数、目标、输出格式和审查要求固定下来。
- Consequences: 早期灵活度降低，但更利于批量生产和质量控制。

## DEC-005 - Repository as source of truth

- Date: 2026-05-02
- Status: accepted
- Context: ChatGPT 项目园方便同步，但代码和文档变更都发生在 repo。
- Decision: Repo 是 single source of truth，ChatGPT 项目园只同步摘要。
- Rationale: 版本历史、回滚、决策记录和执行任务都需要跟仓库一起保存。
- Consequences: 每轮需要先更新 repo 文档，再复制关键摘要到 ChatGPT 项目园。

## DEC-006 - Grassland first-playable asset bridge

- Date: 2026-05-04
- Status: accepted
- Context: The first playable needs real layered grassland visuals now, while the project still protects the candidate review workflow.
- Decision: Use deterministic engineered grassland v2 layer PNGs directly in runtime for playable validation, and also register them as pending visual candidates.
- Rationale: This keeps gameplay readability, seam behavior, and rider safe-zone validation moving without pretending the art has passed final review.
- Consequences: The grassland v2 baseline is a temporary runtime bridge. Future AI or ComfyUI replacements still go through candidate review before becoming the default visual set.
