import { 
  User, 
  FastingSession, 
  JournalEntry, 
  Challenge, 
  Ritual 
} from '../types';

// Current timestamp for reference
const now = Date.now();
const dayInMs = 24 * 60 * 60 * 1000;

// Dummy user
export const dummyUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
};

// Dummy fasting sessions
export const dummyFastingSessions: FastingSession[] = [
  {
    id: '1',
    startTime: now - 10 * 60 * 60 * 1000, // 10 hours ago
    endTime: null, // ongoing
    targetDuration: 16 * 60 * 60 * 1000, // 16 hours
    isCompleted: false,
  },
  {
    id: '2',
    startTime: now - 2 * dayInMs - 18 * 60 * 60 * 1000, // 2 days and 18 hours ago
    endTime: now - 2 * dayInMs, // 2 days ago
    targetDuration: 18 * 60 * 60 * 1000, // 18 hours
    isCompleted: true,
  },
  {
    id: '3',
    startTime: now - 3 * dayInMs - 16 * 60 * 60 * 1000, // 3 days and 16 hours ago
    endTime: now - 3 * dayInMs, // 3 days ago
    targetDuration: 16 * 60 * 60 * 1000, // 16 hours
    isCompleted: true,
  },
];

// Dummy journal entries
export const dummyJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: now - 2 * 60 * 60 * 1000, // 2 hours ago
    title: 'Feeling great today',
    content: 'I completed my 16-hour fast and feel energized. Had a healthy meal to break my fast.',
    mood: 'happy',
    tags: ['fasting', 'energy', 'healthy eating'],
  },
  {
    id: '2',
    date: now - dayInMs, // 1 day ago
    title: 'Struggling with cravings',
    content: 'Today was difficult. Had strong cravings during my fast but managed to push through.',
    mood: 'challenged',
    tags: ['fasting', 'cravings', 'willpower'],
  },
  {
    id: '3',
    date: now - 2 * dayInMs, // 2 days ago
    title: 'New meditation practice',
    content: 'Started a new morning meditation ritual. Feeling calm and centered.',
    mood: 'peaceful',
    tags: ['meditation', 'morning ritual', 'mindfulness'],
  },
];

// Dummy challenges
export const dummyChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Intermittent Fasting',
    description: 'Complete a 16:8 intermittent fasting schedule for 30 days',
    frequency: 'daily',
    startDate: now - 10 * dayInMs, // Started 10 days ago
    endDate: now + 20 * dayInMs, // Ends in 20 days
    progress: Array.from({ length: 10 }, (_, i) => ({
      date: now - (10 - i) * dayInMs,
      isCompleted: true,
    })),
  },
  {
    id: '2',
    title: 'Daily Meditation',
    description: 'Meditate for at least 10 minutes every day',
    frequency: 'daily',
    startDate: now - 5 * dayInMs, // Started 5 days ago
    endDate: now + 25 * dayInMs, // Ends in 25 days
    progress: Array.from({ length: 5 }, (_, i) => ({
      date: now - (5 - i) * dayInMs,
      isCompleted: i !== 2, // Missed one day
    })),
  },
];

// Dummy rituals
export const dummyRituals: Ritual[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start the day with a 10-minute meditation session',
    time: '07:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    isActive: true,
    progress: Array.from({ length: 7 }, (_, i) => ({
      date: now - (7 - i) * dayInMs,
      isCompleted: i !== 3 && i !== 5, // Missed two days
    })),
  },
  {
    id: '2',
    title: 'Evening Journaling',
    description: 'Reflect on the day and write in journal',
    time: '21:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    isActive: true,
    progress: Array.from({ length: 7 }, (_, i) => ({
      date: now - (7 - i) * dayInMs,
      isCompleted: i !== 1, // Missed one day
    })),
  },
  {
    id: '3',
    title: 'Weekly Planning',
    description: 'Plan the week ahead',
    time: '18:00',
    days: ['sun'],
    isActive: true,
    progress: Array.from({ length: 2 }, (_, i) => ({
      date: now - (14 - i * 7) * dayInMs, // Last 2 Sundays
      isCompleted: true,
    })),
  },
];
