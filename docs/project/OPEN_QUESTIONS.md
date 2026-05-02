# Open Questions / 开放问题

Status values: `open`, `answered`, `deferred`.
Priority values: `must`, `should`, `could`.

| ID | Question | Domain | Priority | Status | Owner | Notes | Decision link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q-001 | Asset Orchestrator 第一版是否只支持 visual？ | pipeline | must | open | user | 推荐先只做 visual，降低变量。 | TBD |
| Q-002 | ComfyUI 是否先用本地 watcher，还是直接 API runner？ | technical | must | open | user + code assistant | watcher 更稳，API runner 更自动化。 | TBD |
| Q-003 | 是否需要手机审查页面？ | product | should | open | user + product assistant | 当前 review site 是本地 MVP。 | TBD |
| Q-004 | 图片 taxonomy 的 biome/layer/role 是否已锁定？ | art | must | open | user + art assistant | 需要和 manifest、renderer、prompt 一致。 | TBD |
| Q-005 | 音频自动生成是否延后？ | audio/music | should | open | user + audio/music assistants | 推荐延后到 visual pipeline 稳定后。 | TBD |
| Q-006 | approved 资产是否允许自动写入 game manifest？ | pipeline | must | open | user + code assistant | 当前 `assets:approve` 已会写入 visual/audio manifests，但游戏运行时接入边界仍需确认。 | TBD |
