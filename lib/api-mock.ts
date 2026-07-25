import { GymLog, MonthlyStat, PREBUILT_PLANS, Stats, User, WeeklyPlan, WorkoutType } from './types';
import { calculateScientificStreak } from './scientific-streak';

const SESSION_KEY = 'gym_git_session';
const LOGS_KEY = 'gym_git_logs_v2'; // Bumped key to refresh localStorage seed data automatically

const delay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Generate realistic mock logs for the past 365 days with realistic variation (including Aqua/Mumen Rider slumps!)
function generateSeedLogs(): GymLog[] {
  const logs: GymLog[] = [];
  const today = new Date();
  const workoutTypes: WorkoutType[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Core', 'Custom'];

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateKey(d);

    const month = d.getMonth(); // 0 = Jan, 1 = Feb, etc.
    const dayOfWeek = d.getDay();

    let gymChance = 0.5;
    let preferredHours = [1.0, 1.25, 1.5];

    // Create distinct realistic monthly phases:
    if (month === 0) {
      // Jan: New Year Resolution (High attendance: Gojo/Naruto tier)
      gymChance = dayOfWeek === 0 ? 0.2 : 0.75;
    } else if (month === 1) {
      // Feb: Slump / Dropped off (Very low attendance: Aqua tier - ~1-2 sessions in entire month)
      gymChance = 0.04;
      preferredHours = [0.5];
    } else if (month === 2) {
      // Mar: Rebuilding habit (Low-medium: Mumen Rider / Tanjiro tier)
      gymChance = dayOfWeek === 1 || dayOfWeek === 4 ? 0.4 : 0.05;
    } else if (month === 3) {
      // Apr: Steady routine (Deku tier: ~3 days/week)
      gymChance = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 ? 0.6 : 0.1;
    } else if (month === 4) {
      // May: Peak Beast Mode (Goku / Luffy tier: 5 days/week optimal length)
      gymChance = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.85;
      preferredHours = [1.0, 1.25, 1.5];
    } else if (month === 5) {
      // Jun: Vacation / Work Overload (Aqua tier: 1 session in entire month)
      gymChance = 0.03;
      preferredHours = [0.5];
    } else {
      // Jul - Dec: Balanced variety
      gymChance = dayOfWeek === 0 || dayOfWeek === 6 ? 0.25 : 0.55;
    }

    if (Math.random() < gymChance) {
      const hours = preferredHours[Math.floor(Math.random() * preferredHours.length)];
      const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];

      logs.push({
        id: `seed-${dateStr}`,
        date: dateStr,
        hours,
        workoutType,
        notes: `${workoutType} session (${hours}h)`,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return logs;
}

function getStoredLogs(): GymLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LOGS_KEY);
  if (!raw) {
    const seeded = generateSeedLogs();
    localStorage.setItem(LOGS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as GymLog[];
  } catch (e) {
    console.error('Failed to parse gym logs from localStorage', e);
    const seeded = generateSeedLogs();
    localStorage.setItem(LOGS_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveStoredLogs(logs: GymLog[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

// --- AUTHENTICATION & USER PLAN MOCKS ---

export async function mockLogin(email: string, password: string, selectedPlan?: WeeklyPlan): Promise<User> {
  await delay(300);
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user: User = {
    email,
    name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    provider: 'email',
    weeklyPlan: selectedPlan || PREBUILT_PLANS[0],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  return user;
}

export async function mockGoogleLogin(selectedPlan?: WeeklyPlan): Promise<User> {
  await delay(400);
  const user: User = {
    email: 'alex.developer@gmail.com',
    name: 'Alex Developer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    provider: 'google',
    weeklyPlan: selectedPlan || PREBUILT_PLANS[0],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  return user;
}

export async function mockUpdateUserPlan(plan: WeeklyPlan): Promise<User> {
  await delay(200);
  if (typeof window === 'undefined') throw new Error('No browser context');
  const raw = localStorage.getItem(SESSION_KEY);
  let user: User;
  if (raw) {
    user = JSON.parse(raw);
    user.weeklyPlan = plan;
  } else {
    user = {
      email: 'demo@example.com',
      name: 'Demo Gymmer',
      provider: 'email',
      weeklyPlan: plan,
    };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function mockLogout(): Promise<void> {
  await delay(150);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function mockGetSession(): Promise<User | null> {
  await delay(100);
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as User;
    if (!u.weeklyPlan) {
      u.weeklyPlan = PREBUILT_PLANS[0];
    }
    return u;
  } catch {
    return null;
  }
}

// --- LOGS CRUD API MOCKS ---

export async function mockGetLogs(startDate?: string, endDate?: string): Promise<GymLog[]> {
  await delay(200);
  let logs = getStoredLogs();

  if (startDate) {
    logs = logs.filter((log) => log.date >= startDate);
  }
  if (endDate) {
    logs = logs.filter((log) => log.date <= endDate);
  }

  return logs.sort((a, b) => a.date.localeCompare(b.date));
}

export async function mockSaveLog(
  date: string,
  hours: number,
  workoutType: WorkoutType,
  notes?: string
): Promise<GymLog> {
  await delay(200);
  const logs = getStoredLogs();
  const existingIndex = logs.findIndex((l) => l.date === date);

  if (hours <= 0) {
    if (existingIndex !== -1) {
      logs.splice(existingIndex, 1);
      saveStoredLogs(logs);
    }
    return { id: `deleted-${date}`, date, hours: 0, workoutType, notes };
  }

  let updatedLog: GymLog;
  if (existingIndex !== -1) {
    updatedLog = {
      ...logs[existingIndex],
      hours,
      workoutType,
      notes: notes !== undefined ? notes : logs[existingIndex].notes,
      updatedAt: new Date().toISOString(),
    };
    logs[existingIndex] = updatedLog;
  } else {
    updatedLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date,
      hours,
      workoutType,
      notes: notes || `${workoutType} Session`,
      updatedAt: new Date().toISOString(),
    };
    logs.push(updatedLog);
  }

  saveStoredLogs(logs);
  return updatedLog;
}

export async function mockDeleteLog(date: string): Promise<void> {
  await delay(150);
  const logs = getStoredLogs();
  const filtered = logs.filter((l) => l.date !== date);
  saveStoredLogs(filtered);
}

// --- STATS MOCK ---

export async function mockGetStats(userPlan?: WeeklyPlan): Promise<Stats> {
  await delay(200);
  const logs = getStoredLogs();
  
  const activeLogMap = new Map<string, GymLog>();
  logs.forEach((log) => {
    if (log.hours > 0) {
      activeLogMap.set(log.date, log);
    }
  });

  // Calculate Scientific Plan-Conforming Streak
  const scientificStreak = calculateScientificStreak(logs, userPlan);

  const totalDays = activeLogMap.size;
  let totalHours = 0;
  activeLogMap.forEach((log) => {
    totalHours += log.hours;
  });

  const averageHoursPerSession = totalDays > 0 ? Number((totalHours / totalDays).toFixed(1)) : 0;

  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData: MonthlyStat[] = monthNames.map((name, index) => {
    let count = 0;
    let monthTotalHours = 0;

    activeLogMap.forEach((log) => {
      const [y, m] = log.date.split('-').map(Number);
      if (y === currentYear && m === index + 1) {
        count++;
        monthTotalHours += log.hours;
      }
    });

    return {
      month: name,
      monthIndex: index,
      year: currentYear,
      count,
      totalHours: Number(monthTotalHours.toFixed(1)),
    };
  });

  return {
    currentStreak: scientificStreak.currentStreakDays,
    longestStreak: scientificStreak.longestStreakDays,
    totalDays,
    totalHours: Number(totalHours.toFixed(1)),
    averageHoursPerSession,
    monthlyData,
    scientificStreak,
  };
}

export async function mockResetData(): Promise<GymLog[]> {
  await delay(300);
  const seeded = generateSeedLogs();
  saveStoredLogs(seeded);
  return seeded;
}
