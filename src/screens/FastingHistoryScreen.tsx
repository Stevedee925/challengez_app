import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Divider, IconButton, useTheme } from 'react-native-paper';
import * as Storage from '../utils/storage';
import { FastingSession } from '../types';

const FastingHistoryScreen = () => {
  const theme = useTheme();
  const [sessions, setSessions] = useState<FastingSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load fasting sessions when component mounts
  useEffect(() => {
    loadSessions();
  }, []);

  // Load all fasting sessions from storage
  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const allSessions = await Storage.getAllFastingSessions();
      
      // Sort sessions by start time (newest first)
      const sortedSessions = allSessions.sort((a, b) => b.startTime - a.startTime);
      
      setSessions(sortedSessions);
      console.log(`Loaded ${sortedSessions.length} fasting sessions`);
    } catch (error) {
      console.error('Error loading fasting sessions:', error);
      Alert.alert('Error', 'Failed to load fasting history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a fasting session
  const deleteSession = async (sessionId: string) => {
    try {
      await Storage.deleteFastingSession(sessionId);
      
      // Update the sessions list
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
      
      console.log('Deleted fasting session:', sessionId);
    } catch (error) {
      console.error('Error deleting fasting session:', error);
      Alert.alert('Error', 'Failed to delete fasting session. Please try again.');
    }
  };

  // Confirm deletion of a session
  const confirmDelete = (session: FastingSession) => {
    Alert.alert(
      'Delete Fasting Session',
      'Are you sure you want to delete this fasting session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteSession(session.id),
          style: 'destructive'
        }
      ]
    );
  };

  // Format duration in hours and minutes
  const formatDuration = (durationMs: number) => {
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Calculate actual duration of a session
  const calculateActualDuration = (session: FastingSession) => {
    const endTime = session.endTime || Date.now();
    return endTime - session.startTime;
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Render a fasting session item
  const renderSessionItem = ({ item }: { item: FastingSession }) => {
    const actualDuration = calculateActualDuration(item);
    const isCompleted = item.isCompleted;
    const isActive = item.endTime === null;
    
    return (
      <Card style={styles.sessionCard}>
        <Card.Content>
          <View style={styles.sessionHeader}>
            <View>
              <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
              {isActive ? (
                <Text style={[styles.sessionStatus, { color: theme.colors.primary }]}>
                  Active
                </Text>
              ) : (
                <Text 
                  style={[
                    styles.sessionStatus, 
                    { color: isCompleted ? theme.colors.primary : theme.colors.error }
                  ]}
                >
                  {isCompleted ? 'Completed' : 'Ended Early'}
                </Text>
              )}
            </View>
            
            <IconButton
              icon="delete"
              size={20}
              onPress={() => confirmDelete(item)}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.sessionDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Target</Text>
              <Text style={styles.detailValue}>{formatDuration(item.targetDuration)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Actual</Text>
              <Text style={styles.detailValue}>{formatDuration(actualDuration)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Start</Text>
              <Text style={styles.detailValue}>
                {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>End</Text>
              <Text style={styles.detailValue}>
                {item.endTime 
                  ? new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'In Progress'}
              </Text>
            </View>
          </View>
          
          {!isActive && (
            <View style={styles.completionContainer}>
              <Text style={styles.completionLabel}>Completion Rate:</Text>
              <Text 
                style={[
                  styles.completionValue,
                  { color: isCompleted ? theme.colors.primary : theme.colors.error }
                ]}
              >
                {Math.round((actualDuration / item.targetDuration) * 100)}%
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        completionRate: 0,
        averageDuration: 0,
        longestFast: 0,
      };
    }
    
    const completedSessions = sessions.filter(session => session.isCompleted).length;
    const totalSessions = sessions.filter(session => session.endTime !== null).length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    const durations = sessions
      .filter(session => session.endTime !== null)
      .map(session => session.endTime! - session.startTime);
    
    const averageDuration = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0;
    
    const longestFast = durations.length > 0 
      ? Math.max(...durations) 
      : 0;
    
    return {
      totalSessions,
      completedSessions,
      completionRate,
      averageDuration,
      longestFast,
    };
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fasting History</Text>
      
      {/* Statistics Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.statsTitle}>Your Fasting Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Fasts</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedSessions}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.completionRate)}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Duration</Text>
              <Text style={styles.statValue}>{formatDuration(stats.averageDuration)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Longest Fast</Text>
              <Text style={styles.statValue}>{formatDuration(stats.longestFast)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Sessions List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading fasting history...</Text>
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No fasting sessions yet</Text>
          <Text style={styles.emptySubtext}>
            Start a fast to begin tracking your progress
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: 16,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionStatus: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 8,
  },
  sessionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  completionLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  completionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FastingHistoryScreen;
