import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { phoenixStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountCreationPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle account creation
  const handleCreateAccount = async () => {
    // In a real app, this would connect to an authentication service
    // For now, we'll just store a flag in AsyncStorage
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('accountCreated', 'true');
      console.log('Account created successfully');
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    // In a real app, this would connect to social auth providers
    // For now, we'll just store a flag in AsyncStorage
    try {
      await AsyncStorage.setItem('authProvider', provider);
      await AsyncStorage.setItem('accountCreated', 'true');
      console.log(`Logged in with ${provider}`);
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error);
    }
  };

  // Handle skip
  const handleSkip = async () => {
    // Mark that the user has seen this screen but chosen to skip
    try {
      await AsyncStorage.setItem('accountCreationSkipped', 'true');
      console.log('Account creation skipped');
    } catch (error) {
      console.error('Error skipping account creation:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={phoenixStyles.container}>
        <Text style={phoenixStyles.title}>Embark on Your Journey</Text>
        
        <Text style={[phoenixStyles.subtitle, { marginBottom: 30 }]}>
          Create your account to save your progress
        </Text>

        {/* Email input */}
        <View style={phoenixStyles.inputContainer}>
          <TextInput
            style={phoenixStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password input */}
        <View style={phoenixStyles.inputContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[phoenixStyles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <IconButton
              icon={showPassword ? 'eye-off' : 'eye'}
              size={24}
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 5 }}
            />
          </View>
        </View>

        {/* Create account button */}
        <View style={phoenixStyles.buttonContainer}>
          <TouchableOpacity
            style={phoenixStyles.button}
            onPress={handleCreateAccount}
            activeOpacity={0.8}
          >
            <Text style={phoenixStyles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginVertical: 20,
          width: '100%' 
        }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }} />
          <Text style={{ marginHorizontal: 10, color: '#666666' }}>or continue with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E0E0E0' }} />
        </View>

        {/* Social login buttons */}
        <View style={phoenixStyles.socialButtonsContainer}>
          <TouchableOpacity
            style={[phoenixStyles.socialButton, phoenixStyles.googleButton]}
            onPress={() => handleSocialLogin('Google')}
            activeOpacity={0.8}
          >
            <IconButton icon="google" size={20} />
            <Text style={[phoenixStyles.socialButtonText, phoenixStyles.googleButtonText]}>Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[phoenixStyles.socialButton, phoenixStyles.appleButton]}
            onPress={() => handleSocialLogin('Apple')}
            activeOpacity={0.8}
          >
            <IconButton icon="apple" size={20} iconColor="#FFFFFF" />
            <Text style={[phoenixStyles.socialButtonText, phoenixStyles.appleButtonText]}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Skip option */}
        <TouchableOpacity
          style={phoenixStyles.skipButton}
          onPress={handleSkip}
        >
          <Text style={phoenixStyles.skipButtonText}>
            Skip for now (you can create an account later)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AccountCreationPage;
