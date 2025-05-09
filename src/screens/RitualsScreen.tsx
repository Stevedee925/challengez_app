import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  FAB, 
  TextInput, 
  Switch, 
  Dialog, 
  Portal,
  Checkbox,
  Divider,
  IconButton,
  Chip
} from 'react-native-paper';
import { dummyRituals } from '../constants/dummyData';
import { Ritual, RitualProgress } from '../types';

const RitualsScreen = () => {
  const [rituals, setRituals] = useState<Ritual[]>(dummyRituals);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [viewingRitual, setViewingRitual] = useState<Ritual | null>(null);
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [time, setTime] = useState<string>('08:00');
  const [selectedDays, setSelectedDays] = useState<('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]>([]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTime('08:00');
    setSelectedDays([]);
  };

  const handleCreateRitual = () => {
    if (!title || !description || selectedDays.length === 0) return;

    const newRitual: Ritual = {
      id: Date.now().toString(),
      title,
      description,
      time,
      days: selectedDays,
      isActive: true,
      progress: [],
    };

    setRituals([...rituals, newRitual]);
    setIsCreating(false);
    resetForm();
  };

  const toggleRitualProgress = (ritual: Ritual, date: number) => {
    const existingProgressIndex = ritual.progress.findIndex(p => 
      new Date(p.date).toDateString() === new Date(date).toDateString()
    );

    let updatedProgress: RitualProgress[];

    if (existingProgressIndex >= 0) {
      // Toggle existing progress
      updatedProgress = [...ritual.progress];
      updatedProgress[existingProgressIndex] = {
        ...updatedProgress[existingProgressIndex],
        isCompleted: !updatedProgress[existingProgressIndex].isCompleted
      };
    } else {
      // Add new progress
      updatedProgress = [
        ...ritual.progress,
        { date, isCompleted: true }
      ];
    }

    const updatedRitual = {
      ...ritual,
      progress: updatedProgress
    };

    setRituals(rituals.map(r => 
      r.id === ritual.id ? updatedRitual : r
    ));
  };

  const toggleRitualActive = (ritual: Ritual) => {
    const updatedRitual = {
      ...ritual,
      isActive: !ritual.isActive
    };

    setRituals(rituals.map(r => 
      r.id === ritual.id ? updatedRitual : r
    ));
  };

  const calculateAdherence = (ritual: Ritual) => {
    if (!ritual.progress.length) return 0;
    
    const completedDays = ritual.progress.filter(p => p.isCompleted).length;
    const totalDays = ritual.progress.length;
    
    return Math.round((completedDays / totalDays) * 100);
  };

  const toggleDay = (day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun') => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const dayLabels = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  const renderRitualItem = ({ item }: { item: Ritual }) => (
    <Card style={[styles.ritualCard, !item.isActive && styles.inactiveCard]}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Text variant="titleLarge">{item.title}</Text>
          <Switch 
            value={item.isActive} 
            onValueChange={() => toggleRitualActive(item)}
          />
        </View>
        
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        
        <View style={styles.detailsContainer}>
          <Text variant="bodySmall">
            Time: {item.time}
          </Text>
          <Text variant="bodySmall">
            Adherence: {calculateAdherence(item)}%
          </Text>
        </View>
        
        <View style={styles.daysContainer}>
          {item.days.map(day => (
            <Chip key={day} style={styles.dayChip}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Chip>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setViewingRitual(item)}>Track Progress</Button>
      </Card.Actions>
    </Card>
  );

  const renderDateCheckboxes = (ritual: Ritual) => {
    const dates = [];
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Show last 7 days for tracking
    for (let i = 6; i >= 0; i--) {
      const date = now - (i * dayInMs);
      const dateObj = new Date(date);
      const dateString = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      // Check if this day of week is included in the ritual's days
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().substring(0, 3) as 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
      const isRitualDay = ritual.days.includes(dayOfWeek);
      
      const isCompleted = ritual.progress.some(p => 
        new Date(p.date).toDateString() === dateObj.toDateString() && p.isCompleted
      );
      
      dates.push(
        <View key={date} style={styles.checkboxRow}>
          <View style={styles.dateInfo}>
            <Text>{dateString}</Text>
            {!isRitualDay && <Text style={styles.notScheduled}>(Not scheduled)</Text>}
          </View>
          <Checkbox
            status={isCompleted ? 'checked' : 'unchecked'}
            onPress={() => toggleRitualProgress(ritual, date)}
            disabled={!isRitualDay}
          />
        </View>
      );
    }
    
    return dates;
  };

  if (isCreating) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>Create New Ritual</Text>
        
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
        
        <TextInput
          label="Time (HH:MM)"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />
        
        <Text style={styles.sectionTitle}>Days of the Week</Text>
        <View style={styles.daysSelectionContainer}>
          {(Object.keys(dayLabels) as Array<keyof typeof dayLabels>).map(day => (
            <View key={day} style={styles.daySelection}>
              <Text>{dayLabels[day]}</Text>
              <Checkbox
                status={selectedDays.includes(day) ? 'checked' : 'unchecked'}
                onPress={() => toggleDay(day)}
              />
            </View>
          ))}
        </View>
        
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
            onPress={handleCreateRitual}
            style={styles.button}
            disabled={!title || !description || selectedDays.length === 0}
          >
            Create
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Rituals</Text>
      
      <FlatList
        data={rituals}
        renderItem={renderRitualItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ritualsList}
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
          visible={!!viewingRitual} 
          onDismiss={() => setViewingRitual(null)}
          style={styles.dialog}
        >
          {viewingRitual && (
            <>
              <Dialog.Title>{viewingRitual.title}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" style={styles.dialogDescription}>
                  {viewingRitual.description}
                </Text>
                
                <View style={styles.detailsContainer}>
                  <Text variant="bodySmall">
                    Time: {viewingRitual.time}
                  </Text>
                  <Text variant="bodySmall">
                    Status: {viewingRitual.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                
                <View style={styles.daysContainer}>
                  {viewingRitual.days.map(day => (
                    <Chip key={day} style={styles.dayChip}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Chip>
                  ))}
                </View>
                
                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Track Your Progress</Text>
                {renderDateCheckboxes(viewingRitual)}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setViewingRitual(null)}>Close</Button>
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
  ritualsList: {
    paddingBottom: 80, // Space for FAB
  },
  ritualCard: {
    marginBottom: 12,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  dayChip: {
    marginRight: 8,
    marginBottom: 8,
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
  daysSelectionContainer: {
    marginBottom: 16,
  },
  daySelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  dateInfo: {
    flexDirection: 'column',
  },
  notScheduled: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default RitualsScreen;
