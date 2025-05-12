import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { phoenixTheme, phoenixColors } from '../../../constants/theme';

// Phoenix onboarding pages
import SplashPage from './SplashPage';
import FeatureHighlightsPage from './FeatureHighlightsPage';
import PersonalizationPage from './PersonalizationPage';
import UserStatsPage from './UserStatsPage';
import AccountCreationPage from './AccountCreationPage';
import FirstChallengePage from './FirstChallengePage';

const { width, height } = Dimensions.get('window');

// Define the phoenix onboarding pages
const phoenixOnboardingPages = [
  {
    id: '1',
    component: SplashPage,
  },
  {
    id: '2',
    component: FeatureHighlightsPage,
  },
  {
    id: '3',
    component: PersonalizationPage,
  },
  {
    id: '4',
    component: UserStatsPage,
  },
  {
    id: '5',
    component: AccountCreationPage,
  },
  {
    id: '6',
    component: FirstChallengePage,
  },
];

interface PhoenixOnboardingScreenProps {
  onComplete: () => void;
}

const PhoenixOnboardingScreen = ({ onComplete }: PhoenixOnboardingScreenProps) => {
  const theme = phoenixTheme;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Dots indicator with flame styling
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {phoenixOnboardingPages.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          // Add a subtle scale effect for the active dot
          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.3, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: phoenixColors.primary,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Handle next button press
  const handleNext = () => {
    if (currentIndex < phoenixOnboardingPages.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  // Handle skip button press
  const handleSkip = () => {
    completeOnboarding();
  };

  // Mark onboarding as completed
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  // Render each onboarding page
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const PageComponent = item.component;
    return (
      <View style={styles.pageContainer}>
        <PageComponent />
      </View>
    );
  };

  // Custom button styling based on phoenix theme
  const buttonStyle = (mode: 'text' | 'contained') => ({
    backgroundColor: mode === 'contained' ? phoenixColors.primary : 'transparent',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
  });

  const buttonTextStyle = (mode: 'text' | 'contained') => ({
    color: mode === 'contained' ? '#FFFFFF' : phoenixColors.primary,
    fontWeight: 'bold' as const,
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={phoenixOnboardingPages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
        scrollEnabled={true}
      />

      {renderDots()}

      <View style={styles.buttonsContainer}>
        {currentIndex < phoenixOnboardingPages.length - 1 ? (
          <>
            <Button 
              mode="text" 
              onPress={handleSkip}
              style={buttonStyle('text')}
              labelStyle={buttonTextStyle('text')}
            >
              Skip
            </Button>
            <Button 
              mode="contained" 
              onPress={handleNext}
              style={buttonStyle('contained')}
              labelStyle={buttonTextStyle('contained')}
            >
              Next
            </Button>
          </>
        ) : (
          <Button 
            mode="contained" 
            onPress={handleNext}
            style={[buttonStyle('contained'), styles.getStartedButton]}
            labelStyle={buttonTextStyle('contained')}
          >
            Get Started
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: phoenixColors.background, // Phoenix background color
  },
  pageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  getStartedButton: {
    flex: 1,
  },
});

export default PhoenixOnboardingScreen;
