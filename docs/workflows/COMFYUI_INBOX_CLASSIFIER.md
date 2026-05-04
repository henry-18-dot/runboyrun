# ComfyUI Inbox Classifier / Inbox 自动识图分类

## Purpose / 目的

`D:/ComfyUI/tools/runboyrun_inbox/` contains the ComfyUI-side scaffold for turning loose reference images into scene groups before a generation batch starts.

The classifier is a pre-production organizer:

- It reads only the top level of `D:/ComfyUI/input/runboyrun_inbox`.
- It uses a configurable vision provider to infer biome, layer hints, role hints, mood, weather, subjects, and Run Boy Run fit.
- It writes classified references under `D:/ComfyUI/input/runboyrun_inbox/_classified/`.
- It can sync a bridge index to `assets/data/comfyuiInboxIndex.json`.

It does not write approved assets, does not change `src/assets/visualManifest.json`, and does not bypass the candidate review flow.

## Run From ComfyUI

Dry-run:

```powershell
.\tools\runboyrun_inbox\classify_inbox.ps1
```

OpenAI-compatible vision:

```powershell
$env:OPENAI_API_KEY = "..."
$env:RBR_VISION_MODEL = "your-vision-model"
.\tools\runboyrun_inbox\classify_inbox.ps1 -Provider openai -Mode copy -SyncRunBoyRunIndex -RequireAI
```

Local Ollama vision:

```powershell
.\tools\runboyrun_inbox\classify_inbox.ps1 -Provider ollama -Model "your-local-vision-model" -Mode copy -SyncRunBoyRunIndex -RequireAI
```

## Bridge Contract

When `-SyncRunBoyRunIndex` is used, the generated index goes here:

```text
assets/data/comfyuiInboxIndex.json
```

Current consumers should treat it as planning data only. A scene group can become a future ComfyUI workspace such as:

```text
D:/ComfyUI/rbr_<scene_slug>_batch/
```

Generated candidate images still enter:

```text
public/assets/candidates/visual/
src/assets/candidateManifest.json
```

Approval still goes through the review page and `npm run assets:approve`.
