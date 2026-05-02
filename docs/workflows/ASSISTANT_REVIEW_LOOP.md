# Assistant Review Loop / 五助手评审循环

## Assistant outputs / 助手输出

每个助手必须输出：

- Summary
- Domain-specific risks
- Recommended changes
- Questions for user
- Codex-ready tasks
- Things to avoid
- Confidence level

## Codex synthesis / Codex 整合

Codex 收到五份输出后：

- 提炼共识，而不是复制全文。
- 标记冲突和过期建议。
- 把可执行项改写为 Codex-ready tasks。
- 把必须由用户拍板的问题写进 `NEXT_QUESTIONS.md`。
- 把已接受的判断写进 `DECISION_LOG.md` 或本轮 `DECISIONS.md`。

## Conflict handling / 冲突处理

- 技术可行性与体验目标冲突时，先问用户要验证哪一个目标。
- 美术/音频/音乐建议冲突时，优先长期体验舒适度和当前版本边界。
- 如果建议需要改核心代码，必须确认最新 Version Pack 支持。
