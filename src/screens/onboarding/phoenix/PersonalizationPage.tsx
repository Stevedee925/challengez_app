import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalizationPage = () => {
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Transformation driver options
  const options = [
    {
      id: 'health',
      title: 'Health & Fitness',
      icon: 'heart-pulse',
    },
    {
      id: 'growth',
      title: 'Personal Growth',
      icon: 'brain',
    },
    {
      id: 'skills',
      title: 'Skill Mastery',
      icon: 'school',
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      icon: 'meditation',
    },
  ];

  // Toggle option selection
  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });

    // Save selection to AsyncStorage
    saveSelections([...selectedOptions, optionId]);
  };

  // Save selections to AsyncStorage
  const saveSelections = async (selections: string[]) => {
    try {
      await AsyncStorage.setItem('transformationDrivers', JSON.stringify(selections));
    } catch (error) {
      console.error('Error saving transformation drivers:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={phoenixStyles.container}>
        <Text style={phoenixStyles.title}>Your Phoenix Path</Text>
        
        <Text style={[phoenixStyles.subtitle, { marginBottom: 10 }]}>
          What drives your transformation journey?
        </Text>
        
        <Text style={[phoenixStyles.description, { marginBottom: 30 }]}>
          Select the areas that matter most to you. We'll personalize your experience based on your choices.
        </Text>

        {/* Options grid */}
        <View style={phoenixStyles.optionContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                phoenixStyles.optionCard,
                selectedOptions.includes(option.id) && phoenixStyles.optionCardSelected,
              ]}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.7}
            >
              <View style={phoenixStyles.iconContainer}>
                <IconButton
                  icon={option.icon}
                  size={24}
                  iconColor="#B22222"
                />
              </View>
              <Text style={phoenixStyles.optionTitle}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selection feedback */}
        {selectedOptions.length > 0 && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#B22222', fontWeight: 'bold' }}>
              {selectedOptions.length} {selectedOptions.length === 1 ? 'area' : 'areas'} selected
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 5, color: '#666' }}>
              Your journey will be tailored to these focus areas
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PersonalizationPage;
