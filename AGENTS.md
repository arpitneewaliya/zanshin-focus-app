<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Zanshin Focus — Agent Context

## What this is

A productivity web app combining Pomodoro Timer, Task Manager, Personal Journal, Focus Mode, and a Habit Tracker into one minimalist, distraction-free interface. Targets students, developers/writers, freelancers, and remote workers.

## Design principles

- Minimalist UI — functionality over decoration, no clutter
- Consistent design language (colors, typography, spacing) across all features
- Keyboard-navigable and screen-reader friendly
- Responsive across mobile/tablet/desktop
- Fast load times, smooth animations, no jank

## Tech stack

| Layer      | Choice                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Framework  | Next.js (App Router)                                                                                                                 |
| Language   | TypeScript                                                                                                                           |
| Styling    | Tailwind CSS                                                                                                                         |
| Components | shadcn/ui — use its components as the default building blocks; do not introduce Chakra UI, MUI, or other component/styling libraries |
| State      | Zustand                                                                                                                              |
| Icons      | Lucide React                                                                                                                         |
| Animation  | Motion (formerly Framer Motion) — package name is `motion`, import from `motion/react`, do not use the old `framer-motion` package   |
| Markdown   | React Markdown                                                                                                                       |
| Sound      | Howler.js — used for Focus Mode's layered ambient sounds and timer alerts                                                            |
| API        | Next.js Server Actions (no tRPC)                                                                                                     |
| Auth       | Supabase Auth (email + Google OAuth) — **no NextAuth**                                                                               |
| Database   | PostgreSQL via Supabase                                                                                                              |
| ORM        | Prisma — single source of truth for DB access, do not mix in raw `supabase-js` queries for data that Prisma already models           |
| Hosting    | Vercel (app), Supabase (DB)                                                                                                          |
| CI/CD      | GitHub Actions — add only once app is stable, not needed for early scaffolding                                                       |

## Explicit decisions (don't deviate without asking)

- One component library only: **shadcn/ui**, styled via Tailwind. Customize via its config, not by adding another UI kit.
- One icon library only: **Lucide React**.
- One animation library only: **Motion** (`motion` package, `motion/react` import path). Do not install `framer-motion`.
- One auth system only: **Supabase Auth**. Do not add NextAuth.
- One data-access layer only: **Prisma**. Do not call `supabase-js` for CRUD that Prisma already covers.
- No tRPC. Use Server Actions for mutations/queries.
- Offline-first sync is a **later phase**, not part of initial feature builds. Each feature should work standalone with local state before being wired to Supabase.

## Feature priority

1. Pomodoro Timer — customizable intervals, progress visualization, sound notifications (High)
2. Task Manager — add/edit/delete/complete, due dates, priorities, filtering (High)
3. Habit Tracker — track recurring habits with a calendar heatmap and streaks (High)
4. Personal Journal — rich text/Markdown entries (High)
5. Dashboard — central hub + productivity stats (High)
6. Data Persistence — tasks/journal/habits/sessions saved to Supabase (High)
7. Dark/Light Mode toggle (High)
8. Focus Mode — full-screen, ambient sounds, distraction blocking (Medium)
9. User Authentication — Supabase Auth, email + Google OAuth (Medium)
10. Browser notifications for timer/tasks (Low)

## Habit Tracker — feature notes

**Data model** (habit):

- `id`, `name`, `description` (optional), `color` (tag, from a restrained palette — see below), `frequency` (see below), `createdDate`, `archivedDate` (optional, null if active)

**Data model** (completion log entry):

- `id`, `habitId`, `date`, `status` (completed / missed)

**Frequency & streak logic:**

- Supported frequencies: daily, specific weekdays (e.g. Mon/Wed/Fri), or N times per week.
- A "missed day" only counts on a day the habit was actually scheduled. Unscheduled days are neutral — they don't break a streak and don't count as completions.
- Streak = consecutive *scheduled* occurrences completed, not consecutive calendar days. Example: a Mon/Wed/Fri habit completed on all three keeps its streak alive even though Tue/Thu/weekend are skipped.
- Track both current streak and longest streak per habit.

**Archive vs. delete:**

- **Archive**: removes a habit from the active list/dashboard but keeps all historical completion data intact (for heatmap/history viewing later).
- **Delete**: permanently removes the habit and its completion history. Should require confirmation.

**Heatmap:**

- One heatmap **per habit** (not a single aggregate heatmap across all habits), GitHub-style grid of the last ~12 months.
- Color scale must stay within the app's existing neutral/accent palette (shades of the habit's assigned color or the app's accent color) — do not introduce GitHub's default green scale, to stay consistent with the minimalist design principles.

## Build order

Build **local-first, backend-last** so each feature stays a small, self-contained context:

1. Scaffold: Next.js + TS + Tailwind + shadcn/ui setup, theme toggle, layout shell, dashboard skeleton
2. Pomodoro Timer — local Zustand state only
3. Task Manager — local Zustand state only
4. Habit Tracker — local Zustand state only
5. Personal Journal — local Zustand state only
6. Focus Mode
7. Wire up Supabase: Prisma schema, Supabase Auth, migrate each feature's local state to persisted data one at a time
8. Notifications, then GitHub Actions CI/CD

Do not jump ahead to Supabase/auth wiring before a feature's local-state version is working and reviewed.

## Folder structure

```
app/            # routes (App Router)
components/     # shared UI components (includes shadcn/ui generated components)
features/       # one folder per feature (timer, tasks, habit-tracker, journal, focus-mode)
stores/         # Zustand stores
lib/            # utilities, Prisma client, Supabase client
prisma/         # schema.prisma, migrations
```

## Conventions

- One feature per session/prompt — don't bundle multiple features in one request
- TypeScript strict mode
- Keep components small and colocated within their `features/` folder
- Prefer shadcn/ui primitives over hand-rolled UI; only build custom components when shadcn/ui has no equivalent
- No hardcoded secrets — use env vars, never commit `.env`

## Success targets (context only, not implementation tasks)

- Avg session duration > 10 minutes, 30% 7-day retention, Lighthouse > 90, <1% error rate
