import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  FAB, 
  TextInput, 
  ProgressBar, 
  Dialog, 
  Portal,
  Checkbox,
  Divider,
  IconButton,
  SegmentedButtons
} from 'react-native-paper';
import { dummyChallenges } from '../constants/dummyData';
import { Challenge, ChallengeProgress } from '../types';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(dummyChallenges);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [duration, setDuration] = useState<string>('30'); // in days
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setDuration('30');
  };

  const handleCreateChallenge = () => {
    if (!title || !description) return;

    const now = Date.now();
    const durationInDays = parseInt(duration, 10) || 30;
    const endDate = now + (durationInDays * 24 * 60 * 60 * 1000);

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title,
      description,
      frequency,
      startDate: now,
      endDate,
      progress: [],
    };

    setChallenges([...challenges, newChallenge]);
    setIsCreating(false);
    resetForm();
  };

  const toggleChallengeProgress = (challenge: Challenge, date: number) => {
    const existingProgressIndex = challenge.progress.findIndex(p => 
      new Date(p.date).toDateString() === new Date(date).toDateString()
    );

    let updatedProgress: ChallengeProgress[];

    if (existingProgressIndex >= 0) {
      // Toggle existing progress
      updatedProgress = [...challenge.progress];
      updatedProgress[existingProgressIndex] = {
        ...updatedProgress[existingProgressIndex],
        isCompleted: !updatedProgress[existingProgressIndex].isCompleted
      };
    } else {
      // Add new progress
      updatedProgress = [
        ...challenge.progress,
        { date, isCompleted: true }
      ];
    }

    const updatedChallenge = {
      ...challenge,
      progress: updatedProgress
    };

    setChallenges(challenges.map(c => 
      c.id === challenge.id ? updatedChallenge : c
    ));
  };

  const calculateProgress = (challenge: Challenge) => {
    if (!challenge.progress.length) return 0;
    
    const completedDays = challenge.progress.filter(p => p.isCompleted).length;
    const totalDays = challenge.progress.length;
    
    return completedDays / totalDays;
  };

  const getDaysRemaining = (challenge: Challenge) => {
    if (!challenge.endDate) return 'Ongoing';
    
    const now = Date.now();
    const endDate = challenge.endDate;
    const daysRemaining = Math.ceil((endDate - now) / (24 * 60 * 60 * 1000));
    
    return daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Completed';
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <Card style={styles.challengeCard} onPress={() => setViewingChallenge(item)}>
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <Text variant="bodySmall" style={styles.progressText}>
            Progress: {Math.round(calculateProgress(item) * 100)}%
          </Text>
          <ProgressBar 
            progress={calculateProgress(item)} 
            style={styles.progressBar} 
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text variant="bodySmall">
            {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
          </Text>
          <Text variant="bodySmall">
            {getDaysRemaining(item)}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setViewingChallenge(item)}>View Details</Button>
      </Card.Actions>
    </Card>
  );

  const renderDateCheckboxes = (challenge: Challenge) => {
    const dates = [];
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Show last 7 days for tracking
    for (let i = 6; i >= 0; i--) {
      const date = now - (i * dayInMs);
      const dateString = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      const isCompleted = challenge.progress.some(p => 
        new Date(p.date).toDateString() === new Date(date).toDateString() && p.isCompleted
      );
      
      dates.push(
        <View key={date} style={styles.checkboxRow}>
          <Text>{dateString}</Text>
          <Checkbox
            status={isCompleted ? 'checked' : 'unchecked'}
            onPress={() => toggleChallengeProgress(challenge, date)}
          />
        </View>
      );
    }
    
    return dates;
  };

  if (isCreating) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>Create New Challenge</Text>
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        
        <Text style={styles.sectionTitle}>Frequency</Text>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value as 'daily' | 'weekly' | 'monthly')}
          buttons={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ]}
          style={styles.segmentedButtons}
        />
        
        <TextInput
          label="Duration (days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => {
              setIsCreating(false);
              resetForm();
            }}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleCreateChallenge}
            style={styles.button}
            disabled={!title || !description}
          >
            Create
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Challenges</Text>
      
      <FlatList
        data={challenges}
        renderItem={renderChallengeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.challengesList}
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setIsCreating(true);
          resetForm();
        }}
      />
      
      <Portal>
        <Dialog 
          visible={!!viewingChallenge} 
          onDismiss={() => setViewingChallenge(null)}
          style={styles.dialog}
        >
          {viewingChallenge && (
            <>
              <Dialog.Title>{viewingChallenge.title}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" style={styles.dialogDescription}>
                  {viewingChallenge.description}
                </Text>
                
                <View style={styles.progressContainer}>
                  <Text variant="bodySmall" style={styles.progressText}>
                    Progress: {Math.round(calculateProgress(viewingChallenge) * 100)}%
                  </Text>
                  <ProgressBar 
                    progress={calculateProgress(viewingChallenge)} 
                    style={styles.progressBar} 
                  />
                </View>
                
                <View style={styles.detailsContainer}>
                  <Text variant="bodySmall">
                    Started: {new Date(viewingChallenge.startDate).toLocaleDateString()}
                  </Text>
                  <Text variant="bodySmall">
                    {viewingChallenge.endDate 
                      ? `Ends: ${new Date(viewingChallenge.endDate).toLocaleDateString()}`
                      : 'Ongoing'}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Track Your Progress</Text>
                {renderDateCheckboxes(viewingChallenge)}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setViewingChallenge(null)}>Close</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  challengesList: {
    paddingBottom: 80, // Space for FAB
  },
  challengeCard: {
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
  },
  button: {
    width: '48%',
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogDescription: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default ChallengesScreen;
