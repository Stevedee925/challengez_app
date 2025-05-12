import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { phoenixTheme, phoenixColors } from '../constants/theme';
import { 
  Text, 
  Card, 
  Button, 
  Avatar, 
  List, 
  Switch, 
  Divider,
  TextInput,
  Dialog,
  Portal,
  IconButton,
  SegmentedButtons,
  Chip
} from 'react-native-paper';
import { dummyUser } from '../constants/dummyData';
import { User } from '../types';
import * as ImageUtils from '../utils/imageUtils';
import * as Storage from '../utils/storage';

const ProfileScreen = () => {
  const [user, setUser] = useState<User>(dummyUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [imagePickerVisible, setImagePickerVisible] = useState<boolean>(false);
  const [editingStats, setEditingStats] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [profileImage, setProfileImage] = useState<string | undefined>(user.profileImage);
  const [age, setAge] = useState<string>(user.stats?.age?.toString() || '');
  const [weight, setWeight] = useState<string>(user.stats?.weight?.toString() || '');
  const [height, setHeight] = useState<string>(user.stats?.height?.toString() || '');
  const [fitnessLevel, setFitnessLevel] = useState<string>(user.stats?.fitnessLevel || 'beginner');
  const [weeklyActivityLevel, setWeeklyActivityLevel] = useState<string>(
    user.stats?.weeklyActivityLevel?.toString() || '0'
  );
  const [goals, setGoals] = useState<string[]>(user.stats?.goals || []);
  
  // Load user data and profile image on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load user data from storage
        const userData = await Storage.getUserData();
        if (userData) {
          setUser(userData);
          
          // Update form state with loaded user data
          setName(userData.name);
          setEmail(userData.email);
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
          
          // Update stats form state
          if (userData.stats) {
            setAge(userData.stats.age?.toString() || '');
            setWeight(userData.stats.weight?.toString() || '');
            setHeight(userData.stats.height?.toString() || '');
            setFitnessLevel(userData.stats.fitnessLevel || 'beginner');
            setWeeklyActivityLevel(userData.stats.weeklyActivityLevel?.toString() || '0');
            setGoals(userData.stats.goals || []);
          }
        } else {
          // If no user data in storage, try to load just the profile image
          const savedImageUri = await ImageUtils.getProfileImage();
          if (savedImageUri) {
            setProfileImage(savedImageUri);
            // Update user object with the image URI
            setUser(prevUser => ({
              ...prevUser,
              profileImage: savedImageUri
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  // Handle image picking
  const handlePickImage = async () => {
    try {
      const hasPermissions = await ImageUtils.requestMediaPermissions();
      
      if (!hasPermissions) {
        Alert.alert(
          'Permission Required',
          'Please grant camera and photo library permissions to upload a profile picture.'
        );
        return;
      }
      
      setImagePickerVisible(true);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions.');
    }
  };
  
  // Handle image selection from gallery
  const handleSelectFromGallery = async () => {
    try {
      const imageUri = await ImageUtils.pickImage();
      
      if (imageUri) {
        setProfileImage(imageUri);
        setImagePickerVisible(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image from gallery.');
    }
  };
  
  // Handle taking a photo with camera
  const handleTakePhoto = async () => {
    try {
      const imageUri = await ImageUtils.takePhoto();
      
      if (imageUri) {
        setProfileImage(imageUri);
        setImagePickerVisible(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };
  
  // Handle adding/removing goals
  const toggleGoal = (goal: string) => {
    setGoals(prevGoals => {
      if (prevGoals.includes(goal)) {
        return prevGoals.filter(g => g !== goal);
      } else {
        return [...prevGoals, goal];
      }
    });
  };
  
  const handleSaveProfile = async () => {
    // Parse numeric values
    const parsedAge = age ? parseInt(age, 10) : undefined;
    const parsedWeight = weight ? parseFloat(weight) : undefined;
    const parsedHeight = height ? parseFloat(height) : undefined;
    const parsedActivityLevel = weeklyActivityLevel ? parseInt(weeklyActivityLevel, 10) : undefined;
    
    // Update user with all form data
    const updatedUser = {
      ...user,
      name,
      email,
      profileImage,
      stats: {
        age: parsedAge,
        weight: parsedWeight,
        height: parsedHeight,
        fitnessLevel: fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
        goals,
        weeklyActivityLevel: parsedActivityLevel,
      },
    };
    
    setUser(updatedUser);
    
    // Save to storage
    try {
      await Storage.saveUserData(updatedUser);
      
      // If profile image was updated, save it
      if (profileImage && profileImage !== user.profileImage) {
        await Storage.saveProfileImageUri(profileImage);
      }
    } catch (error: any) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile data.');
    }
    
    setEditingProfile(false);
    setEditingStats(false);
  };
  
  if (editingProfile) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>Edit Profile</Text>
        
        {/* Profile Image Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            {profileImage ? (
              <Avatar.Image 
                size={100} 
                source={{ uri: profileImage }} 
              />
            ) : (
              <Avatar.Text 
                size={100} 
                label={name.split(' ').map(n => n[0]).join('')} 
              />
            )}
            <View style={styles.editIconContainer}>
              <IconButton
                icon="camera"
                size={20}
                iconColor="white"
                style={styles.editIcon}
                onPress={handlePickImage}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>
        
        {/* Basic Info Section */}
        <Card style={styles.card}>
          <Card.Title title="Basic Information" />
          <Card.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
          </Card.Content>
        </Card>
        
        {/* Stats Section */}
        <Card style={styles.card}>
          <Card.Title 
            title="Your Stats" 
            right={(props) => (
              <IconButton
                {...props}
                icon={editingStats ? "check" : "pencil"}
                onPress={() => setEditingStats(!editingStats)}
              />
            )}
          />
          <Card.Content>
            {editingStats ? (
              <>
                <View style={styles.statsRow}>
                  <TextInput
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                  <TextInput
                    label="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
                
                <View style={styles.statsRow}>
                  <TextInput
                    label="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                  <TextInput
                    label="Weekly Activity (days)"
                    value={weeklyActivityLevel}
                    onChangeText={setWeeklyActivityLevel}
                    keyboardType="numeric"
                    style={[styles.input, styles.halfInput]}
                  />
                </View>
                
                <Text style={styles.sectionLabel}>Fitness Level</Text>
                <SegmentedButtons
                  value={fitnessLevel}
                  onValueChange={setFitnessLevel}
                  buttons={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  style={styles.segmentedButtons}
                />
                
                <Text style={styles.sectionLabel}>Goals</Text>
                <View style={styles.goalsContainer}>
                  {['Weight loss', 'Muscle gain', 'Better sleep', 'More energy', 'Stress reduction'].map((goal) => (
                    <Chip
                      key={goal}
                      selected={goals.includes(goal)}
                      onPress={() => toggleGoal(goal)}
                      style={styles.goalChip}
                      showSelectedCheck={true}
                      mode="outlined"
                    >
                      {goal}
                    </Chip>
                  ))}
                </View>
              </>
            ) : (
              <>
                <List.Item
                  title="Age"
                  description={user.stats?.age || 'Not set'}
                />
                <Divider />
                <List.Item
                  title="Weight"
                  description={user.stats?.weight ? `${user.stats.weight} kg` : 'Not set'}
                />
                <Divider />
                <List.Item
                  title="Height"
                  description={user.stats?.height ? `${user.stats.height} cm` : 'Not set'}
                />
                <Divider />
                <List.Item
                  title="Fitness Level"
                  description={user.stats?.fitnessLevel ? user.stats.fitnessLevel.charAt(0).toUpperCase() + user.stats.fitnessLevel.slice(1) : 'Not set'}
                />
                <Divider />
                <List.Item
                  title="Weekly Activity"
                  description={user.stats?.weeklyActivityLevel ? `${user.stats.weeklyActivityLevel} days per week` : 'Not set'}
                />
                <Divider />
                <List.Item
                  title="Goals"
                  description={user.stats?.goals?.length ? user.stats.goals.join(', ') : 'Not set'}
                />
              </>
            )}
          </Card.Content>
        </Card>
        
        {/* Transformation Drivers Section */}
        {user.transformationDrivers && user.transformationDrivers.length > 0 && (
          <Card style={styles.card}>
            <Card.Title title="Transformation Drivers" />
            <Card.Content>
              <View style={styles.driversContainer}>
                {user.transformationDrivers.map((driver) => (
                  <Chip
                    key={driver}
                    style={styles.driverChip}
                    mode="flat"
                  >
                    {driver.charAt(0).toUpperCase() + driver.slice(1)}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => {
              setName(user.name);
              setEmail(user.email);
              setProfileImage(user.profileImage);
              setAge(user.stats?.age?.toString() || '');
              setWeight(user.stats?.weight?.toString() || '');
              setHeight(user.stats?.height?.toString() || '');
              setFitnessLevel(user.stats?.fitnessLevel || 'beginner');
              setWeeklyActivityLevel(user.stats?.weeklyActivityLevel?.toString() || '0');
              setGoals(user.stats?.goals || []);
              setEditingProfile(false);
              setEditingStats(false);
            }}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSaveProfile}
            style={styles.button}
            disabled={!name || !email}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    );
  }
  
  // Image picker dialog
  const renderImagePickerDialog = () => (
    <Portal>
      <Dialog
        visible={imagePickerVisible}
        onDismiss={() => setImagePickerVisible(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Change Profile Picture</Dialog.Title>
        <Dialog.Content>
          <Text>Choose an option to update your profile picture</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setImagePickerVisible(false)}>Cancel</Button>
          <Button onPress={handleTakePhoto}>Take Photo</Button>
          <Button onPress={handleSelectFromGallery}>Choose from Gallery</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  return (
    <ScrollView style={styles.container}>
      {renderImagePickerDialog()}
      
      <Text style={styles.screenTitle}>Profile</Text>
      
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          {profileImage ? (
            <Avatar.Image 
              size={80} 
              source={{ uri: profileImage }} 
            />
          ) : (
            <Avatar.Text 
              size={80} 
              label={user.name.split(' ').map(n => n[0]).join('')} 
            />
          )}
          <View style={styles.profileInfo}>
            <Text variant="titleLarge">{user.name}</Text>
            <Text variant="bodyMedium">{user.email}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setEditingProfile(true)}>Edit Profile</Button>
        </Card.Actions>
      </Card>
      
      {/* User Stats Card */}
      {user.stats && (
        <Card style={styles.card}>
          <Card.Title title="Your Stats" />
          <Card.Content>
            <List.Item
              title="Age"
              description={user.stats.age || 'Not set'}
            />
            <Divider />
            <List.Item
              title="Weight"
              description={user.stats.weight ? `${user.stats.weight} kg` : 'Not set'}
            />
            <Divider />
            <List.Item
              title="Height"
              description={user.stats.height ? `${user.stats.height} cm` : 'Not set'}
            />
            <Divider />
            <List.Item
              title="Fitness Level"
              description={user.stats.fitnessLevel ? user.stats.fitnessLevel.charAt(0).toUpperCase() + user.stats.fitnessLevel.slice(1) : 'Not set'}
            />
            <Divider />
            <List.Item
              title="Weekly Activity"
              description={user.stats.weeklyActivityLevel ? `${user.stats.weeklyActivityLevel} days per week` : 'Not set'}
            />
            {user.stats.goals && user.stats.goals.length > 0 && (
              <>
                <Divider />
                <List.Item
                  title="Goals"
                  description={user.stats.goals.join(', ')}
                />
              </>
            )}
          </Card.Content>
        </Card>
      )}
      
      <Card style={styles.card}>
        <Card.Title title="App Settings" />
        <Card.Content>
          <List.Item
            title="Notifications"
            description="Enable push notifications"
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Enable dark theme"
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Fasting Settings" />
        <Card.Content>
          <List.Item
            title="Default Fasting Schedule"
            description="16:8 Intermittent Fasting"
            right={() => <List.Icon icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Fasting Reminders"
            description="Receive reminders for fasting periods"
            right={() => <List.Icon icon="chevron-right" />}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="About" />
        <Card.Content>
          <List.Item
            title="App Version"
            description="1.0.0"
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            right={() => <List.Icon icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            right={() => <List.Icon icon="chevron-right" />}
          />
        </Card.Content>
      </Card>
      
      <Button 
        mode="outlined" 
        style={styles.logoutButton}
      >
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: phoenixColors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  card: {
    marginBottom: 16,
  },
  logoutButton: {
    marginVertical: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: phoenixColors.primary,
    borderRadius: 15,
    overflow: 'hidden',
  },
  editIcon: {
    backgroundColor: phoenixColors.primary,
    margin: 0,
  },
  changePhotoText: {
    marginTop: 8,
    color: phoenixColors.primary,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: phoenixColors.text,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  goalChip: {
    margin: 4,
  },
  driversContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  driverChip: {
    margin: 4,
    backgroundColor: phoenixColors.secondary,
  },
  dialog: {
    borderRadius: 8,
  },
});

export default ProfileScreen;
