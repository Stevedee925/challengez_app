import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface AnimatedBackgroundProps {
  animation?: 'morphing' | 'sun' | 'custom';
  customSource?: any;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'full';
  size?: number;
  loop?: boolean;
  speed?: number;
}

/**
 * Animated background component that can be added to any screen
 * for visual interest and engagement.
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  animation = 'morphing',
  customSource,
  opacity = 0.15,
  position = 'bottom-right',
  size = 250,
  loop = true,
  speed = 1,
}) => {
  // Determine which animation to use
  const getAnimationSource = () => {
    if (customSource) return customSource;
    
    switch (animation) {
      case 'sun':
        return require('../../assets/animations/simple_sun.json');
      case 'morphing':
      default:
        return require('../../assets/animations/morphing_shapes.json');
    }
  };

  // Determine position styling
  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return { top: -size / 4, left: -size / 4 };
      case 'top-right':
        return { top: -size / 4, right: -size / 4 };
      case 'bottom-left':
        return { bottom: -size / 4, left: -size / 4 };
      case 'bottom-right':
        return { bottom: -size / 4, right: -size / 4 };
      case 'center':
        return { alignSelf: 'center' as const, marginTop: 'auto' as const, marginBottom: 'auto' as const };
      case 'full':
        return { 
          position: 'absolute' as const, 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100%' as any, 
          height: '100%' as any,
          zIndex: -1 
        };
      default:
        return { bottom: -size / 4, right: -size / 4 };
    }
  };

  return (
    <View
      style={[
        styles.container,
        position === 'full' ? {} : { width: size, height: size },
        getPositionStyle(),
        { opacity }
      ]}
      pointerEvents="none"
    >
      <LottieView
        source={getAnimationSource()}
        autoPlay
        loop={loop}
        speed={speed}
        style={position === 'full' ? styles.fullAnimation : styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1,
    overflow: 'hidden',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  fullAnimation: {
    width: '120%',
    height: '120%',
    alignSelf: 'center',
  }
});

export default AnimatedBackground;
