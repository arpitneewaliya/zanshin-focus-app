import {
  PrismaClient,
  TaskPriority,
  HabitStatus,
  PomodoroMode,
  ClockStyle,
  RepeatMode,
} from "@prisma/client";

const prisma = new PrismaClient();

// Helper to format Date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

// ─────────────────────────────────────────────────────────────
// 10 Curated Journal Entries (Aug 2026 – Nov 2026)
// ─────────────────────────────────────────────────────────────
const JOURNAL_ENTRIES = [
  {
    title: "The Quiet Power of Singular Focus",
    createdAt: new Date("2026-11-06T10:30:00.000Z"),
    updatedAt: new Date("2026-11-06T10:45:00.000Z"),
    content: `# The Quiet Power of Singular Focus

> "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy." — Cal Newport

Today was one of those rare mornings where everything clicked into alignment. I opened Zanshin at 8:00 AM, switched on the Rain ambience, and committed to a single 90-minute block without switching tabs or glancing at notifications.

### Observations from Today's Session
- **Friction reduction:** When the work environment is minimal, cognitive switching overhead drops to zero.
- **Micro-distractions:** Noticed two instinctive impulses to check email around the 25-minute mark. Resisted by taking two deep breaths and staying anchored.
- **Output:** Finished the architectural draft for the offline sync protocol in a single uninterrupted sitting.

### Tomorrow's Intention
Protect the first 2 hours of the morning before opening communication channels. Momentum early sets the emotional tone for the entire day.`,
  },
  {
    title: "Designing Systems for Cognitive Peace",
    createdAt: new Date("2026-11-04T21:15:00.000Z"),
    updatedAt: new Date("2026-11-04T21:30:00.000Z"),
    content: `# Designing Systems for Cognitive Peace

Most productivity advice focuses on velocity—how fast can you clear a backlog, how many tasks can you close. But true leverage comes from **clarity**, not frantic speed.

### Three Rules I'm Adopting:
1. **Never hold open loops in memory:** If a task isn't in the system with a due date or explicit priority, it's draining subconscious attention.
2. **Restraint over feature bloat:** Every extra button or metric introduces subtle cognitive drag.
3. **Daily reflection as a ritual:** Closing the day with 5 minutes of writing creates a natural boundary between work and restorative rest.

> "Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda`,
  },
  {
    title: "Refactoring for Simplicity and Joy",
    createdAt: new Date("2026-10-29T16:45:00.000Z"),
    updatedAt: new Date("2026-10-29T17:10:00.000Z"),
    content: `# Refactoring for Simplicity and Joy

Spent the afternoon pruning the codebase. Deleted roughly 400 lines of obsolete boilerplate that had accumulated over past experiments.

### The Metrics
- **Files touched:** 7 components
- **Net diff:** -380 lines
- **Bundle reduction:** ~14KB
- **Satisfaction:** 10/10

There is a distinct Zen satisfaction in code deletion. When you delete code, you delete bugs that haven't happened yet. You lighten the mental load for anyone reading the file six months from now.

\`\`\`ts
// Less is more: replace complex state machines with a single clean derived value
const isActive = count > 0 && !isArchived;
\`\`\`

Leaving the workspace cleaner than I found it is one of the highest forms of craftsmanship.`,
  },
  {
    title: "Lessons from Musashi: Zanshin in Daily Execution",
    createdAt: new Date("2026-10-21T19:30:00.000Z"),
    updatedAt: new Date("2026-10-21T19:50:00.000Z"),
    content: `# Lessons from Musashi: Zanshin in Daily Execution

Re-reading excerpts from *The Book of Five Rings* this week. The concept of **Zanshin** (残心) translates literally to "remaining mind" or lingering awareness.

In classical martial arts, after striking an opponent, the practitioner does not drop their guard or celebrate early; their posture and awareness remain vigilant and poised.

### How Zanshin Translates to Modern Work
- **The Follow-Through:** When completing a difficult task or pull request, don't hastily slam the laptop shut. Check edge cases, write clear documentation, leave a polite note.
- **Poise under stress:** When deadlines compress, panic produces bugs. Slowness of thought leads to speed of correct delivery.
- **Equanimity:** Wins and setbacks are both data points. Maintain emotional steadiness through both.`,
  },
  {
    title: "Deep Work Milestone: 40 Hours of Flow",
    createdAt: new Date("2026-10-14T18:00:00.000Z"),
    updatedAt: new Date("2026-10-14T18:20:00.000Z"),
    content: `# Deep Work Milestone: 40 Hours of Flow

Hit an important personal benchmark today: 40 hours of tracked, distraction-free deep work across the past two weeks.

### Key Insights:
- **Energy cycles:** My peak cognitive window is strictly 8:30 AM – 11:30 AM. Afternoons are best reserved for code reviews, light refactoring, or reading.
- **The 4-Pomodoro sweet spot:** Four 25-minute intervals followed by a 15-minute walk outside yields the highest sustained energy without afternoon brain fog.
- **Music selection:** Binaural beats and low-fidelity ambient rain worked significantly better than instrumental synth tracks.

Progress is compounding. Keep the cadence steady.`,
  },
  {
    title: "Autumn Equinox: Resetting the Habit Engine",
    createdAt: new Date("2026-10-03T08:45:00.000Z"),
    updatedAt: new Date("2026-10-03T09:05:00.000Z"),
    content: `# Autumn Equinox: Resetting the Habit Engine

As the seasons shift and mornings get slightly cooler, I took 30 minutes to review my habit stack.

### What's Working:
- **Morning Zazen (15 min):** Over 120 days strong. It has fundamentally rewired how reactive I feel to morning notifications.
- **Physical Training:** Consistency at 5x/week feels sustainable. Prioritizing mobility over maximum weight has eliminated lower back stiffness.

### What Needs Adjustment:
- **Evening screen cutoff:** Started creeping past 10:00 PM again last week. Need to enforce the physical charging dock outside the bedroom.

> "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Will Durant`,
  },
  {
    title: "The Joy of Building in the Open",
    createdAt: new Date("2026-09-24T17:15:00.000Z"),
    updatedAt: new Date("2026-09-24T17:35:00.000Z"),
    content: `# The Joy of Building in the Open

Shared a preview of our minimalist dashboard with three trusted engineering friends this afternoon. The feedback was encouragingly unanimous: people are exhausted by cluttered, noisy productivity tools.

### Feedback Highlights:
- Loved the dark mode monochrome aesthetic with restrained accent badges.
- The 52-week calendar heatmap per habit gives immediate visual weight to consistency.
- Having timer, tasks, habits, and journal in a single uncluttered tab feels like an oasis.

Reminded myself: build for depth, not surface novelty.`,
  },
  {
    title: "Thinking in First Principles",
    createdAt: new Date("2026-09-12T11:20:00.000Z"),
    updatedAt: new Date("2026-09-12T11:40:00.000Z"),
    content: `# Thinking in First Principles

Faced with a complex state synchronization challenge between client Zustand stores and server database tables. Instead of reaching for heavy third-party synchronizers, stepped back to first principles.

### Foundational Questions:
1. *What actually needs to be synced immediately?*
   - Status toggles and timer completion.
2. *What can tolerate optimistic updates with background reconciliation?*
   - Habit checkboxes and task completion flags.
3. *What is the failure mode if offline?*
   - Inform the user gently, queue mutations in memory, and retry on reconnect.

When in doubt, write down the fundamental physics of the problem before writing code.`,
  },
  {
    title: "Digital Minimalism: Reclaiming the Evening",
    createdAt: new Date("2026-08-28T21:30:00.000Z"),
    updatedAt: new Date("2026-08-28T21:50:00.000Z"),
    content: `# Digital Minimalism: Reclaiming the Evening

Completed day 14 of the evening digital sunset experiment. At 9:00 PM, all monitors go dark, phone goes into flight mode on the hallway credenza, and I pick up a physical book.

### Observed Benefits:
- Sleep onset latency dropped from ~45 minutes to under 10 minutes.
- Deep sleep recorded by wearable increased by 22%.
- Woke up feeling clear-headed rather than instantly fragmented by incoming messages.

The modern attention economy treats our awareness as a commodity to extract. Guarding the margins of the day is an act of self-respect.`,
  },
  {
    title: "A Quiet Saturday: Embracing Slow Progress",
    createdAt: new Date("2026-08-15T06:45:00.000Z"),
    updatedAt: new Date("2026-08-15T06:50:00.000Z"),
    content: `# A Quiet Saturday: Embracing Slow Progress

Today was a calm, deliberate day. Nothing extraordinary happened on the surface, but looking back, it's exactly the kind of day that builds long-term foundations.

Spent a few uninterrupted hours resolving subtle edge cases in the habit streak calculation. When the tests finally turned green, the feeling was quiet satisfaction.

### Things I'm Grateful For:
- Having the freedom to craft software with care and intentionality.
- A long evening walk without headphones, letting the subconscious process the week.
- Quiet moments of solitude with a warm cup of sencha tea.
- The compounding effect of small daily disciplines.

> "A journey of a thousand miles begins with a single step." — Lao Tzu`,
  },
];

