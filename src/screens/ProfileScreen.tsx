import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
  Portal
} from 'react-native-paper';
import { dummyUser } from '../constants/dummyData';
import { User } from '../types';

const ProfileScreen = () => {
  const [user, setUser] = useState<User>(dummyUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  
  // Form state
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  
  const handleSaveProfile = () => {
    setUser({
      ...user,
      name,
      email
    });
    setEditingProfile(false);
  };
  
  if (editingProfile) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>Edit Profile</Text>
        
        <View style={styles.avatarContainer}>
          <Avatar.Text 
            size={80} 
            label={name.split(' ').map(n => n[0]).join('')} 
          />
        </View>
        
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
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => {
              setName(user.name);
              setEmail(user.email);
              setEditingProfile(false);
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
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Profile</Text>
      
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user.name.split(' ').map(n => n[0]).join('')} 
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge">{user.name}</Text>
            <Text variant="bodyMedium">{user.email}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => setEditingProfile(true)}>Edit Profile</Button>
        </Card.Actions>
      </Card>
      
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
  },
  input: {
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
});

export default ProfileScreen;
