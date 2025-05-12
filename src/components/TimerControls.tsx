import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Text, IconButton, TextInput, Button } from 'react-native-paper';
import { phoenixColors } from '../constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

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
  const [customHours, setCustomHours] = useState<string>('16');
  const [customMinutes, setCustomMinutes] = useState<string>('0');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  // Animation for button press
  const animatedScale = useSharedValue(1);
  
  const handlePressIn = () => {
    animatedScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };
  
  const handlePressOut = () => {
    animatedScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }],
    };
  });

  const handleStartCustomFast = () => {
    const hours = parseFloat(customHours) || 0;
    const minutes = parseFloat(customMinutes) || 0;
    const totalHours = hours + (minutes / 60);
    
    if (totalHours <= 0) {
      return; // Don't start if duration is invalid
    }
    
    onStart(totalHours);
  };

  return (
    <View style={styles.container}>
      {isRunning ? (
        // End button when timer is running
        <Animated.View style={[styles.endButtonContainer, animatedStyle]}>
          <TouchableOpacity
            style={styles.endButton}
            onPress={onEnd}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <IconButton
              icon="stop-circle"
              size={24}
              iconColor="#fff"
              style={styles.endIcon}
            />
            <Text style={styles.endButtonText}>End Fast</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        // Start options when timer is not running
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Start a New Fast</Text>
          
          {showCustomInput ? (
            <View style={styles.customInputContainer}>
              <Text style={styles.suggestionsLabel}>Custom Duration</Text>
              <View style={styles.timeInputContainer}>
                <View style={styles.timeInputGroup}>
                  <TextInput
                    label="Hours"
                    value={customHours}
                    onChangeText={text => setCustomHours(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.timeInput}
                    mode="outlined"
                    maxLength={2}
                  />
                  <Text style={styles.timeLabel}>hrs</Text>
                </View>
                <View style={styles.timeInputGroup}>
                  <TextInput
                    label="Minutes"
                    value={customMinutes}
                    onChangeText={text => setCustomMinutes(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.timeInput}
                    mode="outlined"
                    maxLength={2}
                  />
                  <Text style={styles.timeLabel}>min</Text>
                </View>
              </View>
              
              <View style={styles.customButtonsContainer}>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowCustomInput(false)}
                  style={styles.customButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleStartCustomFast}
                  style={styles.customButton}
                  disabled={!customHours && !customMinutes}
                >
                  Start Fast
                </Button>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.suggestionsLabel}>Suggested Durations</Text>
              <View style={styles.optionsContainer}>
                {fastingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.optionButton}
                    onPress={() => onStart(option.hours)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{option.label} hours</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={styles.customDurationButton}
                onPress={() => setShowCustomInput(true)}
                activeOpacity={0.7}
              >
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={phoenixColors.primary}
                  style={styles.customDurationIcon}
                />
                <Text style={styles.customDurationText}>Custom Duration</Text>
              </TouchableOpacity>
              
              <View style={styles.quickStartContainer}>
                <TouchableOpacity
                  style={styles.quickStartButton}
                  onPress={() => onStart(16)}
                  activeOpacity={0.7}
                >
                  <IconButton
                    icon="play-circle"
                    size={24}
                    iconColor={phoenixColors.primary}
                    style={styles.quickStartIcon}
                  />
                  <Text style={styles.quickStartText}>Quick Start (16:8)</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    width: '100%',
  },
  endButtonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: phoenixColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  endIcon: {
    margin: 0,
    marginRight: 8,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: phoenixColors.text,
  },
  suggestionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: phoenixColors.accent1,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
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
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    margin: 8,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    color: phoenixColors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  customDurationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: phoenixColors.accent2,
    borderStyle: 'dashed',
  },
  customDurationIcon: {
    margin: 0,
    marginRight: 4,
  },
  customDurationText: {
    color: phoenixColors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  customInputContainer: {
    width: '90%',
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: phoenixColors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  timeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  timeInput: {
    flex: 1,
    backgroundColor: phoenixColors.surface,
  },
  timeLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: phoenixColors.accent1,
  },
  customButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  customButton: {
    width: '48%',
  },
  quickStartContainer: {
    marginTop: 24,
    width: '80%',
  },
  quickStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: phoenixColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: phoenixColors.accent2,
  },
  quickStartIcon: {
    margin: 0,
    marginRight: 8,
  },
  quickStartText: {
    color: phoenixColors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TimerControls;