// ─────────────────────────────────────────────────────────────
// Habits Tracked for Months (June/July 2026 – Present)
// ─────────────────────────────────────────────────────────────
const HABITS_CONFIG = [
  {
    name: "Morning Zazen & Breathwork",
    description: "15 minutes of seated mindfulness before touching any digital device",
    color: "emerald",
    frequency: { type: "daily" },
    startDate: "2026-06-01",
    completionRate: 0.93,
    // ensure last 24 days are 100% completed for active streak
    activeStreakDays: 24,
    completedToday: true,
  },
  {
    name: "Deep Work — 90min Focus Block",
    description: "Uninterrupted deep work sprint with all distractions eliminated",
    color: "indigo",
    frequency: { type: "weekdays", daysOfWeek: [1, 2, 3, 4, 5] },
    startDate: "2026-07-01",
    completionRate: 0.90,
    activeStreakDays: 16,
    completedToday: true,
  },
  {
    name: "Read Philosophy & Architecture",
    description: "20 pages of non-fiction, distributed systems, or stoic philosophy",
    color: "amber",
    frequency: { type: "daily" },
    startDate: "2026-06-15",
    completionRate: 0.88,
    activeStreakDays: 14,
    completedToday: false, // leave pending for today so user can check it!
  },
  {
    name: "Physical Training & Mobility",
    description: "Zone 2 cardio, kettlebell strength work, or mobility flows",
    color: "rose",
    frequency: { type: "weekly_target", targetDaysPerWeek: 5 },
    startDate: "2026-07-10",
    completionRate: 0.85,
    activeStreakDays: 20,
    completedToday: true,
  },
  {
    name: "Evening Digital Sunset",
    description: "All screens dark by 9:30 PM; 5-minute journal reflection",
    color: "violet",
    frequency: { type: "daily" },
    startDate: "2026-08-01",
    completionRate: 0.89,
    activeStreakDays: 18,
    completedToday: false, // leave pending for tonight!
  },
];

