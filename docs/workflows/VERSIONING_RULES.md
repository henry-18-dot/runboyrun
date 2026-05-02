# Versioning Rules / 版本规则

## Scheme / 规则

使用 `v0.x.y` 记录 pre-release 阶段的工作包和代码迭代。

## Phases / 阶段

- `v0.1.x`: 文档、工作流、多助手协作和技术骨架稳定。
- `v0.2.x`: Asset pipeline、visual taxonomy、candidate review 扩展。
- `v0.3.x`: ComfyUI / Asset Orchestrator preset。
- `v0.4.x`: Real visual asset integration。
- `v0.5.x`: Audio/music integration。

## Patch versions / Patch 版本

- `x.y.1+` 用于同一阶段内的文档修订、小范围管线改进、bug fixes。
- 如果改动影响玩家可见体验或 asset flow 边界，应新建下一个 minor Version Pack。

## Documentation requirement / 文档要求

每个版本必须至少有：

- Iteration brief.
- Decisions.
- Open questions or explicit statement that none are open.
- Next prompts or next tasks.
