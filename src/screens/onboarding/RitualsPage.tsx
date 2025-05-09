import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RitualsPage = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name="calendar-check" 
          size={80} 
          color={theme.colors.primary} 
        />
      </View>
      
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Build Daily Rituals
      </Text>
      
      <Text style={styles.description}>
        Create consistent daily routines to build lasting habits. Schedule your rituals, track your adherence, and transform your lifestyle one day at a time.
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Schedule rituals for specific times</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Choose which days to perform each ritual</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Track your daily progress and adherence</Text>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.featureText}>Build consistency with visual progress indicators</Text>
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.exampleContainer}>
        <Card style={[styles.exampleCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text style={styles.exampleTitle}>Morning Meditation</Text>
            <Text style={styles.exampleTime}>06:30 AM</Text>
            <View style={styles.daysContainer}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <View key={day} style={[styles.dayCircle, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.dayText}>{day.charAt(0)}</Text>
                </View>
              ))}
              {['Sat', 'Sun'].map(day => (
                <View key={day} style={[styles.dayCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text style={styles.dayText}>{day.charAt(0)}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.adherenceText}>85% adherence</Text>
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
    marginBottom: 4,
  },
  exampleTime: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  adherenceText: {
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.8,
    marginTop: 4,
  },
});

export default RitualsPage;
