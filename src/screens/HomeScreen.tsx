import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { dummyFastingSessions, dummyJournalEntries } from '../constants/dummyData';

const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const currentFastingSession = dummyFastingSessions.find(session => session.endTime === null);
  const recentJournalEntries = dummyJournalEntries.slice(0, 2);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hello, John!</Text>
      
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
