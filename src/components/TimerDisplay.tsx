import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { phoenixColors } from '../constants/theme';

interface TimerDisplayProps {
  elapsedTime: number;
  targetDuration: number;
  progress: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedTime,
  targetDuration,
  progress,
}) => {
  // Animation for pulse effect
  const pulseAnim = new Animated.Value(1);
  
  // Create pulse animation when timer is running
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(pulse).start();
    
    return () => {
      pulseAnim.setValue(1);
    };
  }, []);

  // Format time from milliseconds to HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate remaining time
  const remainingTime = Math.max(0, targetDuration - elapsedTime);
  
  // Calculate percentage
  const percentage = Math.min(Math.round(progress * 100), 100);
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 0.3) return phoenixColors.primary;
    if (progress < 0.7) return phoenixColors.secondary;
    return phoenixColors.secondary;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text style={styles.timeDisplay}>{formatTime(elapsedTime)}</Text>
      </Animated.View>
      
      <Text style={styles.remainingLabel}>Remaining</Text>
      <Text style={styles.remainingTime}>{formatTime(remainingTime)}</Text>
      
      <View style={styles.percentageContainer}>
        <Text style={[styles.percentage, { color: getProgressColor() }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: phoenixColors.text,
    marginBottom: 8,
  },
  remainingLabel: {
    fontSize: 14,
    color: phoenixColors.accent1,
    marginBottom: 2,
  },
  remainingTime: {
    fontSize: 18,
    fontWeight: '600',
    color: phoenixColors.text,
    marginBottom: 8,
  },
  percentageContainer: {
    marginTop: 4,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TimerDisplay;
