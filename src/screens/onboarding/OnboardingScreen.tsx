import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding pages
import WelcomePage from './WelcomePage';
import FastingPage from './FastingPage';
import JournalPage from './JournalPage';
import ChallengesPage from './ChallengesPage';
import RitualsPage from './RitualsPage';

const { width, height } = Dimensions.get('window');

// Define the onboarding pages
const onboardingPages = [
  {
    id: '1',
    component: WelcomePage,
  },
  {
    id: '2',
    component: FastingPage,
  },
  {
    id: '3',
    component: JournalPage,
  },
  {
    id: '4',
    component: ChallengesPage,
  },
  {
    id: '5',
    component: RitualsPage,
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Dots indicator
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingPages.map((_, index) => {
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

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: theme.colors.primary,
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
    if (currentIndex < onboardingPages.length - 1) {
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

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingPages}
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
      />

      {renderDots()}

      <View style={styles.buttonsContainer}>
        {currentIndex < onboardingPages.length - 1 ? (
          <>
            <Button mode="text" onPress={handleSkip}>
              Skip
            </Button>
            <Button mode="contained" onPress={handleNext}>
              Next
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={handleNext} style={styles.getStartedButton}>
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
    backgroundColor: '#fff',
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

export default OnboardingScreen;
