import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { Text, Button, Card, useTheme, Chip, IconButton } from 'react-native-paper';
import { phoenixTheme, phoenixColors } from '../constants/theme';
import { dummyFastingSessions } from '../constants/dummyData';
import { FastingSession } from '../types';
import * as Storage from '../utils/storage';
import * as NotificationService from '../utils/notifications';
import { useNavigation } from '@react-navigation/native';
import CircularTimer from '../components/CircularTimer';
import TimerControls from '../components/TimerControls';
import TimerDisplay from '../components/TimerDisplay';

const FastingTimerScreen = () => {
  const theme = phoenixTheme;
  const navigation = useNavigation();
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Predefined fasting durations in hours
  const fastingOptions = [
    { label: '16:8', hours: 16 },
    { label: '18:6', hours: 18 },
    { label: '20:4', hours: 20 },
    { label: '24', hours: 24 },
  ];

  // Initialize notifications when component mounts
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize notifications
        await NotificationService.initializeNotifications();
        
        // Load active fasting session from storage
        const activeSession = await Storage.getActiveFastingSession();
        
        if (activeSession) {
          console.log('Loaded active fasting session:', activeSession.id);
          setCurrentSession(activeSession);
        } else {
          console.log('No active fasting session found');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  // Update timer when current session changes
  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - currentSession.startTime;
      setElapsedTime(elapsed);
      setProgress(Math.min(elapsed / currentSession.targetDuration, 1));
      
      // Auto-complete the fast if it's finished
      if (elapsed >= currentSession.targetDuration && !currentSession.endTime) {
        completeFast();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startFast = async (hours: number) => {
    try {
      const newSession: FastingSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        endTime: null,
        targetDuration: hours * 60 * 60 * 1000,
        isCompleted: false,
      };
      
      // Save to storage
      await Storage.saveFastingSession(newSession);
      
      // Schedule notifications
      await NotificationService.scheduleFastingNotifications(newSession);
      
      // Update state
      setCurrentSession(newSession);
      
      console.log('Started new fasting session:', newSession.id);
    } catch (error) {
      console.error('Error starting fast:', error);
      Alert.alert('Error', 'Failed to start fasting session. Please try again.');
    }
  };

  const endFast = async () => {
    if (!currentSession) return;
    
    try {
      // Update session
      const updatedSession = {
        ...currentSession,
        endTime: Date.now(),
        isCompleted: true,
      };
      
      // Save to storage
      await Storage.updateFastingSession(updatedSession);
      
      // Cancel notifications
      await NotificationService.cancelFastingSessionNotifications(updatedSession.id);
      
      // Update state
      setCurrentSession(null);
      
      console.log('Ended fasting session:', updatedSession.id);
    } catch (error) {
      console.error('Error ending fast:', error);
      Alert.alert('Error', 'Failed to end fasting session. Please try again.');
    }
  };
  
  const completeFast = async () => {
    if (!currentSession) return;
    
    try {
      // Update session
      const updatedSession = {
        ...currentSession,
        endTime: Date.now(),
        isCompleted: true,
      };
      
      // Save to storage
      await Storage.updateFastingSession(updatedSession);
      
      // Cancel notifications
      await NotificationService.cancelFastingSessionNotifications(updatedSession.id);
      
      // Update state
      setCurrentSession(null);
      
      // Show completion alert
      Alert.alert(
        'Fasting Complete! 🎉',
        'Congratulations! You have successfully completed your fast.',
        [{ text: 'OK' }]
      );
      
      console.log('Completed fasting session:', updatedSession.id);
    } catch (error) {
      console.error('Error completing fast:', error);
    }
  };

  // Animation for entry
  const entryAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Animate entry when component mounts
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading fasting timer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: entryAnim,
            transform: [{ scale: entryAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1]
            })}]
          }
        ]}
      >
        {currentSession ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerTitle}>Current Fast</Text>
            
            {/* Circular Timer */}
            <CircularTimer 
              progress={progress} 
              size={280} 
              strokeWidth={15}
              duration={1000}
              colors={{
                background: phoenixColors.accent2,
                progress: phoenixColors.primary,
                progressEnd: phoenixColors.secondary
              }}
              style={styles.circularTimer}
            >
              <TimerDisplay 
                elapsedTime={elapsedTime}
                targetDuration={currentSession.targetDuration}
                progress={progress}
              />
            </CircularTimer>
            
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Started</Text>
                <Text style={styles.statValue}>
                  {new Date(currentSession.startTime).toLocaleTimeString()}
                </Text>
              </View>
              
              <View style={styles.stat}>
                <Text style={styles.statLabel}>End Time</Text>
                <Text style={styles.statValue}>
                  {new Date(currentSession.startTime + currentSession.targetDuration).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            
            <TimerControls
              isRunning={true}
              onStart={startFast}
              onEnd={endFast}
              fastingOptions={fastingOptions}
            />
          </View>
        ) : (
          <View style={styles.startContainer}>
            <CircularTimer 
              progress={0} 
              size={200} 
              strokeWidth={10}
              duration={0}
              showAnimation={false}
              style={styles.emptyCircularTimer}
            >
              <View style={styles.emptyTimerContent}>
                <Text style={styles.emptyTimerText}>Ready to start?</Text>
              </View>
            </CircularTimer>
            
            <TimerControls
              isRunning={false}
              onStart={startFast}
              onEnd={endFast}
              fastingOptions={fastingOptions}
            />
            
            <Card style={styles.infoCard}>
              <Card.Title title="Fasting Benefits" />
              <Card.Content>
                <Text variant="bodyMedium">
                  Intermittent fasting can help with weight management, improve metabolic health, 
                  enhance cellular repair processes, and may provide other health benefits.
                </Text>
              </Card.Content>
            </Card>
            
            <Button
              mode="outlined"
              icon="history"
              onPress={() => navigation.navigate('FastingHistoryScreen' as never)}
              style={styles.historyButton}
            >
              View Fasting History
            </Button>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: phoenixColors.background,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: phoenixColors.text,
  },
  circularTimer: {
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyCircularTimer: {
    marginVertical: 20,
    opacity: 0.7,
  },
  emptyTimerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTimerText: {
    fontSize: 18,
    fontWeight: '600',
    color: phoenixColors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: phoenixColors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: phoenixColors.accent1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: phoenixColors.text,
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
  },
  infoCard: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  historyButton: {
    marginTop: 10,
  },
});

export default FastingTimerScreen;
