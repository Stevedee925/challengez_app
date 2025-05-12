import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
  useDerivedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { phoenixColors } from '../constants/theme';

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircularTimerProps {
  progress: number;
  size: number;
  strokeWidth: number;
  duration: number;
  children?: React.ReactNode;
  style?: ViewStyle;
  showAnimation?: boolean;
  showPulse?: boolean;
  statusText?: string;
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
  showPulse = false,
  statusText,
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
  const pulseAnim = useSharedValue(1);
  
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

  // Pulse animation for the outer glow
  useEffect(() => {
    if (showPulse) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      pulseAnim.value = 1;
    }
  }, [showPulse]);

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

  // Animated scale for pulse effect
  const animatedScale = useDerivedValue(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  // Generate lightning bolt markers if needed
  const renderLightningMarkers = () => {
    if (!showPulse) return null;
    
    // Create lightning bolt markers at specific points around the circle
    const markers = [];
    const numMarkers = 2;
    
    for (let i = 0; i < numMarkers; i++) {
      const angle = (i * 180) * (Math.PI / 180); // Convert to radians, space evenly
      const x = center + (radius + 10) * Math.cos(angle);
      const y = center + (radius + 10) * Math.sin(angle);
      
      markers.push(
        <Path
          key={`lightning-${i}`}
          d="M3,0 L0,4 L2,4 L-1,8 L4,3 L2,3 L3,0 Z" // Simple lightning bolt shape
          fill={phoenixColors.secondary}
          transform={`translate(${x - 2}, ${y - 4}) scale(1.2)`}
        />
      );
    }
    
    return markers;
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[styles.pulseContainer, animatedScale]}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={progressColor} />
              <Stop offset="100%" stopColor={progressEndColor} />
            </LinearGradient>
          </Defs>
          
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeOpacity={0.6}
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
            
            {/* Lightning bolt markers */}
            {renderLightningMarkers()}
          </G>
        </Svg>
      </Animated.View>
      
      {/* Center content */}
      <View style={styles.content}>
        {children}
      </View>
      
      {/* Status text at the bottom of the circle */}
      {statusText && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  statusContainer: {
    position: 'absolute',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: phoenixColors.secondary,
  },
});

export default CircularTimer;
