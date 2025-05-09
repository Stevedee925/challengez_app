import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FirstChallengePage = () => {
  // State for transformation drivers
  const [drivers, setDrivers] = useState<string[]>([]);
  
  // Load transformation drivers from AsyncStorage
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const storedDrivers = await AsyncStorage.getItem('transformationDrivers');
        if (storedDrivers) {
          setDrivers(JSON.parse(storedDrivers));
        }
      } catch (error) {
        console.error('Error loading transformation drivers:', error);
      }
    };
    
    loadDrivers();
  }, []);

  // Get personalized challenge based on drivers
  const getPersonalizedChallenge = () => {
    // Default challenge if no drivers selected
    if (drivers.length === 0) {
      return {
        title: "7-Day Morning Ritual",
        description: "Start each day with intention. Commit to a 10-minute morning ritual for the next 7 days to set a positive tone for your transformation journey.",
        duration: "7 days",
        difficulty: "Beginner",
      };
    }
    
    // Check if health & fitness is a priority
    if (drivers.includes('health')) {
      return {
        title: "14-Day Intermittent Fasting",
        description: "Begin your health transformation with a 14-day intermittent fasting challenge. We'll guide you through a 16:8 fasting schedule to boost your metabolism and energy.",
        duration: "14 days",
        difficulty: "Intermediate",
      };
    }
    
    // Check if mindfulness is a priority
    if (drivers.includes('mindfulness')) {
      return {
        title: "21-Day Meditation Journey",
        description: "Cultivate inner peace with a 21-day meditation practice. Start with just 5 minutes daily and gradually build to 20 minutes of mindful awareness.",
        duration: "21 days",
        difficulty: "Beginner",
      };
    }
    
    // Check if personal growth is a priority
    if (drivers.includes('growth')) {
      return {
        title: "30-Day Journal Challenge",
        description: "Accelerate your personal growth with daily reflection. Write in your journal for 10 minutes each day, following our guided prompts for deeper self-discovery.",
        duration: "30 days",
        difficulty: "Beginner",
      };
    }
    
    // Check if skill mastery is a priority
    if (drivers.includes('skills')) {
      return {
        title: "Learn Something New",
        description: "Commit to learning a new skill by dedicating 20 minutes daily for the next 30 days. Track your progress and celebrate small wins along the way.",
        duration: "30 days",
        difficulty: "Intermediate",
      };
    }
    
    // Fallback challenge
    return {
      title: "7-Day Morning Ritual",
      description: "Start each day with intention. Commit to a 10-minute morning ritual for the next 7 days to set a positive tone for your transformation journey.",
      duration: "7 days",
      difficulty: "Beginner",
    };
  };

  const challenge = getPersonalizedChallenge();

  // Accept challenge
  const acceptChallenge = async () => {
    try {
      // In a real app, this would create the challenge in the user's account
      await AsyncStorage.setItem('firstChallengeAccepted', 'true');
      await AsyncStorage.setItem('currentChallenge', JSON.stringify(challenge));
      console.log('Challenge accepted');
    } catch (error) {
      console.error('Error accepting challenge:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={phoenixStyles.container}>
        <Text style={phoenixStyles.title}>The First Flame</Text>
        
        <Text style={[phoenixStyles.subtitle, { marginBottom: 20 }]}>
          Begin your transformation with this challenge
        </Text>

        {/* Challenge card */}
        <View style={phoenixStyles.challengeCard}>
          <Text style={phoenixStyles.challengeTitle}>{challenge.title}</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
              <IconButton icon="calendar" size={16} iconColor="#B22222" style={{ margin: 0 }} />
              <Text>{challenge.duration}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton icon="signal" size={16} iconColor="#B22222" style={{ margin: 0 }} />
              <Text>{challenge.difficulty}</Text>
            </View>
          </View>
          
          <Text style={phoenixStyles.challengeDescription}>
            {challenge.description}
          </Text>
          
          {/* Progress visualization */}
          <View style={phoenixStyles.progressContainer}>
            <View style={[phoenixStyles.progressBar, { width: '0%' }]} />
          </View>
          
          <Text style={{ textAlign: 'center', marginTop: 5, color: '#666' }}>
            0% Complete
          </Text>
        </View>

        {/* Accept challenge button */}
        <View style={[phoenixStyles.buttonContainer, { marginTop: 30 }]}>
          <TouchableOpacity
            style={phoenixStyles.button}
            onPress={acceptChallenge}
            activeOpacity={0.8}
          >
            <Text style={phoenixStyles.buttonText}>Accept Challenge</Text>
          </TouchableOpacity>
        </View>

        {/* Inspirational quote */}
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ fontStyle: 'italic', textAlign: 'center', color: '#666' }}>
            "From the ashes of old habits, the phoenix of transformation rises."
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FirstChallengePage;
