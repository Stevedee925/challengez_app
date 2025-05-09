import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ProgressBar, useTheme, Chip } from 'react-native-paper';
import { dummyFastingSessions } from '../constants/dummyData';
import { FastingSession } from '../types';

const FastingTimerScreen = () => {
  const theme = useTheme();
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(
    dummyFastingSessions.find(session => session.endTime === null) || null
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Predefined fasting durations in hours
  const fastingOptions = [
    { label: '16:8', hours: 16 },
    { label: '18:6', hours: 18 },
    { label: '20:4', hours: 20 },
    { label: '24', hours: 24 },
  ];

  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - currentSession.startTime;
      setElapsedTime(elapsed);
      setProgress(Math.min(elapsed / currentSession.targetDuration, 1));
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

  const startFast = (hours: number) => {
    const newSession: FastingSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      endTime: null,
      targetDuration: hours * 60 * 60 * 1000,
      isCompleted: false,
    };
    setCurrentSession(newSession);
  };

  const endFast = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: Date.now(),
        isCompleted: true,
      };
      // In a real app, we would save this to storage
      setCurrentSession(null);
    }
  };

  return (
    <View style={styles.container}>
      {currentSession ? (
        <View style={styles.timerContainer}>
          <Text style={styles.timerTitle}>Current Fast</Text>
          
          <View style={styles.timerDisplay}>
            <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.targetTime}>
              Target: {formatTime(currentSession.targetDuration)}
            </Text>
          </View>
          
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          
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
            
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
          
          <Button 
            mode="contained" 
            onPress={endFast}
            style={styles.endButton}
          >
            End Fast
          </Button>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Start a New Fast</Text>
          <Text style={styles.startSubtitle}>Select your fasting duration:</Text>
          
          <View style={styles.optionsContainer}>
            {fastingOptions.map((option) => (
              <Button
                key={option.label}
                mode="outlined"
                onPress={() => startFast(option.hours)}
                style={styles.optionButton}
              >
                {option.label} hours
              </Button>
            ))}
          </View>
          
          <Card style={styles.infoCard}>
            <Card.Title title="Fasting Benefits" />
            <Card.Content>
              <Text variant="bodyMedium">
                Intermittent fasting can help with weight management, improve metabolic health, 
                enhance cellular repair processes, and may provide other health benefits.
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  targetTime: {
    fontSize: 16,
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  endButton: {
    width: '80%',
  },
  startContainer: {
    flex: 1,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionButton: {
    marginBottom: 12,
    width: '48%',
  },
  infoCard: {
    marginTop: 20,
  },
});

export default FastingTimerScreen;