// ─────────────────────────────────────────────────────────────
// Realistic Tasks (Overdue, Due Today, Upcoming, Completed)
// ─────────────────────────────────────────────────────────────
const TASKS_DATA = [
  {
    title: "Design offline-first synchronization protocol",
    description: "Spec out client-side mutation queue and conflict resolution for unstable networks.",
    priority: TaskPriority.high,
    dueDate: new Date("2026-11-07T00:00:00.000Z"), // Tomorrow
    completed: false,
    createdAt: new Date("2026-11-04T10:00:00.000Z"),
  },
  {
    title: "Refactor Habit Heatmap tooltips for smooth framerate",
    description: "Optimize CSS transforms and memoize 52-week cell hover calculations.",
    priority: TaskPriority.high,
    dueDate: new Date("2026-11-06T00:00:00.000Z"), // Today
    completed: false,
    createdAt: new Date("2026-11-05T09:30:00.000Z"),
  },
  {
    title: "Ship release notes & changelog for Zanshin v0.2.0",
    description: "Document new ambient sounds, keyboard shortcuts, and heatmap color palettes.",
    priority: TaskPriority.medium,
    dueDate: new Date("2026-11-06T00:00:00.000Z"), // Today
    completed: true,
    createdAt: new Date("2026-11-05T14:00:00.000Z"),
  },
  {
    title: "Draft weekly technical retrospective in Journal",
    description: "Synthesize lessons learned from state management refactor.",
    priority: TaskPriority.medium,
    dueDate: new Date("2026-11-06T00:00:00.000Z"), // Today
    completed: true,
    createdAt: new Date("2026-11-06T08:00:00.000Z"),
  },
  {
    title: "Audit typography scales & dark mode contrast ratios",
    description: "Verify WCAG AAA compliance on muted text against card backgrounds.",
    priority: TaskPriority.medium,
    dueDate: new Date("2026-11-09T00:00:00.000Z"), // Next week
    completed: false,
    createdAt: new Date("2026-11-03T11:15:00.000Z"),
  },
  {
    title: "Research Web Audio API spatial sound filters for Focus Mode",
    description: "Investigate biquad filter nodes to simulate binaural rain positioning.",
    priority: TaskPriority.low,
    dueDate: new Date("2026-11-14T00:00:00.000Z"),
    completed: false,
    createdAt: new Date("2026-11-02T16:20:00.000Z"),
  },
  {
    title: "Order ergonomic mechanical split keyboard keycaps",
    description: "Low-profile PBT keycaps with Japanese sublegends.",
    priority: TaskPriority.low,
    dueDate: new Date("2026-11-04T00:00:00.000Z"), // Overdue!
    completed: false,
    createdAt: new Date("2026-10-28T13:00:00.000Z"),
  },
  {
    title: "Clean up obsolete Git branches and sync upstream",
    description: "Prune merged feature branches and verify tag signing.",
    priority: TaskPriority.low,
    dueDate: new Date("2026-11-05T00:00:00.000Z"),
    completed: true,
    createdAt: new Date("2026-11-01T15:45:00.000Z"),
  },
  {
    title: "Verify Supabase Auth session refresh in edge middleware",
    description: "Ensure cookies refresh correctly without unnecessary token roundtrips.",
    priority: TaskPriority.high,
    dueDate: new Date("2026-11-03T00:00:00.000Z"),
    completed: true,
    createdAt: new Date("2026-10-30T10:00:00.000Z"),
  },
];

