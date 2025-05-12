# My Challengez App

A React Native mobile application for tracking fasting, challenges, rituals, and personal transformation.

## Features

### User Profile
- **Profile Image Upload**: Users can upload a profile picture from their gallery or take a new photo with the camera.
- **User Stats**: Track and update personal stats including age, weight, height, fitness level, weekly activity, and fitness goals.
- **Transformation Drivers**: Display personalized transformation drivers selected during onboarding.

### Fasting Timer
- Track intermittent fasting sessions with customizable fasting windows
- View fasting history and statistics

### Challenges
- Join and track progress on various health and wellness challenges
- Daily, weekly, and monthly challenge options

### Rituals
- Create and maintain daily rituals for consistent habit building
- Track ritual completion and streaks

### Journal
- Record thoughts, feelings, and progress
- Tag entries and track mood

## Onboarding Flow
The app includes a comprehensive onboarding flow:
1. Splash Page
2. Feature Highlights
3. Personalization (transformation drivers)
4. User Stats Collection
5. Account Creation
6. First Challenge Selection

## Technical Implementation

### Storage
- User data is stored locally using AsyncStorage
- Profile images are stored in the app's file system using expo-file-system

### Image Handling
- Image picking and camera functionality via expo-image-picker
- Image storage and retrieval via expo-file-system

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Expo CLI

### Installation
1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm start
```

### Running on a Device
- Use the Expo Go app to scan the QR code from the terminal
- Or run on an emulator/simulator using the Expo CLI commands

## Project Structure
- `/src`: Source code
  - `/components`: Reusable UI components
  - `/constants`: App constants, theme, and dummy data
  - `/context`: React context providers
  - `/hooks`: Custom React hooks
  - `/navigation`: Navigation configuration
  - `/screens`: App screens
    - `/onboarding`: Onboarding screens
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions
- `/assets`: Images, fonts, and other static assets

## Dependencies
- React Native
- Expo
- React Navigation
- React Native Paper
- AsyncStorage
- Expo Image Picker
- Expo File System
- Expo Camera
