import AsyncStorage from '@react-native-async-storage/async-storage';
import { FastingSession, User } from '../types';

// Storage keys
const ACTIVE_FASTING_SESSION = 'active_fasting_session';
const FASTING_SESSIONS = 'fasting_sessions';
const USER_DATA = 'userData';
const PROFILE_IMAGE_URI = 'profileImageUri';

/**
 * Save a fasting session to AsyncStorage
 * @param session The fasting session to save
 */
export const saveFastingSession = async (session: FastingSession): Promise<void> => {
  try {
    // First, get all existing sessions
    const existingSessions = await getAllFastingSessions();
    
    // Check if the session already exists
    const sessionIndex = existingSessions.findIndex(s => s.id === session.id);
    
    if (sessionIndex !== -1) {
      // Update existing session
      existingSessions[sessionIndex] = session;
    } else {
      // Add new session
      existingSessions.push(session);
    }
    
    // Save all sessions
    await AsyncStorage.setItem(FASTING_SESSIONS, JSON.stringify(existingSessions));
    
    // If this is an active session, save it as the active session
    if (session.endTime === null) {
      await AsyncStorage.setItem(ACTIVE_FASTING_SESSION, JSON.stringify(session));
    } else {
      // If the session is completed and was the active session, remove it
      const activeSession = await getActiveFastingSession();
      if (activeSession && activeSession.id === session.id) {
        await AsyncStorage.removeItem(ACTIVE_FASTING_SESSION);
      }
    }
    
    console.log('Fasting session saved successfully:', session.id);
  } catch (error) {
    console.error('Error saving fasting session:', error);
    throw error;
  }
};

/**
 * Get all fasting sessions from AsyncStorage
 * @returns Array of fasting sessions
 */
export const getAllFastingSessions = async (): Promise<FastingSession[]> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(FASTING_SESSIONS);
    if (sessionsJson) {
      return JSON.parse(sessionsJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting all fasting sessions:', error);
    return [];
  }
};

/**
 * Get the active fasting session from AsyncStorage
 * @returns The active fasting session or null if none exists
 */
export const getActiveFastingSession = async (): Promise<FastingSession | null> => {
  try {
    const sessionJson = await AsyncStorage.getItem(ACTIVE_FASTING_SESSION);
    if (sessionJson) {
      return JSON.parse(sessionJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting active fasting session:', error);
    return null;
  }
};

/**
 * Update an existing fasting session
 * @param session The updated fasting session
 */
export const updateFastingSession = async (session: FastingSession): Promise<void> => {
  await saveFastingSession(session);
};

/**
 * Delete a fasting session by ID
 * @param id The ID of the session to delete
 */
export const deleteFastingSession = async (id: string): Promise<void> => {
  try {
    // Get all sessions
    const sessions = await getAllFastingSessions();
    
    // Filter out the session to delete
    const updatedSessions = sessions.filter(session => session.id !== id);
    
    // Save the updated sessions
    await AsyncStorage.setItem(FASTING_SESSIONS, JSON.stringify(updatedSessions));
    
    // If this was the active session, remove it
    const activeSession = await getActiveFastingSession();
    if (activeSession && activeSession.id === id) {
      await AsyncStorage.removeItem(ACTIVE_FASTING_SESSION);
    }
    
    console.log('Fasting session deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting fasting session:', error);
    throw error;
  }
};

/**
 * Clear all fasting session data (for testing/debugging)
 */
export const clearAllFastingSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACTIVE_FASTING_SESSION);
    await AsyncStorage.removeItem(FASTING_SESSIONS);
    console.log('All fasting sessions cleared');
  } catch (error) {
    console.error('Error clearing fasting sessions:', error);
    throw error;
  }
};

/**
 * Save user data to AsyncStorage
 * @param userData The user data to save
 */
export const saveUserData = async (userData: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData));
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from AsyncStorage
 * @returns The user data or null if none exists
 */
export const getUserData = async (): Promise<User | null> => {
  try {
    const userDataJson = await AsyncStorage.getItem(USER_DATA);
    if (userDataJson) {
      return JSON.parse(userDataJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Update user profile image URI
 * @param imageUri The URI of the profile image
 */
export const saveProfileImageUri = async (imageUri: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_IMAGE_URI, imageUri);
    console.log('Profile image URI saved successfully');
    
    // Also update the user data with the new image URI
    const userData = await getUserData();
    if (userData) {
      userData.profileImage = imageUri;
      await saveUserData(userData);
    }
  } catch (error) {
    console.error('Error saving profile image URI:', error);
    throw error;
  }
};

/**
 * Get profile image URI from AsyncStorage
 * @returns The profile image URI or null if none exists
 */
export const getProfileImageUri = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PROFILE_IMAGE_URI);
  } catch (error) {
    console.error('Error getting profile image URI:', error);
    return null;
  }
};

/**
 * Clear user data (for testing/debugging or logout)
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA);
    console.log('User data cleared');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Update user stats
 * @param stats The updated user stats
 */
export const updateUserStats = async (stats: User['stats']): Promise<void> => {
  try {
    const userData = await getUserData();
    if (userData) {
      userData.stats = stats;
      await saveUserData(userData);
      console.log('User stats updated successfully');
    } else {
      throw new Error('No user data found to update stats');
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};
