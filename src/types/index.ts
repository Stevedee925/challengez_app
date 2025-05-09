// Types for the app

// User type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Fasting session type
export interface FastingSession {
  id: string;
  startTime: number; // timestamp
  endTime: number | null; // timestamp or null if ongoing
  targetDuration: number; // in milliseconds
  isCompleted: boolean;
}

// Journal entry type
export interface JournalEntry {
  id: string;
  date: number; // timestamp
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}

// Challenge type
export interface Challenge {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: number; // timestamp
  endDate: number | null; // timestamp or null if ongoing
  progress: ChallengeProgress[];
}

// Challenge progress type
export interface ChallengeProgress {
  date: number; // timestamp
  isCompleted: boolean;
}

// Ritual type
export interface Ritual {
  id: string;
  title: string;
  description: string;
  time: string; // time of day, e.g. "08:00"
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  isActive: boolean;
  progress: RitualProgress[];
}

// Ritual progress type
export interface RitualProgress {
  date: number; // timestamp
  isCompleted: boolean;
}
