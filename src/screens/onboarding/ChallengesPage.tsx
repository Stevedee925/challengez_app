import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChallengesPage = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name="trophy" 
          size={80} 
          color={theme.colors.primary} 
        />
      </View>
      
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Set Personal Challenges
      </Text>
      
      <Text style={styles.description}>
        Create and track personal challenges to build discipline and achieve your goals. Whether it's fitness, mindfulness, or productivity, set targets and monitor your progress.
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Create custom challenges with specific goals</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Track your progress with visual indicators</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Set duration and difficulty levels</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Celebrate achievements with completion badges</Text>
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.exampleContainer}>
        <Card style={[styles.exampleCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text style={styles.exampleTitle}>30-Day Meditation Challenge</Text>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    backgroundColor: theme.colors.primary,
                    width: '70%' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>21/30 days completed</Text>
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
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'right',
  },
});

export default ChallengesPage;
