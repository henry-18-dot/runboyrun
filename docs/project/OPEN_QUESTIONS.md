# Open Questions / 开放问题

Status values: `open`, `answered`, `deferred`.
Priority values: `must`, `should`, `could`.

| ID | Question | Domain | Priority | Status | Owner | Notes | Decision link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q-001 | Asset Orchestrator 第一版是否只支持 visual？ | pipeline | must | open | user | 推荐先只做 visual，降低变量。 | TBD |
| Q-002 | ComfyUI 是否先用本地 watcher，还是直接 API runner？ | technical | must | open | user + code assistant | watcher 更稳，API runner 更自动化。 | TBD |
| Q-003 | 是否需要手机审查页面？ | product | should | open | user + product assistant | 当前 review site 是本地 MVP。 | TBD |
| Q-004 | 图片 taxonomy 的 biome/layer/role 是否已锁定？ | art | must | answered | user + Codex | First-playable taxonomy locked in `docs/art/VISUAL_LAYER_TAXONOMY.md`; grassland v2 uses L0-L8 semantic layers. | DEC-006 |
| Q-005 | 音频自动生成是否延后？ | audio/music | should | open | user + audio/music assistants | 推荐延后到 visual pipeline 稳定后。 | TBD |
| Q-006 | approved 资产是否允许自动写入 game manifest？ | pipeline | must | answered | user + Codex | For first-playable only, engineered grassland v2 pending candidates may be used by runtime directly; future AI replacements still require review. | DEC-006 |
