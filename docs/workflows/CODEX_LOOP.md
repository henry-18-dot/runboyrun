# Codex Loop / Codex 每轮工作流

## Purpose / 目的

让 Codex 成为 repo 执行者和版本整合者，而不是原始聊天记录搬运工。

## Steps / 步骤

1. Read current docs: `docs/project/`, latest `docs/iterations/`, relevant pipeline docs.
2. Generate or refresh five assistant entries.
3. Wait for user to paste structured outputs from the five ChatGPT assistants.
4. Synthesize, do not concatenate.
5. Identify agreements, conflicts, stale advice and missing decisions.
6. Ask the user only the must-answer questions that block the next version.
7. Record accepted decisions and update open questions.
8. Update the Version Pack.
9. Produce next-round prompts and Codex-ready tasks.

## Rules / 规则

- 原始长对话不是长期事实源。
- 只把结构化摘要写进 repo。
- 修改游戏代码前，先确认最新 Version Pack 支持该改动。
- 每轮结束时说明：changed files、validation、remaining risks。
