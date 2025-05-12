import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixColors } from '../constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface TimerDisplayProps {
  elapsedTime: number;
  targetDuration: number;
  progress: number;
  showFastingState?: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedTime,
  targetDuration,
  progress,
  showFastingState = true,
}) => {
  // Animation for pulse effect
  const pulseAnim = useSharedValue(1);
  
  // Create pulse animation when timer is running
  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    
    return () => {
      pulseAnim.value = 1;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

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

  // Determine fasting state based on progress
  const getFastingState = () => {
    if (progress < 0.5) return "Time Since Last Fast";
    return "Fat Burning";
  };

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.timeDisplay}>{formatTime(elapsedTime)}</Text>
      </Animated.View>
      
      {showFastingState && (
        <View style={styles.fastingStateContainer}>
          {progress >= 0.5 && (
            <IconButton
              icon="fire"
              size={16}
              iconColor={phoenixColors.secondary}
              style={styles.fireIcon}
            />
          )}
          <Text style={styles.fastingState}>{getFastingState()}</Text>
        </View>
      )}
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={styles.detailValue}>{formatTime(remainingTime)}</Text>
        </View>
        
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Progress</Text>
          <Text style={[styles.detailValue, { color: getProgressColor() }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timeDisplay: {
    fontSize: 40,
    fontWeight: 'bold',
    color: phoenixColors.text,
    marginBottom: 8,
    letterSpacing: 1,
  },
  fastingStateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  fastingState: {
    fontSize: 16,
    fontWeight: '600',
    color: phoenixColors.secondary,
  },
  fireIcon: {
    margin: 0,
    marginRight: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8,
  },
  detailColumn: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: phoenixColors.accent1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: phoenixColors.text,
  },
});

export default TimerDisplay;
