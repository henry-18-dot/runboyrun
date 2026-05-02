# AGENTS.md

This file is the operating manual for AI coding agents working in this repository.

It is intentionally written in a Claude Code style, but it is meant for Codex and other agentic coding tools. Treat it as executable project policy: follow it unless the user explicitly overrides it.

---

## 0. Prime Directive

Build the smallest correct thing that advances the user’s goal without damaging the codebase.

Your default behavior:

1. Understand the repo before editing.
2. Make a concrete plan before changing files.
3. Prefer surgical changes over broad rewrites.
4. Keep the project runnable after every meaningful step.
5. Test your work.
6. Explain what changed, what was verified, and what remains risky.

Never optimize for looking productive. Optimize for correctness, maintainability, and debuggability.

---

## 1. Instruction Hierarchy

Follow instructions in this order:

1. System and developer instructions.
2. User’s latest explicit request.
3. Nearest `AGENTS.md` file.
4. Repository-level `AGENTS.md`.
5. Existing code conventions.
6. Your own judgment.

When instructions conflict, obey the higher-priority instruction and state the conflict briefly in your final response.

If a subdirectory contains its own `AGENTS.md`, that file overrides this one for files under that directory.

---

## 2. Working Mode

### Before editing

Always inspect relevant files first.

Do not assume architecture, package manager, test framework, game engine version, or build commands. Infer them from the repo.

Recommended first-pass commands:

```bash
pwd
ls
find .. -maxdepth 3 -name AGENTS.md -o -name CLAUDE.md -o -name README.md
git status --short
```

Then inspect the smallest set of files needed to understand the task.

### Planning

For non-trivial tasks, produce a short internal plan before edits:

```text
Goal:
Files likely affected:
Risk:
Validation:
```

Do not over-plan. A good plan is 3–7 steps.

### Editing

Prefer targeted edits.

Avoid:
- unrelated refactors
- formatting entire files unless requested
- dependency upgrades unless necessary
- changing generated files manually
- deleting code to “simplify” unless you prove it is unused
- introducing new architecture without clear need

### After editing

Run the narrowest useful validation first, then broader validation if cheap.

Examples:

```bash
npm test -- --runInBand path/to/test
pnpm test
pytest path/to/test_file.py
cargo test module_name
dotnet test
godot --headless --run-tests
```

If tests cannot be run, explain exactly why.

---

## 3. Repository Discovery Checklist

When starting in an unfamiliar repo, discover:

```text
Language/runtime:
Package manager:
Build command:
Test command:
Lint/format command:
Entry points:
Config files:
Generated files:
CI workflow:
Deployment target:
```

Use existing scripts before inventing commands.

Look for:

```text
package.json
pnpm-lock.yaml
yarn.lock
package-lock.json
pyproject.toml
requirements.txt
Cargo.toml
go.mod
pom.xml
build.gradle
*.sln
*.csproj
project.godot
*.uproject
ProjectSettings/
.github/workflows/
Makefile
justfile
Taskfile.yml
```

---

## 4. Code Quality Rules

### General

Write code that is:

- simple
- explicit
- typed where the ecosystem supports it
- testable
- easy to delete
- easy to debug

Prefer boring code over clever code.

Do not introduce abstraction until there are at least two real call sites or a clear boundary that demands it.

### Error handling

Never swallow errors silently.

Bad:

```ts
try {
  await save();
} catch {}
```

Good:

```ts
try {
  await save();
} catch (error) {
  logger.error({ error }, "Failed to save game state");
  throw error;
}
```

### Logging

Logs should help diagnose user-visible failure.

Log:
- boundary failures
- unexpected state
- external service failures
- save/load failures
- migration failures

Do not log:
- secrets
- tokens
- passwords
- full personal data
- noisy per-frame game loops unless guarded by debug flags

### Comments

Comments should explain why, not restate what.

Bad:

```ts
// Increment i
i++;
```

Good:

```ts
// Keep one frame of input grace so jump presses before landing still register.
coyoteTimer = COYOTE_TIME_MS;
```

---

## 5. Git Discipline

Before editing:

```bash
git status --short
```

Do not overwrite user changes.

If files have uncommitted changes you did not make:
- inspect carefully
- avoid touching them if possible
- if touching is necessary, preserve user changes exactly

