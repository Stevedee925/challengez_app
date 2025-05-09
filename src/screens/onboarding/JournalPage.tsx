import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JournalPage = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name="book" 
          size={80} 
          color={theme.colors.primary} 
        />
      </View>
      
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Journal Your Journey
      </Text>
      
      <Text style={styles.description}>
        Document your thoughts, feelings, and experiences throughout your wellness journey. Track your moods and identify patterns to improve your well-being.
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Create daily journal entries</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Track your mood and emotions</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Add tags to organize your entries</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Review past entries to see your progress</Text>
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.exampleContainer}>
        <Card style={styles.exampleCard}>
          <Card.Content>
            <Text style={styles.exampleDate}>Today</Text>
            <Text style={styles.exampleTitle}>Feeling energized</Text>
            <Text style={styles.exampleContent} numberOfLines={2}>
              My fast went well today. I'm noticing more energy in the afternoons and better focus...
            </Text>
          </Card.Content>
        </Card>
      </View>
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
    marginBottom: 20,
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
  exampleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  exampleCard: {
    width: '90%',
    marginTop: 10,
  },
  exampleDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  exampleContent: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default JournalPage;
