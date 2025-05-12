import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Image } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import { phoenixTheme, phoenixColors } from '../constants/theme';
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
  SegmentedButtons,
  Chip,
  Avatar,
  RadioButton,
  ActivityIndicator
} from 'react-native-paper';
import { dummyChallenges } from '../constants/dummyData';
import { Challenge, ChallengeProgress } from '../types';
import { useNavigation } from '@react-navigation/native';

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState<Challenge[]>(dummyChallenges);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState<'fasting' | 'custom'>('fasting');
  const [showAIDialog, setShowAIDialog] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [duration, setDuration] = useState<string>('30'); // in days
  
  // Fasting challenge specific state
  const [selectedFastingDuration, setSelectedFastingDuration] = useState<number>(16);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setDuration('30');
    setSelectedFastingDuration(16);
    setAiPrompt('');
    setAiResponse('');
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
      type: 'custom',
    };

    setChallenges([...challenges, newChallenge]);
    setIsCreating(false);
    resetForm();
  };

  const handleStartChallenge = (challenge: Challenge) => {
    // Update the challenge to mark it as started
    const now = Date.now();
    const updatedChallenge = {
      ...challenge,
      startDate: now,
      endDate: challenge.daysRequired 
        ? now + ((challenge.daysRequired + 1) * 24 * 60 * 60 * 1000) 
        : now + (30 * 24 * 60 * 60 * 1000),
    };

    setChallenges(challenges.map(c => 
      c.id === challenge.id ? updatedChallenge : c
    ));

    // If it's a fasting challenge, navigate to the fasting timer
    if (challenge.type === 'fasting') {
      // Close the dialog if open
      setViewingChallenge(null);
      
      // Navigate to fasting timer with the selected duration
      // @ts-ignore - Ignoring type error for navigation
      navigation.navigate('FastingTimer', {
        selectedDuration: challenge.fastingDuration || 16,
        challengeId: challenge.id
      });
    }
  };

  const handleGenerateAIChallenge = () => {
    if (!aiPrompt) return;
    
    setAiGenerating(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      // This is a mock AI response - in a real app, this would come from an API
      const generatedResponse = generateAIResponse(aiPrompt);
      setAiResponse(generatedResponse);
      setAiGenerating(false);
    }, 2000);
  };

  const generateAIResponse = (prompt: string) => {
    // This is a simple mock function to generate AI responses
    // In a real app, this would be replaced with an actual AI API call
    
    const responses = [
      `Based on your goals, I recommend a progressive fasting challenge: Start with 14-hour fasts for 3 days, then increase to 16 hours for the next 4 days. This gradual approach will help your body adapt while providing metabolic benefits.`,
      `I've created a custom challenge for you: "Metabolic Reset" - Complete a 16-hour fast for 5 days, followed by 2 days of 12-hour fasts. This pattern helps optimize fat burning while giving your body recovery time.`,
      `Your personalized challenge: "Energy Boost Protocol" - Alternate between 18-hour fasts (3 days) and 14-hour fasts (2 days) to maximize cellular regeneration while maintaining sustainable energy levels throughout.`,
      `Based on your input, I recommend: "Mindful Eating Journey" - Complete 16-hour fasts for 7 days, with a focus on mindful eating during your eating windows. This will help you develop awareness of hunger cues and improve your relationship with food.`
    ];
    
    // Select a response based on some characteristic of the prompt
    const responseIndex = prompt.length % responses.length;
    return responses[responseIndex];
  };

  const handleCreateAIChallenge = () => {
    if (!aiResponse) return;

    const now = Date.now();
    
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: `AI Challenge: ${aiPrompt.substring(0, 20)}...`,
      description: aiResponse,
      frequency: 'daily',
      startDate: now,
      endDate: now + (14 * 24 * 60 * 60 * 1000), // 14 days by default
      progress: [],
      type: 'ai-generated',
      trophy: {
        name: 'AI Challenge Pioneer',
        description: 'Completed a personalized AI-generated challenge',
        awarded: false
      }
    };

    setChallenges([...challenges, newChallenge]);
    setShowAIDialog(false);
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

    // Check if challenge is completed
    const completedDays = updatedProgress.filter(p => p.isCompleted).length;
    let updatedTrophy = challenge.trophy;
    
    // If challenge has a trophy and required days are met, award the trophy
    if (challenge.trophy && challenge.daysRequired && completedDays >= challenge.daysRequired) {
      updatedTrophy = {
        ...challenge.trophy,
        awarded: true
      };
    }

    const updatedChallenge = {
      ...challenge,
      progress: updatedProgress,
      trophy: updatedTrophy
    };

    setChallenges(challenges.map(c => 
      c.id === challenge.id ? updatedChallenge : c
    ));
  };

  const calculateProgress = (challenge: Challenge) => {
    if (!challenge.progress.length) return 0;
    
    const completedDays = challenge.progress.filter(p => p.isCompleted).length;
    
    // For challenges with daysRequired, use that as the denominator
    if (challenge.daysRequired) {
      return Math.min(completedDays / challenge.daysRequired, 1);
    }
    
    // Otherwise use the total days in progress
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

  const getFilteredChallenges = () => {
    if (activeTab === 'fasting') {
      return challenges.filter(challenge => 
        challenge.type === 'fasting' || challenge.type === 'ai-generated'
      );
    } else {
      return challenges.filter(challenge => 
        challenge.type === 'custom' || !challenge.type
      );
    }
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => {
    const isCompleted = item.trophy?.awarded || false;
    
    return (
      <Card 
        style={[
          styles.challengeCard, 
          item.type === 'fasting' && styles.fastingChallengeCard,
          item.type === 'ai-generated' && styles.aiChallengeCard
        ]} 
        onPress={() => setViewingChallenge(item)}
      >
        {isCompleted && (
          <View style={styles.trophyBadge}>
            <Avatar.Icon 
              size={40} 
              icon="trophy" 
              style={styles.trophyIcon} 
              color={phoenixColors.background}
            />
          </View>
        )}
        
        <Card.Content>
          <Text variant="titleLarge">{item.title}</Text>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
          
          {item.type && (
            <View style={styles.tagContainer}>
              <Chip 
                icon={item.type === 'fasting' ? 'food-off' : item.type === 'ai-generated' ? 'robot' : 'tag'}
                style={[
                  styles.typeChip,
                  item.type === 'fasting' && styles.fastingChip,
                  item.type === 'ai-generated' && styles.aiChip
                ]}
              >
                {item.type === 'fasting' 
                  ? item.fastingType === 'omad' 
                    ? 'OMAD' 
                    : 'Intermittent Fasting' 
                  : item.type === 'ai-generated' 
                    ? 'AI Generated' 
                    : 'Custom'}
              </Chip>
              
              {item.daysRequired && (
                <Chip icon="calendar" style={styles.daysChip}>
                  {item.daysRequired} {item.daysRequired === 1 ? 'day' : 'days'}
                </Chip>
              )}
            </View>
          )}
          
          <View style={styles.progressContainer}>
            <Text variant="bodySmall" style={styles.progressText}>
              Progress: {Math.round(calculateProgress(item) * 100)}%
            </Text>
            <ProgressBar 
              progress={calculateProgress(item)} 
              style={styles.progressBar} 
              color={
                item.type === 'fasting' 
                  ? phoenixColors.primary 
                  : item.type === 'ai-generated' 
                    ? '#6200ee' 
                    : phoenixColors.accent1
              }
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
          {(item.type === 'fasting' || item.type === 'ai-generated') && 
           !item.progress.length && (
            <Button 
              mode="contained" 
              onPress={() => {
                if (item.type === 'fasting' && item.fastingType === 'intermittent') {
                  // Show duration selection dialog for intermittent fasting
                  setSelectedChallenge(item);
                } else {
                  // Start challenge directly for other types
                  handleStartChallenge(item);
                }
              }}
            >
              Start Challenge
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

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
    <View style={styles.containerWrapper}>
      <AnimatedBackground position="full" animation="morphing" opacity={0.05} speed={0.3} />
      <View style={styles.container}>
      <Text style={styles.screenTitle}>Challenges</Text>
      
      {!isCreating && !viewingChallenge && (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <Text style={styles.subtitle}>Push yourself to new heights</Text>
          </View>
          
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'fasting' | 'custom')}
            buttons={[
              { value: 'fasting', label: 'Fasting Challenges' },
              { value: 'custom', label: 'Custom Challenges' }
            ]}
            style={styles.tabButtons}
          />
          
          {activeTab === 'fasting' && (
            <View style={styles.fastingChallengesHeader}>
              <Text style={styles.fastingChallengesTitle}>
                Choose a fasting challenge to get started
              </Text>
              <Button 
                mode="contained" 
                icon="robot" 
                onPress={() => setShowAIDialog(true)}
                style={styles.aiButton}
              >
                AI Personalized Challenge
              </Button>
            </View>
          )}
        </>
      )}
      
      <FlatList
        data={getFilteredChallenges()}
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
        {/* Challenge Details Dialog */}
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

        {/* AI Challenge Dialog */}
        <Dialog 
          visible={showAIDialog} 
          onDismiss={() => setShowAIDialog(false)}
          style={styles.aiDialog}
        >
          <Dialog.Title>Create Personalized Challenge</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.aiDialogText}>
              Describe your goals and preferences, and our AI will create a personalized fasting challenge for you.
            </Text>
            
            <TextInput
              label="Tell the AI about your goals"
              value={aiPrompt}
              onChangeText={setAiPrompt}
              multiline
              numberOfLines={4}
              style={styles.aiPromptInput}
              placeholder="e.g., I want to improve my energy levels and focus during work hours. I've tried 16-hour fasts before but struggled with consistency."
            />
            
            {aiGenerating && (
              <View style={styles.aiGeneratingContainer}>
                <ActivityIndicator size="large" color={phoenixColors.primary} />
                <Text style={styles.aiGeneratingText}>Generating your personalized challenge...</Text>
              </View>
            )}
            
            {aiResponse && !aiGenerating && (
              <View style={styles.aiResponseContainer}>
                <Text style={styles.aiResponseTitle}>Your Personalized Challenge:</Text>
                <Text style={styles.aiResponseText}>{aiResponse}</Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAIDialog(false)}>Cancel</Button>
            {!aiResponse && !aiGenerating && (
              <Button 
                mode="contained" 
                onPress={handleGenerateAIChallenge}
                disabled={!aiPrompt}
              >
                Generate Challenge
              </Button>
            )}
            {aiResponse && !aiGenerating && (
              <Button 
                mode="contained" 
                onPress={handleCreateAIChallenge}
              >
                Accept Challenge
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>

        {/* Fasting Challenge Dialog */}
        <Dialog 
          visible={!!selectedChallenge} 
          onDismiss={() => setSelectedChallenge(null)}
          style={styles.fastingDialog}
        >
          {selectedChallenge && (
            <>
              <Dialog.Title>{selectedChallenge.title}</Dialog.Title>
              <Dialog.Content>
                <Text style={styles.fastingDialogDescription}>
                  {selectedChallenge.description}
                </Text>
                
                {selectedChallenge.fastingType === 'intermittent' && (
                  <>
                    <Text style={styles.fastingOptionTitle}>Select Fasting Duration:</Text>
                    <RadioButton.Group 
                      onValueChange={value => setSelectedFastingDuration(parseInt(value, 10))} 
                      value={selectedFastingDuration.toString()}
                    >
                      {selectedChallenge.id === '1' && (
                        <RadioButton.Item label="12 Hours" value="12" />
                      )}
                      <RadioButton.Item label="16 Hours" value="16" />
                      <RadioButton.Item label="20 Hours" value="20" />
                    </RadioButton.Group>
                  </>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSelectedChallenge(null)}>Cancel</Button>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    // Update the challenge with the selected duration
                    const updatedChallenge = {
                      ...selectedChallenge,
                      fastingDuration: selectedFastingDuration
                    };
                    
                    // Start the challenge
                    handleStartChallenge(updatedChallenge);
                    setSelectedChallenge(null);
                  }}
                >
                  Start Challenge
                </Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: phoenixColors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
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
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  fastingChallengeCard: {
    borderLeftWidth: 4,
    borderLeftColor: phoenixColors.primary,
  },
  aiChallengeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee', // Purple for AI
  },
  trophyBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  trophyIcon: {
    backgroundColor: 'gold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  typeChip: {
    height: 28,
  },
  fastingChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  aiChip: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
  daysChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: 28,
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
  tabButtons: {
    marginBottom: 16,
  },
  fastingChallengesHeader: {
    marginBottom: 16,
  },
  fastingChallengesTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  aiButton: {
    marginTop: 8,
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
  aiDialog: {
    maxHeight: '90%',
  },
  aiDialogText: {
    marginBottom: 16,
  },
  aiPromptInput: {
    marginBottom: 16,
  },
  aiGeneratingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  aiGeneratingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  aiResponseContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginTop: 16,
  },
  aiResponseTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aiResponseText: {
    lineHeight: 20,
  },
  fastingDialog: {
    maxHeight: '80%',
  },
  fastingDialogDescription: {
    marginBottom: 16,
  },
  fastingOptionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default ChallengesScreen;
