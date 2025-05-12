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
  profileImage: undefined, // Will be populated when user uploads an image
  stats: {
    age: 28,
    weight: 75, // in kg
    height: 180, // in cm
    fitnessLevel: 'intermediate',
    goals: ['Weight loss', 'Muscle gain', 'Better sleep'],
    weeklyActivityLevel: 4, // 4 days per week
  },
  transformationDrivers: ['health', 'mindfulness'],
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
  // Predefined fasting challenges
  {
    id: '1',
    title: 'Intro to I.F. Challenge',
    description: 'Complete one 12 hr, 16 hr or 20 hour fast.',
    frequency: 'daily',
    startDate: now,
    endDate: now + 2 * dayInMs, // 2 days to complete
    progress: [],
    type: 'fasting',
    fastingType: 'intermittent',
    fastingDuration: 16, // Default to 16 hours, but user can choose 12, 16, or 20
    daysRequired: 1,
    trophy: {
      name: 'I.F. Beginner',
      description: 'Successfully completed your first intermittent fast!',
      awarded: false
    }
  },
  {
    id: '2',
    title: '3-Day Fasting Challenge',
    description: 'Complete 3 consecutive days of a 16 or 20 hour fast.',
    frequency: 'daily',
    startDate: now,
    endDate: now + 4 * dayInMs, // 4 days to complete
    progress: [],
    type: 'fasting',
    fastingType: 'intermittent',
    fastingDuration: 16, // Default to 16 hours, but user can choose 16 or 20
    daysRequired: 3,
    trophy: {
      name: 'Fasting Warrior',
      description: 'Successfully completed 3 consecutive days of intermittent fasting!',
      awarded: false
    }
  },
  {
    id: '3',
    title: 'OMAD Challenge',
    description: 'Eat only one meal a day for 1 Day.',
    frequency: 'daily',
    startDate: now,
    endDate: now + 2 * dayInMs, // 2 days to complete
    progress: [],
    type: 'fasting',
    fastingType: 'omad',
    daysRequired: 1,
    trophy: {
      name: 'OMAD Initiate',
      description: 'Successfully completed your first day of One Meal A Day!',
      awarded: false
    }
  },
  {
    id: '4',
    title: '3-Day OMAD Challenge',
    description: 'Eat only one meal a day for 3 consecutive days.',
    frequency: 'daily',
    startDate: now,
    endDate: now + 4 * dayInMs, // 4 days to complete
    progress: [],
    type: 'fasting',
    fastingType: 'omad',
    daysRequired: 3,
    trophy: {
      name: 'OMAD Master',
      description: 'Successfully completed 3 consecutive days of One Meal A Day!',
      awarded: false
    }
  },
  {
    id: '5',
    title: 'Personalized Challenge',
    description: 'Create a custom fasting challenge with AI assistance.',
    frequency: 'daily',
    startDate: now,
    endDate: null, // Will be set when created
    progress: [],
    type: 'ai-generated',
    trophy: {
      name: 'Challenge Creator',
      description: 'Successfully created and completed your personalized challenge!',
      awarded: false
    }
  },
  // Keep existing challenges for backward compatibility
  {
    id: '6',
    title: '30-Day Intermittent Fasting',
    description: 'Complete a 16:8 intermittent fasting schedule for 30 days',
    frequency: 'daily',
    startDate: now - 10 * dayInMs, // Started 10 days ago
    endDate: now + 20 * dayInMs, // Ends in 20 days
    progress: Array.from({ length: 10 }, (_, i) => ({
      date: now - (10 - i) * dayInMs,
      isCompleted: true,
    })),
    type: 'custom'
  },
  {
    id: '7',
    title: 'Daily Meditation',
    description: 'Meditate for at least 10 minutes every day',
    frequency: 'daily',
    startDate: now - 5 * dayInMs, // Started 5 days ago
    endDate: now + 25 * dayInMs, // Ends in 25 days
    progress: Array.from({ length: 5 }, (_, i) => ({
      date: now - (5 - i) * dayInMs,
      isCompleted: i !== 2, // Missed one day
    })),
    type: 'custom'
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
