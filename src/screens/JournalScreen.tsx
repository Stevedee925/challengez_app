import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  FAB, 
  TextInput, 
  Chip, 
  Dialog, 
  Portal,
  IconButton,
  Divider
} from 'react-native-paper';
import { dummyJournalEntries } from '../constants/dummyData';
import { JournalEntry } from '../types';

const JournalScreen = ({ navigation, route }: any) => {
  const [entries, setEntries] = useState<JournalEntry[]>(dummyJournalEntries);
  const [isCreating, setIsCreating] = useState<boolean>(route?.params?.action === 'create');
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags([]);
    setCurrentTag('');
  };

  const handleCreateEntry = () => {
    if (!title || !content) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: Date.now(),
      title,
      content,
      mood,
      tags,
    };

    setEntries([newEntry, ...entries]);
    setIsCreating(false);
    resetForm();
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const moodOptions = ['happy', 'sad', 'energetic', 'tired', 'focused', 'distracted', 'peaceful', 'anxious', 'grateful'];

  const renderEntryItem = ({ item }: { item: JournalEntry }) => (
    <Card style={styles.entryCard} onPress={() => setViewingEntry(item)}>
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.entryPreview}>
          {item.content}
        </Text>
        <Text variant="bodySmall" style={styles.entryDate}>
          {new Date(item.date).toLocaleString()}
        </Text>
        
        {item.mood && (
          <Chip icon="emoticon" style={styles.moodChip}>
            {item.mood}
          </Chip>
        )}
        
        <View style={styles.tagsContainer}>
          {item.tags?.map(tag => (
            <Chip key={tag} style={styles.tag}>
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  if (isCreating) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>New Journal Entry</Text>
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        
        <TextInput
          label="Content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          style={styles.contentInput}
        />
        
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodSelector}>
          {moodOptions.map(option => (
            <Chip
              key={option}
              selected={mood === option}
              onPress={() => setMood(option)}
              style={styles.moodOption}
            >
              {option}
            </Chip>
          ))}
        </ScrollView>
        
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagInput}>
          <TextInput
            label="Add a tag"
            value={currentTag}
            onChangeText={setCurrentTag}
            style={styles.tagTextInput}
          />
          <Button onPress={addTag}>Add</Button>
        </View>
        
        <View style={styles.tagsContainer}>
          {tags.map(tag => (
            <Chip
              key={tag}
              onClose={() => removeTag(tag)}
              style={styles.tag}
            >
              {tag}
            </Chip>
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
            onPress={handleCreateEntry}
            style={styles.button}
            disabled={!title || !content}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Journal</Text>
      
      <FlatList
        data={entries}
        renderItem={renderEntryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.entriesList}
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
        <Dialog visible={!!viewingEntry} onDismiss={() => setViewingEntry(null)}>
          {viewingEntry && (
            <>
              <Dialog.Title>{viewingEntry.title}</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodySmall" style={styles.dialogDate}>
                  {new Date(viewingEntry.date).toLocaleString()}
                </Text>
                
                {viewingEntry.mood && (
                  <Chip icon="emoticon" style={styles.moodChip}>
                    {viewingEntry.mood}
                  </Chip>
                )}
                
                <Divider style={styles.divider} />
                
                <Text variant="bodyMedium" style={styles.dialogContent}>
                  {viewingEntry.content}
                </Text>
                
                <View style={styles.tagsContainer}>
                  {viewingEntry.tags?.map(tag => (
                    <Chip key={tag} style={styles.tag}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setViewingEntry(null)}>Close</Button>
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
  entriesList: {
    paddingBottom: 80, // Space for FAB
  },
  entryCard: {
    marginBottom: 12,
  },
  entryPreview: {
    marginTop: 8,
    marginBottom: 8,
  },
  entryDate: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  moodChip: {
    alignSelf: 'flex-start',
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
  contentInput: {
    marginBottom: 16,
    height: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  moodSelector: {
    marginBottom: 16,
  },
  moodOption: {
    marginRight: 8,
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagTextInput: {
    flex: 1,
    marginRight: 8,
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
  dialogDate: {
    marginBottom: 8,
  },
  dialogContent: {
    marginTop: 8,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
});

export default JournalScreen;
