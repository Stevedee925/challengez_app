import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const WelcomePage = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/icon.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Welcome to Challengez
      </Text>
      <Text style={styles.subtitle}>
        Your personal companion for self-improvement and wellness tracking
      </Text>
      <Text style={styles.description}>
        Track your fasting periods, journal your thoughts, set challenges, and establish daily rituals - all in one place.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default WelcomePage;
