import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { phoenixColors } from '../constants/theme';

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  progress: number;
  size: number;
  strokeWidth: number;
  duration: number;
  children?: React.ReactNode;
  style?: ViewStyle;
  showAnimation?: boolean;
  colors?: {
    background?: string;
    progress?: string;
    progressEnd?: string;
  };
}

const CircularTimer: React.FC<CircularTimerProps> = ({
  progress,
  size,
  strokeWidth,
  duration = 500,
  children,
  style,
  showAnimation = true,
  colors = {},
}) => {
  // Default colors
  const backgroundColor = colors.background || phoenixColors.accent2;
  const progressColor = colors.progress || phoenixColors.primary;
  const progressEndColor = colors.progressEnd || phoenixColors.secondary;

  // Calculate radius and center point
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Animation values
  const animatedProgress = useSharedValue(0);
  
  // Update progress animation when progress changes
  useEffect(() => {
    if (showAnimation) {
      animatedProgress.value = withTiming(progress, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, duration, showAnimation]);

  // Interpolate color based on progress
  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      animatedProgress.value,
      [0, 1],
      [progressColor, progressEndColor]
    );
  });

  // Calculate the stroke dashoffset and color based on progress
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
      stroke: animatedColor.value,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      
      {/* Center content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default CircularTimer;
