import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FastingPage = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name="timer" 
          size={80} 
          color={theme.colors.primary} 
        />
      </View>
      
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Intermittent Fasting Timer
      </Text>
      
      <Text style={styles.description}>
        Track your fasting periods with our easy-to-use timer. Choose from popular fasting protocols like 16:8, 18:6, or create your own custom schedule.
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Track fasting progress in real-time</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Multiple fasting protocols (16:8, 18:6, 20:4)</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>View your fasting history and statistics</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Get notified when your fast begins and ends</Text>
          </View>
        </Card.Content>
      </Card>
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
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  card: {
    width: '100%',
    marginTop: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FastingPage;
