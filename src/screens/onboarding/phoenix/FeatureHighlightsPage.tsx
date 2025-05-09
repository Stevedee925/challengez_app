import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixStyles } from './styles';

const FeatureHighlightsPage = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeFeature, setActiveFeature] = useState(0);

  // Features data
  const features = [
    {
      id: 1,
      title: 'Fasting Timer',
      icon: 'timer-outline',
      description: 'Track your fasting periods with precision. Set goals, monitor progress, and receive notifications when your fasting window begins and ends.',
    },
    {
      id: 2,
      title: 'Daily Journal',
      icon: 'book-open-variant',
      description: 'Record your thoughts, track your mood, and document your transformation journey with our intuitive journaling system.',
    },
    {
      id: 3,
      title: 'Challenges & Rituals',
      icon: 'fire',
      description: 'Create personal challenges to push your boundaries and establish daily rituals to build lasting habits that transform your life.',
    },
  ];

  useEffect(() => {
    // Fade in the content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle feature change
  const changeFeature = (index: number) => {
    // Reset animation
    fadeAnim.setValue(0);
    
    // Change active feature
    setActiveFeature(index);
    
    // Fade in new feature
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={phoenixStyles.container}>
      <Text style={phoenixStyles.title}>Embers of Possibility</Text>
      
      <Text style={[phoenixStyles.subtitle, { marginBottom: 30 }]}>
        Discover the tools to fuel your transformation
      </Text>

      {/* Feature display */}
      <Animated.View 
        style={[
          phoenixStyles.featureCard, 
          { opacity: fadeAnim, marginBottom: 30 }
        ]}
      >
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <View style={phoenixStyles.iconContainer}>
            <IconButton
              icon={features[activeFeature].icon}
              size={30}
              iconColor="#B22222"
            />
          </View>
        </View>
        
        <Text style={phoenixStyles.featureTitle}>
          {features[activeFeature].title}
        </Text>
        
        <Text style={phoenixStyles.featureDescription}>
          {features[activeFeature].description}
        </Text>
      </Animated.View>

      {/* Feature navigation dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {features.map((_, index) => (
          <IconButton
            key={index}
            icon={index === activeFeature ? 'circle' : 'circle-outline'}
            size={12}
            iconColor="#B22222"
            onPress={() => changeFeature(index)}
            style={{ margin: 0 }}
          />
        ))}
      </View>

      {/* Feature navigation arrows */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
        <IconButton
          icon="chevron-left"
          size={30}
          iconColor="#B22222"
          onPress={() => changeFeature(activeFeature > 0 ? activeFeature - 1 : features.length - 1)}
          style={{ opacity: activeFeature > 0 ? 1 : 0.3 }}
        />
        
        <IconButton
          icon="chevron-right"
          size={30}
          iconColor="#B22222"
          onPress={() => changeFeature(activeFeature < features.length - 1 ? activeFeature + 1 : 0)}
          style={{ opacity: activeFeature < features.length - 1 ? 1 : 0.3 }}
        />
      </View>
    </View>
  );
};

export default FeatureHighlightsPage;