// ─────────────────────────────────────────────────────────────
// Pomodoro Sessions (Last 14 Days to populate Focus Bento)
// ─────────────────────────────────────────────────────────────
function generatePomodoroSessions(userId: string) {
  const sessions: Array<{
    userId: string;
    mode: PomodoroMode;
    durationSec: number;
    completedAt: Date;
  }> = [];

  const today = new Date(); // Nov 6, 2026

  // Session counts per day for the last 14 days (today = index 0)
  const sessionPlan = [
    { daysAgo: 0, count: 4, duration: 1500 }, // Today: 4 sessions = 100 min
    { daysAgo: 1, count: 5, duration: 1500 }, // Nov 5: 125 min
    { daysAgo: 2, count: 6, duration: 1500 }, // Nov 4: 150 min
    { daysAgo: 3, count: 4, duration: 1500 }, // Nov 3: 100 min
    { daysAgo: 4, count: 7, duration: 1500 }, // Nov 2: 175 min
    { daysAgo: 5, count: 5, duration: 1500 }, // Nov 1: 125 min
    { daysAgo: 6, count: 3, duration: 1500 }, // Oct 31: 75 min
    { daysAgo: 7, count: 5, duration: 1500 }, // Oct 30: 125 min
    { daysAgo: 8, count: 4, duration: 1500 }, // Oct 29: 100 min
    { daysAgo: 9, count: 6, duration: 1500 }, // Oct 28: 150 min
    { daysAgo: 10, count: 4, duration: 1500 }, // Oct 27: 100 min
    { daysAgo: 11, count: 5, duration: 1500 }, // Oct 26: 125 min
    { daysAgo: 12, count: 3, duration: 1500 }, // Oct 25: 75 min
    { daysAgo: 13, count: 6, duration: 1500 }, // Oct 24: 150 min
  ];

  for (const plan of sessionPlan) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - plan.daysAgo);

    for (let i = 0; i < plan.count; i++) {
      const sessionTime = new Date(targetDate);
      // Stagger sessions between 9:00 AM and 5:00 PM
      sessionTime.setHours(9 + Math.floor(i * 1.3), (i * 25) % 60, 0, 0);

      sessions.push({
        userId,
        mode: PomodoroMode.work,
        durationSec: plan.duration,
        completedAt: sessionTime,
      });
    }
  }

  return sessions;
}

