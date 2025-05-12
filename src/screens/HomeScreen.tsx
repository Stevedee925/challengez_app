import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Avatar } from 'react-native-paper';
import AnimatedBackground from '../components/AnimatedBackground';
import { phoenixTheme, phoenixColors } from '../constants/theme';
import { dummyFastingSessions, dummyJournalEntries } from '../constants/dummyData';

const HomeScreen = ({ navigation }: any) => {
  const theme = phoenixTheme;
  const currentFastingSession = dummyFastingSessions.find(session => session.endTime === null);
  const recentJournalEntries = dummyJournalEntries.slice(0, 2);

  return (
    <View style={styles.containerWrapper}>
      <AnimatedBackground position="top-right" animation="morphing" opacity={0.1} />
      <ScrollView style={styles.container}>
      <View style={styles.greetingContainer}>
        <Avatar.Text size={50} label="J" style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>Hello, John!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
      </View>
      
      {/* Current Fasting Status */}
      <Card style={styles.card}>
        <Card.Title title="Current Fast" />
        <Card.Content>
          {currentFastingSession ? (
            <>
              <Text variant="bodyLarge">
                You're currently {Math.floor((Date.now() - currentFastingSession.startTime) / (1000 * 60 * 60))} hours 
                into your {Math.floor(currentFastingSession.targetDuration / (1000 * 60 * 60))} hour fast
              </Text>
              <Text variant="bodyMedium">
                Started: {new Date(currentFastingSession.startTime).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text variant="bodyLarge">You're not currently fasting</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Fasting')}>
            {currentFastingSession ? 'View Fast' : 'Start Fast'}
          </Button>
        </Card.Actions>
      </Card>

      {/* Recent Journal Entries */}
      <Card style={styles.card}>
        <Card.Title title="Recent Journal Entries" />
        <Card.Content>
          {recentJournalEntries.length > 0 ? (
            recentJournalEntries.map(entry => (
              <View key={entry.id} style={styles.journalEntry}>
                <Text variant="titleMedium">{entry.title}</Text>
                <Text variant="bodyMedium" numberOfLines={2}>
                  {entry.content}
                </Text>
                <Text variant="bodySmall">
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text variant="bodyLarge">No recent journal entries</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('Journal')}>View All</Button>
          <Button onPress={() => navigation.navigate('Journal', { action: 'create' })}>
            New Entry
          </Button>
        </Card.Actions>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Title title="Quick Actions" />
        <Card.Content style={styles.quickActions}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Challenges')}
            style={styles.actionButton}
          >
            Challenges
          </Button>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Rituals')}
            style={styles.actionButton}
          >
            Rituals
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
      <AnimatedBackground position="bottom-left" animation="morphing" opacity={0.08} size={200} speed={0.5} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: phoenixColors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: phoenixColors.primary,
  },
  date: {
    opacity: 0.6,
    fontSize: 14,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  card: {
    marginBottom: 16,
  },
  journalEntry: {
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    marginHorizontal: 8,
  },
});

export default HomeScreen;
