import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Chip, IconButton, Divider } from 'react-native-paper';
import { phoenixTheme, phoenixColors } from '../constants/theme';
import { dummyFastingSessions } from '../constants/dummyData';
import { FastingSession } from '../types';
import * as Storage from '../utils/storage';
import * as NotificationService from '../utils/notifications';
import { useNavigation } from '@react-navigation/native';
import CircularTimer from '../components/CircularTimer';
import TimerControls from '../components/TimerControls';
import TimerDisplay from '../components/TimerDisplay';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const FastingTimerScreen = () => {
  const theme = phoenixTheme;
  const navigation = useNavigation();
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Suggested fasting durations in hours
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
  const entryOpacity = useSharedValue(0);
  const entryScale = useSharedValue(0.9);
  
  useEffect(() => {
    // Animate entry when component mounts
    entryOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    entryScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: entryOpacity.value,
      transform: [{ scale: entryScale.value }],
    };
  });

  // Determine if we should show the "Fat Burning" status
  const shouldShowFatBurning = () => {
    if (!currentSession) return false;
    return progress >= 0.5; // Show after 50% progress
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading fasting timer...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {currentSession ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerTitle}>Track your intermittent fasting</Text>
            
            {/* Circular Timer */}
            <CircularTimer 
              progress={progress} 
              size={300} 
              strokeWidth={18}
              duration={1000}
              showPulse={true}
              statusText={shouldShowFatBurning() ? "Fat Burning" : undefined}
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
                showFastingState={false} // We're showing it in the CircularTimer statusText
              />
            </CircularTimer>
            
            <Card style={styles.statsCard}>
              <Card.Content style={styles.statsContent}>
                <View style={styles.statItem}>
                  <IconButton
                    icon="clock-start"
                    size={24}
                    iconColor={phoenixColors.primary}
                    style={styles.statIcon}
                  />
                  <View>
                    <Text style={styles.statLabel}>Started</Text>
                    <Text style={styles.statValue}>
                      {new Date(currentSession.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                </View>
                
                <Divider style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <IconButton
                    icon="clock-end"
                    size={24}
                    iconColor={phoenixColors.secondary}
                    style={styles.statIcon}
                  />
                  <View>
                    <Text style={styles.statLabel}>End Time</Text>
                    <Text style={styles.statValue}>
                      {new Date(currentSession.startTime + currentSession.targetDuration).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            
            <TimerControls
              isRunning={true}
              onStart={startFast}
              onEnd={endFast}
              fastingOptions={fastingOptions}
            />
          </View>
        ) : (
          <View style={styles.startContainer}>
            <Text style={styles.startTitle}>Ready to start your fast?</Text>
            
            <CircularTimer 
              progress={0} 
              size={240} 
              strokeWidth={12}
              duration={0}
              showAnimation={false}
              style={styles.emptyCircularTimer}
            >
              <View style={styles.emptyTimerContent}>
                <IconButton
                  icon="timer-outline"
                  size={40}
                  iconColor={phoenixColors.primary}
                />
                <Text style={styles.emptyTimerText}>Start a fast</Text>
              </View>
            </CircularTimer>
            
            <TimerControls
              isRunning={false}
              onStart={startFast}
              onEnd={endFast}
              fastingOptions={fastingOptions}
            />
            
            <Card style={styles.infoCard}>
              <Card.Title 
                title="Fasting Benefits" 
                titleStyle={styles.cardTitle}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="information-outline"
                    iconColor={phoenixColors.primary}
                  />
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium" style={styles.benefitText}>
                  Intermittent fasting can help with weight management, improve metabolic health, 
                  enhance cellular repair processes, and may provide other health benefits.
                </Text>
                
                <View style={styles.benefitChips}>
                  <Chip style={styles.benefitChip} icon="fire">Weight Loss</Chip>
                  <Chip style={styles.benefitChip} icon="brain">Mental Clarity</Chip>
                  <Chip style={styles.benefitChip} icon="heart-pulse">Heart Health</Chip>
                </View>
                
                <Text variant="bodySmall" style={styles.customizationHint}>
                  Choose from our suggested fasting durations or create your own custom schedule.
                </Text>
              </Card.Content>
            </Card>
            
            <Button
              mode="outlined"
              icon="history"
              onPress={() => navigation.navigate('FastingHistoryScreen' as never)}
              style={styles.historyButton}
              contentStyle={styles.historyButtonContent}
              labelStyle={styles.historyButtonLabel}
            >
              View Fasting History
            </Button>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: phoenixColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 24,
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
    paddingVertical: 20,
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: phoenixColors.text,
    textAlign: 'center',
  },
  circularTimer: {
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statsCard: {
    width: '90%',
    marginVertical: 24,
    borderRadius: 16,
    elevation: 4,
  },
  statsContent: {
    paddingVertical: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    margin: 0,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: phoenixColors.accent1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: phoenixColors.text,
  },
  statDivider: {
    marginVertical: 8,
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: phoenixColors.text,
    textAlign: 'center',
  },
  emptyCircularTimer: {
    marginVertical: 24,
    opacity: 0.8,
  },
  emptyTimerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTimerText: {
    fontSize: 20,
    fontWeight: '600',
    color: phoenixColors.primary,
    marginTop: 8,
  },
  infoCard: {
    marginTop: 24,
    marginBottom: 20,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  benefitText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitChip: {
    margin: 4,
    backgroundColor: phoenixColors.surface,
  },
  historyButton: {
    marginTop: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: phoenixColors.primary,
  },
  historyButtonContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  historyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  customizationHint: {
    marginTop: 16,
    fontStyle: 'italic',
    color: phoenixColors.accent1,
    textAlign: 'center',
  },
});

export default FastingTimerScreen;