// ─────────────────────────────────────────────────────────────
// Seed logic for a single user
// ─────────────────────────────────────────────────────────────
async function seedUser(userId: string, email: string) {
  console.log(`\n🌱 Seeding rich dummy data for user: ${email} (${userId})...`);

  // 1. Clean previous data for this user to remain fully idempotent
  console.log(`  🧹 Cleaning existing user tasks, journal entries, habits, sessions...`);
  await prisma.habitCompletionLog.deleteMany({
    where: { habit: { userId } },
  });
  await prisma.habit.deleteMany({ where: { userId } });
  await prisma.task.deleteMany({ where: { userId } });
  await prisma.journalEntry.deleteMany({ where: { userId } });
  await prisma.pomodoroSession.deleteMany({ where: { userId } });

  // 2. Insert 10 Journal Entries
  console.log(`  ✍️  Inserting 10 authentic journal entries...`);
  for (const entry of JOURNAL_ENTRIES) {
    await prisma.journalEntry.create({
      data: {
        userId,
        title: entry.title,
        content: entry.content,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  }

  // 3. Insert Habits and Months of Daily Completion Logs
  console.log(`  🔥 Inserting 5 habits tracked over months with heatmap completion logs...`);
  const today = new Date();
  const todayStr = formatDate(today);

  for (const cfg of HABITS_CONFIG) {
    const habit = await prisma.habit.create({
      data: {
        userId,
        name: cfg.name,
        description: cfg.description,
        color: cfg.color,
        frequency: cfg.frequency,
        createdDate: parseDateKey(cfg.startDate),
        archivedDate: null,
      },
    });

    // Generate completion logs from startDate up to today
    const logsToCreate: Array<{
      habitId: string;
      date: Date;
      status: HabitStatus;
    }> = [];

    const curr = parseDateKey(cfg.startDate);
    const end = parseDateKey(todayStr);

    while (curr <= end) {
      const dStr = formatDate(curr);
      const isToday = dStr === todayStr;

      // Determine if scheduled based on habit frequency
      let isScheduled = true;
      if (cfg.frequency.type === "weekdays" && cfg.frequency.daysOfWeek) {
        isScheduled = cfg.frequency.daysOfWeek.includes(curr.getDay());
      }

      if (isScheduled) {
        if (isToday) {
          if (cfg.completedToday) {
            logsToCreate.push({
              habitId: habit.id,
              date: new Date(curr),
              status: HabitStatus.completed,
            });
          }
          // If not completed today, we omit it so it stays pending in the UI!
        } else {
          // Check how many days ago this date was
          const diffDays = Math.round((end.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
          const inActiveStreak = diffDays <= cfg.activeStreakDays;

          if (inActiveStreak) {
            // Keep streak alive and healthy!
            logsToCreate.push({
              habitId: habit.id,
              date: new Date(curr),
              status: HabitStatus.completed,
            });
          } else {
            // Semi-realistic pseudo-random distribution matching completionRate
            // Use deterministic hash of date string so it's consistent
            const charSum = dStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const isCompleted = (charSum % 100) < cfg.completionRate * 100;

            logsToCreate.push({
              habitId: habit.id,
              date: new Date(curr),
              status: isCompleted ? HabitStatus.completed : HabitStatus.missed,
            });
          }
        }
      }

      curr.setDate(curr.getDate() + 1);
    }

    if (logsToCreate.length > 0) {
      await prisma.habitCompletionLog.createMany({
        data: logsToCreate,
        skipDuplicates: true,
      });
    }

    console.log(`     ✓ Habit "${cfg.name}" created with ${logsToCreate.length} completion logs.`);
  }

  // 4. Insert Tasks
  console.log(`  📋 Inserting 9 diverse tasks across priority and status...`);
  for (const t of TASKS_DATA) {
    await prisma.task.create({
      data: {
        userId,
        title: t.title,
        description: t.description,
        priority: t.priority,
        dueDate: t.dueDate,
        completed: t.completed,
        createdAt: t.createdAt,
      },
    });
  }

  // 5. Insert Pomodoro Sessions
  console.log(`  ⏱️  Inserting 70+ Pomodoro focus sessions across the last 14 days...`);
  const sessions = generatePomodoroSessions(userId);
  await prisma.pomodoroSession.createMany({
    data: sessions,
  });

  // 6. User Settings
  console.log(`  ⚙️  Configuring default zen user settings...`);
  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      showSeconds: false,
      showDate: true,
      use24Hour: true,
      clockStyle: ClockStyle.digital,
      musicVolume: 0.7,
      musicRepeatMode: RepeatMode.off,
      musicShuffle: false,
    },
    create: {
      userId,
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      showSeconds: false,
      showDate: true,
      use24Hour: true,
      clockStyle: ClockStyle.digital,
      musicVolume: 0.7,
      musicRepeatMode: RepeatMode.off,
      musicShuffle: false,
    },
  });

  console.log(`✨ Successfully seeded complete dummy data for ${email}!`);
}

// ─────────────────────────────────────────────────────────────
// Main CLI Runner
// ─────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const emailArg = args.find((a) => a.startsWith("--email="))?.split("=")[1];
  const allArg = args.includes("--all");

  const allUsers = await prisma.user.findMany();

  if (allUsers.length === 0) {
    console.error("❌ No users found in the database. Please sign up or create a user first.");
    process.exit(1);
  }

  let targetUsers = allUsers;

  if (emailArg) {
    targetUsers = allUsers.filter((u) => u.email.toLowerCase() === emailArg.toLowerCase());
    if (targetUsers.length === 0) {
      console.error(`❌ User with email "${emailArg}" was not found.`);
      console.log(`Available users: ${allUsers.map((u) => u.email).join(", ")}`);
      process.exit(1);
    }
  } else if (!allArg) {
    // Default to the primary user arpit.neewaliya@gmail.com and dashboard.reviewer@test.com
    const primary = allUsers.filter((u) =>
      ["arpit.neewaliya@gmail.com", "dashboard.reviewer@test.com"].includes(u.email)
    );
    targetUsers = primary.length > 0 ? primary : [allUsers[0]];
  }

  console.log(`====================================================`);
  console.log(`  ZANSHIN FOCUS — DUMMY DATA SEEDER`);
  console.log(`  Targeting ${targetUsers.length} user(s):`);
  targetUsers.forEach((u) => console.log(`  • ${u.email} (${u.name || "No name"})`));
  console.log(`====================================================`);

  for (const user of targetUsers) {
    await seedUser(user.id, user.email);
  }

  console.log(`\n🎉 All done! You can now reload your browser at http://localhost:3000 to see your populated dashboard, 10 journal entries, and habits tracked for months.`);
}

main()
  .catch((e) => {
    console.error("Error running seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