Never run destructive commands unless explicitly requested:

```bash
git reset --hard
git clean -fd
rm -rf
git checkout -- .
```

Do not commit unless the user asks.

Do not create branches unless the user asks.

Final response should include:
- changed files
- validation run
- notable risks

---

## 6. Dependency Policy

Do not add dependencies by default.

Before adding one, verify:

```text
1. Is this already possible with existing dependencies?
2. Is the dependency maintained?
3. Is the dependency small enough for the problem?
4. Does it affect bundle size, startup time, build time, or game performance?
5. Does it introduce licensing risk?
6. Is there a security history?
```

If adding a dependency, explain why.

Pin versions according to the project’s existing convention.

---

## 7. Testing Policy

Every behavioral change should have validation.

Preferred order:

1. Unit tests for pure logic.
2. Integration tests for boundaries.
3. Snapshot/golden tests only when stable.
4. Manual test notes for UI/gameplay behavior.
5. Regression tests for bugs.

When fixing a bug:
1. Reproduce the bug.
2. Add or identify a failing test.
3. Fix the bug.
4. Verify the test passes.

Do not remove or weaken tests just to make the suite pass.

If tests are flaky, state that clearly and isolate the flake.

---

## 8. Security Policy

Treat AI-generated code as untrusted until reviewed.

Never introduce:
- hardcoded secrets
- unsafe deserialization
- SQL/string injection paths
- shell injection paths
- path traversal
- insecure random generation for security-sensitive uses
- client-authoritative game economy or inventory logic
- authentication/authorization shortcuts
- debug admin endpoints without guards

For any user input touching files, shell commands, database queries, network calls, or save-game loading, validate and sanitize.

For web apps:
- escape output
- validate server-side
- protect CSRF where relevant
- use parameterized queries
- enforce authz at the data access layer

For games:
- do not trust client state in multiplayer
- do not trust local save files for competitive/economy state
- avoid eval-like scripting unless sandboxed
- validate mod/plugin boundaries

---

## 9. Performance Policy

Do not optimize prematurely.

But avoid obvious performance hazards:

- per-frame allocations in hot game loops
- unbounded recursion
- polling when events exist
- N+1 database queries
- loading large assets synchronously during gameplay
- blocking the main/UI thread
- repeated filesystem scans in runtime code
- excessive logging in hot paths

For performance-sensitive changes, include a measurement or explain the expected impact.

---

## 10. Game Development Rules

This repo may contain game code. Game projects fail when agents treat them like CRUD apps.

### Core principles

Gameplay feel is a first-class requirement.

Prioritize:
- deterministic behavior where possible
- small gameplay loops
- fast iteration
- clear scene/prefab ownership
- inspectable state
- reproducible bugs
- save/load integrity
- frame-rate independence

### Game loop safety

Use delta time correctly.

Bad:

```csharp
position += velocity;
```

Good:

```csharp
position += velocity * deltaTime;
```

For physics:
- use the engine’s physics tick
- do not mix render-frame and physics-frame movement carelessly
- avoid directly teleporting rigid bodies unless intentional

### Determinism

For simulations, replays, lockstep, procedural generation, or tests:
- isolate random seeds
- avoid wall-clock time
- avoid unordered map iteration if order affects results
- keep floating-point drift in mind
- record inputs, not outcomes, when designing replays

### Input

Input code should support:
- keyboard/mouse where relevant
- controller where relevant
- remapping if project already supports it
- input buffering for action games
- coyote time / grace windows where appropriate
- clear separation between input collection and gameplay execution

### Gameplay implementation pattern

Prefer this split:

```text
Input collection
→ Intent / command
→ Simulation
→ Animation / VFX / SFX
→ UI feedback
```

Do not bury gameplay rules inside animation callbacks unless the existing architecture already does.

### Content and data

Prefer data-driven content when it helps iteration:

```text
items
weapons
levels
enemy stats
dialogue
quests
abilities
loot tables
tuning constants
```

Keep data formats human-editable where practical.

Validate content at load time.

### Save files

Save systems must be versioned.

Include:
- schema version
- migration path
- corruption handling
- backup or safe-write strategy
- deterministic serialization order if diffs matter

Never break existing saves unless the user explicitly accepts it.

### Scenes, prefabs, and editor state

