import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
};

export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

export const theme = {
  colors: {
    primary: '#4255FF',
    secondary: '#303545',
    background: '#F6F7FB',
    surface: '#FFFFFF',
    success: '#2E9A47',
    error: '#FF725B',
    primaryContainer: '#E8E7FF',
    onPrimaryContainer: '#4255FF',
    outline: '#E5E6E9',
    onSurface: '#303545',
    onSurfaceVariant: '#646F90',
  },
  roundness: 12,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
}; 