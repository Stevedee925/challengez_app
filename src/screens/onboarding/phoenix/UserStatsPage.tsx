import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, SegmentedButtons, Chip } from 'react-native-paper';
import { phoenixStyles } from './styles';
import { User } from '../../../types';
import * as Storage from '../../../utils/storage';

const UserStatsPage = () => {
  // Form state
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [fitnessLevel, setFitnessLevel] = useState<string>('beginner');
  const [weeklyActivityLevel, setWeeklyActivityLevel] = useState<string>('3');
  const [goals, setGoals] = useState<string[]>([]);
  
  // Handle adding/removing goals
  const toggleGoal = (goal: string) => {
    setGoals(prevGoals => {
      if (prevGoals.includes(goal)) {
        return prevGoals.filter(g => g !== goal);
      } else {
        return [...prevGoals, goal];
      }
    });
    
    // Save selections to storage
    saveUserStats();
  };
  
  // Load existing user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await Storage.getUserData();
        if (userData && userData.stats) {
          // Populate form with existing data if available
          setAge(userData.stats.age?.toString() || '');
          setWeight(userData.stats.weight?.toString() || '');
          setHeight(userData.stats.height?.toString() || '');
          setFitnessLevel(userData.stats.fitnessLevel || 'beginner');
          setWeeklyActivityLevel(userData.stats.weeklyActivityLevel?.toString() || '3');
          setGoals(userData.stats.goals || []);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  // Save user stats to storage
  const saveUserStats = async () => {
    try {
      // Parse numeric values
      const parsedAge = age ? parseInt(age, 10) : undefined;
      const parsedWeight = weight ? parseFloat(weight) : undefined;
      const parsedHeight = height ? parseFloat(height) : undefined;
      const parsedActivityLevel = weeklyActivityLevel ? parseInt(weeklyActivityLevel, 10) : undefined;
      
      // Get existing user data if available
      const userData = await Storage.getUserData();
      
      if (userData) {
        // Update existing user data with new stats
        userData.stats = {
          age: parsedAge,
          weight: parsedWeight,
          height: parsedHeight,
          fitnessLevel: fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
          goals,
          weeklyActivityLevel: parsedActivityLevel,
        };
        
        // Save updated user data
        await Storage.saveUserData(userData);
      } else {
        // Create new user data with default values and stats
        const newUserData: User = {
          id: '1', // Default ID, would be replaced with real ID in a production app
          name: 'New User',
          email: 'user@example.com',
          stats: {
            age: parsedAge,
            weight: parsedWeight,
            height: parsedHeight,
            fitnessLevel: fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
            goals,
            weeklyActivityLevel: parsedActivityLevel,
          }
        };
        
        // Save new user data
        await Storage.saveUserData(newUserData);
      }
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={phoenixStyles.container}>
        <Text style={phoenixStyles.title}>Your Fitness Profile</Text>
        
        <Text style={[phoenixStyles.subtitle, { marginBottom: 10 }]}>
          Let's personalize your experience
        </Text>
        
        <Text style={[phoenixStyles.description, { marginBottom: 30 }]}>
          Share some details about yourself to help us tailor your journey. This information helps us provide personalized recommendations.
        </Text>

        {/* Basic Stats Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  saveUserStats();
                }}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Years"
                mode="outlined"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                value={weight}
                onChangeText={(text) => {
                  setWeight(text);
                  saveUserStats();
                }}
                keyboardType="numeric"
                style={styles.input}
                placeholder="kg"
                mode="outlined"
                right={<TextInput.Affix text="kg" />}
              />
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                value={height}
                onChangeText={(text) => {
                  setHeight(text);
                  saveUserStats();
                }}
                keyboardType="numeric"
                style={styles.input}
                placeholder="cm"
                mode="outlined"
                right={<TextInput.Affix text="cm" />}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weekly Activity</Text>
              <TextInput
                value={weeklyActivityLevel}
                onChangeText={(text) => {
                  setWeeklyActivityLevel(text);
                  saveUserStats();
                }}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Days per week"
                mode="outlined"
                right={<TextInput.Affix text="days" />}
              />
            </View>
          </View>
          
          <Text style={styles.sectionLabel}>Fitness Level</Text>
          <SegmentedButtons
            value={fitnessLevel}
            onValueChange={(value) => {
              setFitnessLevel(value);
              saveUserStats();
            }}
            buttons={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.sectionLabel}>Your Goals</Text>
          <Text style={styles.helperText}>Select all that apply</Text>
          <View style={styles.goalsContainer}>
            {['Weight loss', 'Muscle gain', 'Better sleep', 'More energy', 'Stress reduction'].map((goal) => (
              <Chip
                key={goal}
                selected={goals.includes(goal)}
                onPress={() => toggleGoal(goal)}
                style={styles.goalChip}
                showSelectedCheck={true}
                mode="outlined"
              >
                {goal}
              </Chip>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 16,
  },
  inputContainer: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#4B4B4B',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginTop: 24,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  goalsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginBottom: 16,
  },
  goalChip: {
    margin: 4,
  },
});

export default UserStatsPage;
