/**
 * Standalone Script for seeding/testing 365 days of gym logs (< 2 hours per session).
 * Usage: node scripts/seedMockLogs.mjs
 */

const WORKOUT_TYPES = [
  {
    type: 'Push',
    minHours: 0.9,
    maxHours: 1.6,
    notes: 'Heavy Bench Press 100kg + Incline DB Press & Dips',
  },
  {
    type: 'Pull',
    minHours: 1.0,
    maxHours: 1.7,
    notes: 'Deadlifts 180kg + Weighted Pull-ups & Rows',
  },
  {
    type: 'Legs',
    minHours: 1.1,
    maxHours: 1.8,
    notes: 'Barbell Squats 140kg 4x5 + RDLs & Hamstring curls',
  },
  {
    type: 'Core',
    minHours: 0.6,
    maxHours: 1.0,
    notes: 'Ab rollout + Dragon flags & Hanging leg raises',
  },
  {
    type: 'Cardio',
    minHours: 0.7,
    maxHours: 1.3,
    notes: '5km Zone 2 aerobic run (24:15) + Mobility cooldown',
  },
  {
    type: 'Upper Body',
    minHours: 1.0,
    maxHours: 1.65,
    notes: 'Incline bench + Weighted chin-ups & Lateral raises',
  },
  {
    type: 'Lower Body',
    minHours: 1.0,
    maxHours: 1.7,
    notes: 'Front Squats 110kg + Glute ham raises & Hack squats',
  },
];

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateMockLogs(days = 365) {
  const logs = [];
  const today = new Date();

  let seed = 42;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayOfWeek = d.getDay();

    // Rest on some Sundays/Wednesdays (~5-6 days/week active)
    if ((dayOfWeek === 0 && random() < 0.45) || (dayOfWeek === 3 && random() < 0.35)) {
      continue;
    }

    const cat = WORKOUT_TYPES[Math.floor(random() * WORKOUT_TYPES.length)];
    const rawHours = cat.minHours + random() * (cat.maxHours - cat.minHours);
    const hours = Math.min(1.9, Math.round(rawHours * 10) / 10);

    logs.push({
      date: dateStr,
      hours,
      workoutType: cat.type,
      notes: cat.notes,
    });
  }

  return logs;
}

console.log(`Generated ${generateMockLogs(365).length} mock workout sessions (< 2 hours each).`);
