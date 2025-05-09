import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { 
  DefaultTheme as NavigationLightTheme, 
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { typography } from './typography';

// Define custom colors for light theme
const customLightColors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#f6f6f6',
  surface: '#ffffff',
  error: '#B00020',
  text: '#000000',
  onSurface: '#000000',
  disabled: '#9e9e9e',
  placeholder: '#9e9e9e',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#f50057',
};

// Phoenix theme colors
export const phoenixColors = {
  primary: '#B22222', // Deep crimson
  secondary: '#DAA520', // Gold
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#333333',
  onSurface: '#333333',
  disabled: '#9e9e9e',
  placeholder: '#9e9e9e',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#f50057',
  accent1: '#4B4B4B', // Charcoal
  accent2: '#A9A9A9', // Ash gray
};

// Define custom colors for dark theme
const customDarkColors = {
  primary: '#BB86FC',
  secondary: '#03DAC6',
  background: '#121212',
  surface: '#1e1e1e',
  error: '#CF6679',
  text: '#ffffff',
  onSurface: '#ffffff',
  disabled: '#6e6e6e',
  placeholder: '#6e6e6e',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#f50057',
};

// Create custom light theme for React Native Paper
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customLightColors,
  },
};

// Create custom dark theme for React Native Paper
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customDarkColors,
  },
};

// Create custom light theme for React Navigation
export const navigationLightTheme = {
  ...NavigationLightTheme,
  colors: {
    ...NavigationLightTheme.colors,
    primary: customLightColors.primary,
    background: customLightColors.background,
    card: customLightColors.surface,
    text: customLightColors.text,
    border: '#d8d8d8',
    notification: customLightColors.notification,
  },
};

// Create custom dark theme for React Navigation
export const navigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: customDarkColors.primary,
    background: customDarkColors.background,
    card: customDarkColors.surface,
    text: customDarkColors.text,
    border: '#272727',
    notification: customDarkColors.notification,
  },
};

// Create a merged theme that works with both Paper and Navigation
export const defaultTheme = {
  ...lightTheme,
  ...navigationLightTheme,
  colors: {
    ...lightTheme.colors,
    ...navigationLightTheme.colors,
  },
};

// Create phoenix theme for React Native Paper
export const phoenixPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...phoenixColors,
  },
  typography,
};

// Create phoenix theme for React Navigation
export const phoenixNavigationTheme = {
  ...NavigationLightTheme,
  colors: {
    ...NavigationLightTheme.colors,
    primary: phoenixColors.primary,
    background: phoenixColors.background,
    card: phoenixColors.surface,
    text: phoenixColors.text,
    border: '#d8d8d8',
    notification: phoenixColors.notification,
  },
};

// Create a merged phoenix theme that works with both Paper and Navigation
export const phoenixTheme = {
  ...phoenixPaperTheme,
  ...phoenixNavigationTheme,
  colors: {
    ...phoenixPaperTheme.colors,
    ...phoenixNavigationTheme.colors,
  },
};
