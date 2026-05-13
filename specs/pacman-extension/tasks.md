---
description: "Task list template for feature implementation"
---

# Tasks: pacman-extension

**Input**: Design documents from `/specs/pacman-extension/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/webview-protocol.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Typescript VS Code Extension project with `yo code` or equivalent boilerplate in root directory
- [x] T002 [P] Configure basic linting (`eslint`, `prettier`) and editor configurations
- [x] T003 Set up build orchestration (webpack/esbuild) to handle compiling `src/webview/app.ts` into a webview-compatible output

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement `WebviewManager.ts` to coordinate lifecycle (creation, revealing, destruction) of the Webview Panel instance
- [x] T005 Stub the core message passing protocol (handling `ready` incoming message) inside `WebviewManager.ts`
- [x] T006 Register the base extension command palette bindings in `extension.ts` (e.g., configuring `vscode.commands.registerCommand`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enable Pac-Man in Editor (Priority: P1) 🎯 MVP

**Goal**: Execute a command to start a session where Pac-Man moves across the bottom of my screen.

**Independent Test**: Run "Start Pac-Man session", wait for webview to mount, confirm the sprite horizontally navigates the width of the editor bottom.

### Tests for User Story 1
- [x] T007 [P] [US1] Create integration test in `tests/suite/extension.test.ts` to assert `start-animation` command properly activates the extension and registers Webview Panel.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `src/webview/index.html` structure with a placeholder for the Pac-Man sprite fixed to the bottom of the container.
- [x] T009 [P] [US1] Write CSS logic (`assets/sprites/` styles) for basic Pac-Man sprite animation frame switching (mouth open/close).
- [x] T010 [US1] Implement `src/webview/app.ts` frontend logic to handle horizontal traversal using `requestAnimationFrame` or CSS transitions.
- [x] T011 [US1] Connect Extension host `start-animation` command to trigger the Webview panel creation, passing local resource URIs safely.
- [x] T012 [US1] Add extension host command `stop-animation` to dispose the webview panel instance directly, letting VS Code natively handle the lifecycle teardown.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Customizable Ghost Enemies (Priority: P2)

**Goal**: Configure whether ghosts chase Pac-Man across the screen so that the animation has more variety.

**Independent Test**: Enable ghosts in configuration, reload extension, confirm ghost sprites follow behind the main Pac-Man.

### Implementation for User Story 2

- [x] T013 [P] [US2] Update `package.json` configurations to declare the extension setting `pacman-extension.enableGhosts`.
- [x] T014 [US2] Modify `WebviewManager.ts` to listen to configuration changes and post the `update-config` message (from `webview-protocol.md`) to the frontend panel.
- [x] T015 [P] [US2] Create or ingest CSS/Image assets for ghosts into `assets/sprites/`.
- [x] T016 [US2] Modify `src/webview/app.ts` to listen for `update-config` and dynamically orchestrate ghost DOM elements trailing behind Pac-Man.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T017 [P] Add the `pacman-extension.speed` configuration binding so the horizontal traversal velocity scales according to user preference.
- [x] T018 Code cleanup and optimization: Ensure CPU footprint remains strictly under 5% in idle state.
- [x] T019 Update `README.md` and documentation reflecting commands and settings.
- [x] T020 Run `quickstart.md` validation.
- [x] T021 [P] Create an automated performance test in `tests/suite/performance.test.ts` to assert that Webview initialization and first meaningful paint occur within 3 seconds, fulfilling SC-001.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities
- Test T007 can be written concurrently while T008, T009 setup the DOM/CSS framework.
- T013 and T015 are completely isolated setup steps before plumbing logic in T014, T016.
