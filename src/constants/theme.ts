import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Define font configuration
const fontConfig = {
  fontFamily: 'System',
  fonts: {
    bodyLarge: {
      fontFamily: 'System',
      fontWeight: 'regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: 'System',
      fontWeight: 'regular',
      fontSize: 14,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: 'System',
      fontWeight: 'regular',
      fontSize: 12,
      lineHeight: 16,
    },
    titleLarge: {
      fontFamily: 'System',
      fontWeight: 'bold',
      fontSize: 22,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: 'System',
      fontWeight: 'medium',
      fontSize: 16,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: 'System',
      fontWeight: 'medium',
      fontSize: 14,
      lineHeight: 20,
    },
    labelLarge: {
      fontFamily: 'System',
      fontWeight: 'medium',
      fontSize: 14,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: 'System',
      fontWeight: 'medium',
      fontSize: 12,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: 'System',
      fontWeight: 'medium',
      fontSize: 11,
      lineHeight: 16,
    },
  },
};

// Define custom colors
const customColors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  accent: '#03dac6',
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

// Define custom dark colors
const customDarkColors = {
  primary: '#BB86FC',
  secondary: '#03DAC6',
  accent: '#03dac6',
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

// Create custom light theme
export const lightTheme = {
  ...MD3LightTheme,
  ...NavigationLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationLightTheme.colors,
    ...customColors,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Create custom dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    ...customDarkColors,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Export default theme
export const defaultTheme = lightTheme;