For Unity/Godot/Unreal projects:

- Do not assume code changes are enough if scene/prefab/editor wiring is required.
- Prefer code paths that fail loudly when editor references are missing.
- Document manual editor steps if unavoidable.
- Do not silently rename serialized fields/assets.
- Avoid changing GUID/meta files unless necessary.
- Keep generated/imported asset files under the engine’s convention.

### Unity-specific

Follow existing project style first.

Common rules:
- Use `FixedUpdate` for physics.
- Use `Update` for input polling.
- Cache component references when used frequently.
- Avoid `FindObjectOfType` in hot paths.
- Avoid allocations in `Update`.
- Use `[SerializeField] private` for inspector fields.
- Preserve `.meta` files.
- Do not edit scene YAML blindly unless necessary.

### Godot-specific

Common rules:
- Respect node ownership and scene boundaries.
- Use `_physics_process(delta)` for physics.
- Use `_process(delta)` for visual/non-physics updates.
- Prefer signals for decoupled event flow.
- Avoid hardcoded node paths when exported references or groups are cleaner.
- Keep `.tscn` diffs minimal and inspect them carefully.

### Unreal-specific

Common rules:
- Respect module boundaries.
- Do not assume Blueprint state from C++ alone.
- Avoid heavy logic in Tick unless measured.
- Prefer components for reusable behavior.
- Be careful with reflection macros and generated files.
- Do not manually edit generated build artifacts.

---

## 11. Vibe Coding Guardrails

Fast AI-assisted iteration is allowed. Unreviewed chaos is not.

Use the loop:

```text
Spec → Slice → Implement → Run → Inspect → Commit-ready diff
```

### Spec

Before building features, clarify:

```text
Player fantasy:
Core loop:
Win/loss condition:
Input:
Camera:
Entities:
State:
Failure modes:
Acceptance criteria:
```

### Slice

Build vertical slices, not sprawling systems.

Good first slice:

```text
Player can move → collect one coin → score increments → restart works
```

Bad first slice:

```text
Full inventory + quests + combat + procedural map + save system
```

### Implement

Keep files small and interfaces clear.

When a file becomes hard for an agent to reason about, split by responsibility.

### Run

Run the game or tests as soon as a slice exists.

### Inspect

Look for:
- broken editor references
- console errors
- per-frame exceptions
- missing assets
- incorrect scale
- bad collision layers
- save/load regressions
- input edge cases

### Diff hygiene

Before final response:

```bash
git diff --stat
git diff --check
```

If possible, inspect the actual diff.

---

## 12. Task Patterns

### Bug fix

Use this sequence:

```text
1. Locate bug.
2. Reproduce or reason from code path.
3. Identify root cause.
4. Make minimal fix.
5. Add regression coverage where practical.
6. Validate.
```

Final response format:

```text
Fixed:
Root cause:
Files changed:
Validation:
Risk:
```

### Feature

Use this sequence:

```text
1. Identify existing architecture.
2. Define minimal acceptance criteria.
3. Implement smallest vertical slice.
4. Add tests or manual validation path.
5. Update docs/config if needed.
```

Final response format:

```text
Implemented:
Files changed:
How to use:
Validation:
Risk:
```

### Refactor

Only refactor with a clear goal.

Allowed goals:
- reduce duplication
- isolate boundary
- improve testability
- remove dead code
- prepare for requested feature

Required:
- preserve behavior
- run tests before/after if possible
- avoid mixing refactor with feature behavior unless necessary

### Debugging

Do not randomly change things.

Use a hypothesis table:

```text
Observation:
Hypothesis:
Evidence:
Experiment:
Result:
Next step:
```

### UI/frontend

Before changing UI:
- inspect existing design system
- reuse components
- preserve accessibility
- test responsive states
- avoid hardcoded magic spacing unless project uses it

Check:
- loading
- empty
- error
- long text
- keyboard navigation
- mobile layout

### API/backend

Before changing API:
- inspect existing routing/middleware/auth patterns
- preserve compatibility unless asked
- validate inputs
- update tests
- update schema/docs if present

### Database

Before changing database:
- inspect migration style
- never edit applied migrations unless project convention allows it
- write reversible migrations when possible
- consider backfill and nullability
- do not drop data without explicit approval

---

## 13. File and Architecture Preferences

Prefer:

