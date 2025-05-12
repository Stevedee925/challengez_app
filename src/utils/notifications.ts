import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FastingSession } from '../types';

// Store notification IDs for active fasting sessions
const activeNotifications: Record<string, string[]> = {};

/**
 * Initialize notifications for the app
 * This should be called early in the app lifecycle
 */
export const initializeNotifications = async (): Promise<void> => {
  try {
    // Request permissions
    await requestNotificationPermissions();
    
    // Set up notification handler with type assertion to handle API changes
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        // Add these properties to satisfy TypeScript
        shouldShowBanner: true,
        shouldShowList: true,
      } as any),
    });
    
    console.log('Notifications initialized');
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

/**
 * Request notification permissions
 * @returns Boolean indicating if permissions were granted
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Return true if permission was granted
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule notifications for a fasting session
 * @param session The fasting session
 * @returns Boolean indicating if notifications were scheduled
 */
export const scheduleFastingNotifications = async (
  session: FastingSession
): Promise<boolean> => {
  try {
    // Check if we have permission
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    // Cancel any existing notifications for this session
    if (activeNotifications[session.id]) {
      await cancelFastingSessionNotifications(session.id);
    }

    // Initialize notification array for this session
    activeNotifications[session.id] = [];
    
    // Schedule end of fast notification
    const endTime = session.startTime + session.targetDuration;
    
    // Only schedule if the fast hasn't ended yet
    if (endTime > Date.now()) {
      try {
        // Use type assertion to handle API changes
        const endNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Fasting Complete! 🎉',
            body: 'Congratulations! You have successfully completed your fast.',
          },
          trigger: {
            seconds: Math.floor((endTime - Date.now()) / 1000),
            // Add type property to satisfy TypeScript
            type: 'timeInterval',
          } as any,
        });
        
        activeNotifications[session.id].push(endNotificationId);
        console.log('End of fast notification scheduled:', endNotificationId);
      } catch (error) {
        console.error('Error scheduling end notification:', error);
      }
    }
    
    // Schedule halfway reminder
    const halfwayTime = session.startTime + (session.targetDuration / 2);
    if (halfwayTime > Date.now()) {
      try {
        // Use type assertion to handle API changes
        const halfwayNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Halfway There!',
            body: 'You\'re halfway through your fast! Keep going strong!',
          },
          trigger: {
            seconds: Math.floor((halfwayTime - Date.now()) / 1000),
            // Add type property to satisfy TypeScript
            type: 'timeInterval',
          } as any,
        });
        
        activeNotifications[session.id].push(halfwayNotificationId);
        console.log('Halfway reminder scheduled:', halfwayNotificationId);
      } catch (error) {
        console.error('Error scheduling halfway notification:', error);
      }
    }
    
    // Schedule 1-hour remaining reminder (if fast is longer than 1 hour)
    const oneHourInMs = 60 * 60 * 1000;
    if (session.targetDuration > oneHourInMs) {
      const oneHourRemainingTime = endTime - oneHourInMs;
      
      if (oneHourRemainingTime > Date.now()) {
        try {
          // Use type assertion to handle API changes
          const oneHourNotificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Almost Done!',
              body: 'Just 1 hour left in your fast! You\'re almost there!',
            },
            trigger: {
              seconds: Math.floor((oneHourRemainingTime - Date.now()) / 1000),
              // Add type property to satisfy TypeScript
              type: 'timeInterval',
            } as any,
          });
          
          activeNotifications[session.id].push(oneHourNotificationId);
          console.log('One hour reminder scheduled:', oneHourNotificationId);
        } catch (error) {
          console.error('Error scheduling one hour notification:', error);
        }
      }
    }
    
    return activeNotifications[session.id].length > 0;
  } catch (error) {
    console.error('Error scheduling fasting notifications:', error);
    return false;
  }
};

/**
 * Cancel all notifications for a specific fasting session
 * @param sessionId The ID of the fasting session
 */
export const cancelFastingSessionNotifications = async (
  sessionId: string
): Promise<void> => {
  try {
    const notificationIds = activeNotifications[sessionId] || [];
    
    for (const id of notificationIds) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch (error) {
        console.error(`Error cancelling notification ${id}:`, error);
      }
    }
    
    // Clear the notifications array for this session
    activeNotifications[sessionId] = [];
    console.log(`Cancelled all notifications for session ${sessionId}`);
  } catch (error) {
    console.error('Error cancelling session notifications:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Clear all active notifications
    Object.keys(activeNotifications).forEach(key => {
      activeNotifications[key] = [];
    });
    
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};
