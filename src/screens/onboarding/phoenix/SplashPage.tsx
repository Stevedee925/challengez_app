import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { phoenixStyles } from './styles';
import LottieView from 'lottie-react-native';

const SplashPage = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence the animations
    Animated.sequence([
      // First fade in and scale up the phoenix
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Then fade in the title
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Finally fade in the subtitle
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={phoenixStyles.container}>
      {/* Phoenix Lottie animation */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#F9A825',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      </Animated.View>

      <Animated.Text
        style={[
          phoenixStyles.title,
          {
            opacity: titleOpacity,
          },
        ]}
      >
        Welcome to Challengez
      </Animated.Text>

      <Animated.Text
        style={[
          phoenixStyles.subtitle,
          {
            opacity: subtitleOpacity,
          },
        ]}
      >
        Ignite Your Inner Fire
      </Animated.Text>

      <Animated.Text
        style={[
          phoenixStyles.description,
          {
            opacity: subtitleOpacity,
            marginTop: 20,
          },
        ]}
      >
        Transform your habits, rise from the ashes of old patterns, and embrace a new beginning.
      </Animated.Text>
    </View>
  );
};

export default SplashPage;