```text
small modules
clear names
pure functions for rules
thin adapters at boundaries
explicit types
centralized constants for tuning
tests close to code
```

Avoid:

```text
god objects
hidden global state
spooky action at a distance
large generated-looking rewrites
overly generic utility layers
premature ECS/framework migration
```

Naming should match the repo’s existing convention.

Do not introduce a new naming convention.

---

## 14. Documentation Policy

Update docs when behavior, commands, setup, or public APIs change.

Docs should include:
- what changed
- how to run it
- known limitations
- migration notes if needed

Do not create long theoretical docs unless asked.

Prefer examples over prose.

---

## 15. Final Response Format

Use this format after making changes:

```text
Done.

Changed:
- path/to/file: what changed
- path/to/file: what changed

Validated:
- command run
- result

Notes:
- risk, limitation, or manual step if any
```

If no files changed:

```text
No code changes made.

Found:
- relevant finding

Recommended next step:
- concrete action
```

If blocked:

```text
Blocked.

Reason:
- exact blocker

What I checked:
- files/commands inspected

Next best action:
- concrete action
```

---

## 16. Forbidden Behaviors

Do not:

- claim tests passed if they were not run
- invent files, commands, APIs, or engine settings
- hide uncertainty
- overwrite user work
- make destructive git changes
- add dependencies casually
- perform broad rewrites for small requests
- ignore existing conventions
- remove error handling
- remove tests without justification
- hardcode secrets
- weaken security to make a demo work
- leave the repo in a broken build state without saying so

---

## 17. High-Leverage Agent Habits

Use these habits consistently:

1. Read before writing.
2. Prefer existing patterns.
3. Keep diffs small.
4. Validate early.
5. Make runtime failures loud.
6. Preserve user work.
7. Explain risks honestly.
8. Leave the repo easier to understand than you found it.

---

## 18. Optional Local Customization

If this repo has specialized areas, add nested `AGENTS.md` files.

Recommended layout:

```text
AGENTS.md
frontend/AGENTS.md
backend/AGENTS.md
game/AGENTS.md
tools/AGENTS.md
docs/AGENTS.md
```

Each nested file should only contain rules that differ from this root file.

Keep each instruction file short enough that an agent can reliably follow it.

---

## 19. One-Shot Game Feature Template

When asked to implement a game feature, use this internal template:

```text
Feature:
Player-facing behavior:
Engine/runtime:
Existing systems touched:
Data needed:
Scene/prefab/editor changes:
Tests:
Manual validation:
Rollback risk:
```

Acceptance criteria should be concrete.

Example:

```text
Feature: Dash ability

Acceptance criteria:
- Press Shift to dash in facing direction.
- Dash lasts 0.15 seconds.
- Cooldown is 0.8 seconds.
- Player cannot dash while stunned.
- Dash works at 30/60/120 FPS.
- Dash does not pass through solid walls.
- Dash state is visible to animation system.
```

---

## 20. One-Shot Bug Report Template

When fixing a bug, structure the investigation:

```text
Bug:
Expected:
Actual:
Repro:
Suspected files:
Root cause:
Fix:
Regression test:
Manual validation:
```

Never skip root cause unless the user explicitly asks for a quick hack.

---

## 21. Agent Self-Review

Before final response, check:

```text
Did I change only what was needed?
Did I preserve user changes?
Did I follow existing style?
Did I handle errors?
Did I update tests/docs if needed?
Did I run validation?
Did I state unvalidated parts?
Is the diff reviewable?
```

If the answer to any item is no, either fix it or mention it.

---

## 22. Project Workflow Rules

For this project, Codex should treat the repository as the single source of truth for multi-assistant planning.

Before planning or implementing non-trivial changes, read:

```text
docs/project/
docs/iterations/README.md
docs/iterations/<latest-version>/
```

Workflow rules:

- Do not treat raw ChatGPT conversation transcripts as a long-term fact source.
- Summarize assistant outputs into the current Version Pack before using them to guide code or asset changes.
- Keep `docs/project/DECISION_LOG.md` and `docs/project/OPEN_QUESTIONS.md` current when decisions or blockers change.
- Before modifying game runtime code, confirm the current Version Pack supports the change.
- ChatGPT project-space copies are handoff snapshots only; repo docs remain authoritative.
