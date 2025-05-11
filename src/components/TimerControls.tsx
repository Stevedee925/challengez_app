import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixColors } from '../constants/theme';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: (hours: number) => void;
  onEnd: () => void;
  fastingOptions: Array<{ label: string; hours: number }>;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onEnd,
  fastingOptions,
}) => {
  // Animation for button press
  const animatedScale = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {isRunning ? (
        // End button when timer is running
        <Animated.View
          style={[
            styles.endButtonContainer,
            { transform: [{ scale: animatedScale }] }
          ]}
        >
          <TouchableOpacity
            style={styles.endButton}
            onPress={onEnd}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.endButtonText}>End Fast</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        // Start options when timer is not running
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Start a New Fast</Text>
          <View style={styles.optionsContainer}>
            {fastingOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={styles.optionButton}
                onPress={() => onStart(option.hours)}
              >
                <Text style={styles.optionText}>{option.label} hours</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  endButtonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: phoenixColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: phoenixColors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  optionButton: {
    backgroundColor: phoenixColors.surface,
    borderWidth: 2,
    borderColor: phoenixColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 6,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    color: phoenixColors.primary,
    fontWeight: '600',
  },
});

export default TimerControls;
