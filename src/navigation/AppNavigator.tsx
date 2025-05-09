import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { defaultTheme } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FastingTimerScreen from '../screens/FastingTimerScreen';
import JournalScreen from '../screens/JournalScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import RitualsScreen from '../screens/RitualsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Stack navigators
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
        options={{ 
          title: 'Fasting Timer',
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

// Main app navigator
const AppNavigator = () => {
  return (
    <NavigationContainer theme={defaultTheme}>
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
          tabBarActiveTintColor: defaultTheme.colors.primary,
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
    </NavigationContainer>
  );
};

export default AppNavigator;
