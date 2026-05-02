# ChatGPT Handoff / ChatGPT 项目园同步

## Principle / 原则

Repo 是 single source of truth。ChatGPT 项目园只是同步副本，帮助 5 个助手读取同一上下文。

## What to sync / 建议同步

- `docs/assistants/00_SHARED_CONTEXT.md`
- 最新 `docs/iterations/<version>/ITERATION_BRIEF.md`
- 最新 `docs/iterations/<version>/NEXT_PROMPTS.md`
- 对应助手自己的 entry 文档

## What not to sync / 不建议同步

- 全部旧对话。
- 所有历史 Version Pack。
- 未经 Codex 提炼的长篇助手输出。
- 与本轮无关的代码细节。

## User workflow / 用户操作

1. 从 repo 复制共享上下文和对应助手入口。
2. 分别粘贴给 5 个 ChatGPT 助手。
3. 要求助手按 `ASSISTANT_RESPONSE_TEMPLATE.md` 输出。
4. 把 5 份结构化输出贴回 Codex。
5. 等 Codex 综合并更新 Version Pack。
