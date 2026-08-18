<div align="center">

# RepFlow

### Offline-first workout tracking for Android & iOS.

**Log weight × reps fast between sets. Keep your history reliable. No account, no internet, no distractions.**

<br />

<img src="https://img.shields.io/badge/Expo%20SDK-57-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" />
<img src="https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.86" />
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript strict" />
<img src="https://img.shields.io/badge/Expo%20SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="Expo SQLite" />
<img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-808080?style=for-the-badge" alt="Platform" />
<img src="https://img.shields.io/badge/version-1.0.0-4C1D95?style=for-the-badge" alt="Version" />

<br />

[![GitHub stars](https://img.shields.io/github/stars/sayidzm/repflow?style=for-the-badge&logo=github&label=stars)](https://github.com/sayidzm/repflow)
[![GitHub last commit](https://img.shields.io/github/last-commit/sayidzm/repflow?style=for-the-badge&logo=github)](https://github.com/sayidzm/repflow)

</div>

---

## 📖 Overview

RepFlow is a **local-first weightlifting tracker** built to solve one problem: logging sets at the gym should be faster than typing a note — and the data must still be there tomorrow.

Most gym apps sit on one of two extremes: paper/notes apps make history impossible to compare, and full-featured fitness suites are too busy to use between sets. RepFlow deliberately stays small:

- **Fast logging** — weight, reps, and "done" are on the same row; one hand is enough.
- **Reliable data** — every meaningful change is written to a local SQLite database the moment it happens.
- **Simple progress** — a plain, date-based history of your sets for each exercise. No charts, no gimmicks.

> The product principle: *the user should not fight the app while training; the app should make recording the workout easier.*

RepFlow is an **offline-first**, single-user, single-device app. It has **no backend, no account, and no cloud sync** by design (see [Offline-first](#-offline-first)). The whole MVP works without an internet connection.

**Current status:** the MVP is in the **Release Candidate phase**. Code-side verification (type-check, lint, 61 automated tests, `expo-doctor`, web export, Android prebuild) has passed; a final real-device manual pass and usage feedback are still pending.

---

## ✨ Features

### Core Experience

- **Active workout** — a distraction-free full-screen session with a live timestamp-based timer.
- **Set logging** — weight and reps inputs plus a completion toggle on the same row; new sets inherit the previous set's values.
- **One active session rule** — the database enforces a single active workout at a time (partial unique index).
- **Crash-safe recovery** — close the app mid-workout and the session is restored from SQLite on next launch.

### Exercises

- **229 seeded exercises** covering 6 muscle groups (`Chest`, `Back`, `Legs`, `Shoulders`, `Arms`, `Core`) and 6 categories (`Barbell`, `Dumbbell`, `Machine`, `Cable`, `Bodyweight`, `Other`).
- **Search & filter** by name and muscle group (deferred input keeps the list responsive).
- **Custom exercises** — create, edit, and archive your own movements.
- **Archive instead of delete** — exercises used in past workouts are never hard-deleted; history is preserved.

### Routines

- Create, edit, and delete routines as **ordered exercise lists**.
- **One-tap start** — a routine spins up an active workout with its exercises pre-added in order.
- Each routine shows its last performed date.

### History & Progress

- Completed workouts listed in reverse-chronological order and **grouped by day** (`BUGÜN`, `DÜN`, or date).
- **Workout detail** shows every exercise and set — weight, reps, and completion state.
- **Exercise progress** shows a date-based history of completed sets, the latest set, and the heaviest set per workout. Deliberately **no charts / PR / 1RM** in the MVP.

### Data Integrity

- **Snapshot fields** — exercise name and muscle group are copied into the workout record, so renaming or archiving an exercise never rewrites old history.
- **Versioned migrations** — schema changes ship only as sequential, transactional migrations.
- **Validation** — non-negative weight, integer reps, and non-empty names enforced at the domain layer.

> **Note on language:** the entire UI is in **Turkish** (navigation, buttons, labels, timestamps). Exercise and muscle-group names stay in English, as do the controlled domain values.

---

## 📸 Product Preview

<!-- Add application screenshots here (e.g. Home, Active Workout, History, Exercise Progress). -->

No screenshots are committed to this repository yet. Suggested spots for a hero image or a 2–3 screenshot grid:

```html
<div align="center">
  <img src="docs/screenshots/home.png" width="32%" />
  <img src="docs/screenshots/workout.png" width="32%" />
  <img src="docs/screenshots/history.png" width="32%" />
</div>
```

---

## 🔄 How It Works

The core loop:

```text
Start Workout
    ↓
Add Exercises (empty or from a Routine)
    ↓
Log Sets:  Weight × Reps  →  Complete ✓
    ↓
Finish Workout
    ↓
History & Exercise Progress
```

**Active workout recovery** works automatically:

```text
Active Workout
    ↓
App is closed / killed
    ↓
App relaunches
    ↓
Active session is detected in SQLite
    ↓
Resume from Home
```

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React Native 0.86 + Expo SDK 57 | Cross-platform mobile development |
| Language | TypeScript (strict mode) | Type-safe domain and data boundaries |
| Navigation | Expo Router (v57, typed routes) | File-based routing & deep links |
| Database | Expo SQLite | On-device relational persistence (source of truth) |
| State | React hooks + a scoped `Context`/`useReducer` | Active-workout coordination |
| Data access | Repository pattern | Screens never run SQL directly |
| Icons | lucide-react-native | UI iconography |
| Fonts | Manrope & DM Mono (Google Fonts) | Body/headline and numeric/mono typography |
| Styling | Design tokens + `StyleSheet` | Dark-only theme, shared UI components |
| Testing | Jest + jest-expo + React Native Testing Library | Unit, repository, and component tests |
| Linting | ESLint 9 + `eslint-config-expo` | Static analysis |
| Package manager | pnpm | Dependency management (`pnpm-lock.yaml`) |

---

## 🏗️ Architecture

RepFlow follows a **layered, feature-based** architecture. Screens stay thin; business rules and SQL live behind clean boundaries so a future cloud sync or analytics layer could replace the persistence implementation without touching the UI.

```text
Route / Screen
    ↓
Feature components & hooks
    ↓
Domain models / validation
    ↓
Repository interface
    ↓
SQLite implementation (expo-sqlite)
```

- **Route / Screen** (`app/`) — navigation params, layout, loading/empty/error states. No SQL.
- **Feature layer** (`src/features/`) — each feature (`exercises`, `routines`, `workouts`, `history`, `progress`) owns its components, hooks, and tests.
- **Domain layer** (`src/domain/`) — type-safe models and validation rules (non-negative weight, integer reps, single-active-workout rule, name limits).
- **Repository layer** (`src/database/repositories/`) — `ExerciseRepository`, `RoutineRepository`, `WorkoutRepository`, `HistoryRepository`, `ProgressRepository`. Return domain models, never raw rows.
- **SQLite layer** (`src/database/`) — DB open, `PRAGMA foreign_keys = ON`, WAL journal mode, sequential migrations via `user_version`, seed data, parameterized queries, transactions.

**State management:** SQLite is the source of truth for all persistent data. The `WorkoutDraftProvider` context only coordinates the active session and gives fast UI updates — it is never the source of truth. Workout duration is derived from timestamps (`started_at`/`ended_at`), not an in-memory counter.

**Consciously avoided:** no ORM, no global state library, no dependency-injection container, no backend. These stay out of the MVP unless a measured need appears.

---

## 📂 Project Structure

```text
repflow/
├── app/                          # Expo Router routes
│   ├── _layout.tsx               # Root layout: providers + stack
│   ├── (tabs)/                   # Bottom tabs
│   │   ├── index.tsx             # Home (start / resume workout)
│   │   ├── routines.tsx          # Routines library
│   │   ├── history.tsx           # Workout history
│   │   └── exercises.tsx         # Exercise library
│   ├── workout/active.tsx        # Active workout (full-screen)
│   ├── exercises/select.tsx      # Exercise picker (modal)
│   ├── exercises/[exerciseId]/progress.tsx
│   └── history/[workoutId].tsx   # Workout detail
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Screen, AppText, EmptyState, ErrorState, ...
│   │   └── shared/               # SectionHeader
│   ├── database/
│   │   ├── migrations/           # Versioned schema migrations (001_initialSchema)
│   │   ├── repositories/         # Data access layer
│   │   ├── seed/                 # 229 seeded exercises
│   │   └── initializeDatabase.ts # Open DB, PRAGMAs, migration runner, seed
│   ├── domain/
│   │   ├── models/               # Exercise, Workout, Routine, Set types
│   │   └── validation/           # Domain validation rules
│   ├── features/                 # Feature-scoped code
│   │   ├── exercises/
│   │   ├── routines/
│   │   ├── workouts/
│   │   ├── history/
│   │   └── progress/
│   ├── hooks/                    # Shared hooks (useReducedMotion)
│   ├── providers/                # WorkoutDraftProvider, SafeSQLiteProvider
│   ├── theme/                    # Design tokens (colors, spacing, type, motion)
│   └── utils/                    # createStyles
│
├── __tests__/                    # Jest tests (14 suites)
├── memory-bank/                  # Project memory & architecture docs
├── referances_design/            # Read-only design reference (not runtime code)
├── exercises.json                # Source data for seed generation
├── prd.md                        # Product requirements
├── project_goals.md              # Engineering goals
├── app.json                      # Expo configuration
├── package.json
└── pnpm-lock.yaml
```

Key configuration files:

| File | Role |
|---|---|
| `app.json` | Expo app config, identifiers, dark UI style, typed routes |
| `tsconfig.json` | TypeScript strict mode, `@/*` → `src/*` path alias |
| `jest.config.js` | `jest-expo` preset + module alias mapping |
| `eslint.config.js` | Expo flat ESLint config |
| `metro.config.js` | Metro config (adds `wasm` asset resolution for `expo-sqlite`) |
| `update_exercises.js` | Regenerates `src/database/seed/exercisesSeed.ts` from `exercises.json` |

---

## 💾 Data & Persistence

RepFlow uses **Expo SQLite** as the single source of truth. All data lives on the device in `repflow.db`.

### Schema (7 tables)

```text
exercises
├── routine_exercises ─→ routines
└── workout_exercises ─→ workouts
                        └── workout_sets
```

| Table | Purpose |
|---|---|
| `exercises` | Exercise catalog; `is_custom` flag; `archived_at` soft-delete |
| `routines` | Named, ordered exercise lists |
| `routine_exercises` | Routine ↔ exercise links with `sort_order` |
| `workouts` | Sessions with `status` (`active` / `completed` / `cancelled`) |
| `workout_exercises` | Per-workout exercise rows with **name/muscle-group snapshots** |
| `workout_sets` | Weight / reps / completion per set |
| `app_settings` | Single-row settings (weight unit, currently `kg` only) |

### Integrity rules

- **IDs** — app-generated unique text IDs; timestamps in Unix epoch ms.
- **Single active workout** — enforced by a partial unique index (`workouts_single_active_idx`).
- **History is immutable** — completed workout data is never rewritten by later exercise edits; snapshots keep it readable.
- **No hard deletes on used exercises** — archiving preserves referential integrity and history.
- **Foreign keys & transactions** — `PRAGMA foreign_keys = ON`, multi-table writes run in transactions.
- **Migrations** — sequential, versioned, transactional, seeded idempotently (`INSERT OR IGNORE`).

---

## 📡 Offline-First

RepFlow is **offline-first by design**:

```text
User Action
    ↓
Local Application
    ↓
Local SQLite Database
    ↓
Immediate UI Update
```

- No network client, account, or backend exists — and no network is required for any core flow.
- Every meaningful workout change is persisted to SQLite before the UI reports success.
- The active workout is **not** kept only in memory; it is restored from the database on relaunch.
- The repository layer keeps the UI decoupled from SQLite, so a sync implementation could be added later **without changing screens**.

> **Platform caveat:** Expo SQLite only runs on native platforms. On **web** (used for development/UI verification) persistence is an in-memory fallback — data is lost on refresh. Persistent data testing should be done on Android/iOS.

---

## 🎨 UI / UX

- **Design tokens** in `src/theme/` — colors, spacing, radius, typography, shadows, motion (with `useReducedMotion` support).
- **Dark-only theme** — near-black ink surface (`#121413`) with a high-contrast accent (`#d9f44a` lime) and success green.
- **Typography** — Manrope for UI text, DM Mono for sets/timers/metrics (numeric clarity).
- **Shared component system** — `Screen`, `AppText`, `Label`, `EmptyState`, `ErrorState`, `IconButton`, `ActionSheetModal`; feature-specific components (e.g. `WorkoutSetRow`, `ExerciseCard`) stay in their feature folder.
- **One-handed use** — primary actions are large touch targets (≥44 dp); weight, reps, and complete controls share one row.
- **Responsive** — set rows adapt between 360–412 px widths without horizontal overflow.
- **Accessibility** — accessible labels/roles, status never conveyed by color alone, keyboard-avoiding inputs, reduced-motion support.
- **Confirmation** — critical destructive actions (cancel workout, archive) require explicit confirmation.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS)
- **pnpm** — the project uses `pnpm-lock.yaml`
- For running on a device: the **Expo Go** app, or an emulator (Android Studio / Xcode) for native builds

### Clone

```bash
git clone https://github.com/sayidzm/repflow.git
cd repflow
```

### Install

```bash
pnpm install
```

### Run in development

```bash
pnpm start        # Start the Expo dev server
pnpm android      # Start on Android (Expo Go / emulator)
pnpm ios          # Start on iOS (Expo Go / simulator)
```

The app has **no environment-variable or API-key configuration** — nothing to set up. The database schema and 229 seed exercises are created automatically on first launch.

### Production build

```bash
# Web export (development/UI verification — SQLite persistence not available on web)
npx expo export --platform web

# Generate native projects (verified with Android)
npx expo prebuild --platform android
npx expo prebuild --platform ios
```

Native projects can then be built with Android Studio / Xcode. **EAS Build is not configured** in this repository.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm start` | Starts the Expo development server |
| `pnpm android` | Starts Expo and opens the app on Android |
| `pnpm ios` | Starts Expo and opens the app on iOS |
| `pnpm typecheck` | Runs TypeScript type-checking (`tsc --noEmit`) |
| `pnpm lint` | Runs ESLint (`expo lint`) |
| `pnpm test` | Runs the Jest test suite |

---

## ✅ Testing & Quality

Quality gates are the same in CI terms locally (no CI pipeline is configured yet):

```bash
pnpm typecheck
pnpm lint
pnpm test
```

The test suite covers the highest-risk behavior: **protecting user workout data**. It includes:

- **Unit tests** — domain validation (weight/reps), reduced-motion hook.
- **Repository / database integration tests** — migrations on a fresh DB, idempotent re-runs, foreign keys, transaction rollback, the single-active-workout rule, archiving without breaking history, progress queries using only completed data.
- **Component tests** — set row input, completion toggle, invalid-data messages, empty states, exercise search/filter.
- **Provider tests** — active workout draft behaviors.

Latest verified state (Phase 7): `typecheck` ✓ · `lint` 0 errors / 0 warnings ✓ · `test` 14 suites / 61 tests ✓ · `expo-doctor` 21/21 ✓ · web export ✓ · Android prebuild ✓.

---

## 🗺️ Roadmap

**MVP (implemented):** exercises · routines · active workout with recovery · history · exercise progress · offline-first persistence.

**Phase 7 remaining (user-dependent):** real-device manual testing (offline loop, recovery, history/progress) and usage feedback.

**Post-MVP candidates** — not yet scheduled; priorities are gated on MVP feedback:

- Speed: rest timer, show previous workout sets, quick-copy previous set, workout notes
- Progress: personal records, 1RM, volume tracking, charts, streaks/calendar
- Advanced workouts: supersets, drop sets, RPE/RIR, set types
- Data portability: export/import, backup/restore
- Cross-device: account, cloud sync, conflict resolution
- Integrations: Apple Health, Health Connect, wearables
- AI: workout assistant and evidence-based suggestions

---

## 🔒 Security & Privacy

- **No secrets.** RepFlow has no API keys, tokens, or environment variables. Never commit real secrets if you add any later.
- **All data is local** to the device in a single SQLite database — nothing is transmitted anywhere.
- **No account, tracking, or analytics** are built in.
- Keep in mind: because there is no backup/export yet, data is tied to the device. Uninstalling the app removes it (a backup/export feature is a roadmap candidate).

---

## 🛠️ Troubleshooting

- **`ERR_PACKAGE_PATH_NOT_EXPORTED` during bundling** — this repo pins `react-native@0.86.2` for Expo SDK 57 compatibility. Keep versions aligned with `package.json`; do not bump React Native independently.
- **Database connection unavailable on web** — expected. Expo SQLite is native-only; the app falls back to in-memory state on web so UI flows stay testable. Use Android/iOS for persistence checks.
- **`wasm` asset resolution errors with expo-sqlite** — `metro.config.js` already registers `wasm` in `resolver.assetExts`; restore it if you regenerate Metro config.
- **Web export looping errors** — `SafeSQLiteProvider` skips `SQLiteProvider` on web; keep the platform guard in place.
- **Release build verification** — the Expo SDK version should be confirmed in a real release build before shipping (documented Phase 7 risk).

---

## 🤝 Contributing

1. **Read the project docs first** — `ai_guidelines.md`, `prd.md`, `project_goals.md`, and `memory-bank/` (especially `current-state.md` and `decisions.md`). They are authoritative and kept in sync with the code.
2. Create a feature branch:

```bash
git checkout -b feature/my-feature
```

3. Make your change, keeping screens free of SQL and domain rules out of the UI.
4. Verify quality gates:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

5. Update the relevant docs (`memory-bank/progress.md`, `current-state.md`, and the appropriate spec) when behavior changes.
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat:     new capability
fix:      bug fix
docs:     documentation only
refactor: no behavior change
test:     tests only
chore:    tooling / maintenance
```

7. Push and open a Pull Request against `main` describing the change, verification, and any known risks.

> **Scope rule:** the MVP scope is locked. Features outside `prd.md` are only developed after explicit approval — propose them as roadmap candidates instead.

---

## 📄 License

A license has **not yet been specified** for this project. No `LICENSE` file is present in the repository. Until one is added, all rights are reserved by the author.

---

## 🙏 Acknowledgements

Built on excellent open-source foundations:

- **Expo & React Native** — cross-platform mobile development
- **expo-sqlite** — on-device relational persistence
- **expo-router** — file-based navigation
- **lucide-react-native** — icons
- **Manrope & DM Mono** — typography, via Google Fonts
- **Jest, jest-expo & React Native Testing Library** — testing
- The **design reference** in `referances_design/` that shaped the UI direction