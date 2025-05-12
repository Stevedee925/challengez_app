import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import { phoenixColors } from '../constants/theme';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import PhoenixOnboardingScreen from '../screens/onboarding/phoenix/PhoenixOnboardingScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import FastingTimerScreen from '../screens/FastingTimerScreen';
import FastingHistoryScreen from '../screens/FastingHistoryScreen';
import JournalScreen from '../screens/JournalScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import RitualsScreen from '../screens/RitualsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Landing page has been moved to a standalone HTML file

// Root navigator
const RootStack = createNativeStackNavigator();

// Stack navigators for tabs
const HomeStack = createNativeStackNavigator();
const FastingStack = createNativeStackNavigator();
const JournalStack = createNativeStackNavigator();
const ChallengesStack = createNativeStackNavigator();
const RitualsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Tab navigator
const Tab = createBottomTabNavigator();

// Stack navigators for each tab
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ 
          title: 'Dashboard',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </HomeStack.Navigator>
  );
};

const FastingStackNavigator = () => {
  return (
    <FastingStack.Navigator>
      <FastingStack.Screen 
        name="FastingTimerScreen" 
        component={FastingTimerScreen} 
        options={({ navigation }) => ({ 
          title: 'Fasting Timer',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <IconButton
              icon="history"
              onPress={() => navigation.navigate('FastingHistoryScreen')}
              iconColor={phoenixColors.primary}
            />
          ),
        })} 
      />
      <FastingStack.Screen 
        name="FastingHistoryScreen" 
        component={FastingHistoryScreen} 
        options={{ 
          title: 'Fasting History',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </FastingStack.Navigator>
  );
};

const JournalStackNavigator = () => {
  return (
    <JournalStack.Navigator>
      <JournalStack.Screen 
        name="JournalScreen" 
        component={JournalScreen} 
        options={{ 
          title: 'Journal',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </JournalStack.Navigator>
  );
};

const ChallengesStackNavigator = () => {
  return (
    <ChallengesStack.Navigator>
      <ChallengesStack.Screen 
        name="ChallengesScreen" 
        component={ChallengesScreen} 
        options={{ 
          title: 'Challenges',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </ChallengesStack.Navigator>
  );
};

const RitualsStackNavigator = () => {
  return (
    <RitualsStack.Navigator>
      <RitualsStack.Screen 
        name="RitualsScreen" 
        component={RitualsScreen} 
        options={{ 
          title: 'Rituals',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </RitualsStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </ProfileStack.Navigator>
  );
};

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'circle'; // Default icon

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Fasting') {
              iconName = 'timer';
            } else if (route.name === 'Journal') {
              iconName = 'book';
            } else if (route.name === 'Challenges') {
              iconName = 'trophy';
            } else if (route.name === 'Rituals') {
              iconName = 'repeat';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }

            return <IconButton icon={iconName} size={size} iconColor={color} />;
          },
          tabBarActiveTintColor: phoenixColors.primary,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Fasting" component={FastingStackNavigator} />
        <Tab.Screen name="Journal" component={JournalStackNavigator} />
        <Tab.Screen name="Challenges" component={ChallengesStackNavigator} />
        <Tab.Screen name="Rituals" component={RitualsStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
  );
};

// Main app navigator with onboarding check
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [showLanding, setShowLanding] = useState(false); // No longer showing landing page in the app

  useEffect(() => {
    // Check if onboarding has been completed
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingCompleted');
        setOnboardingCompleted(value === 'true');
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={phoenixColors.primary} />
      </View>
    );
  }


  // Default: onboarding logic
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <RootStack.Screen name="Onboarding">
          {props => <PhoenixOnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
        </RootStack.Screen>
      ) : (
        <RootStack.Screen name="MainApp" component={MainTabNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
