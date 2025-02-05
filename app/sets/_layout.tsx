import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function SetLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="new"
        options={{
          title: 'Create New Set',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="[id]/index" 
        options={{
          headerShown: false // We have a custom header in this screen
        }}
      />
      <Stack.Screen 
        name="[id]/edit" 
        options={{
          title: 'Edit Set',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="[id]/cards/new" 
        options={{
          title: 'Add New Card',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="[id]/cards/[cardId]/edit" 
        options={{
          title: 'Edit Card',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="[id]/share" 
        options={{
          title: 'Share Set',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="[id]/study" 
        options={{
          headerShown: false, // We have a custom header in study mode
          presentation: 'fullScreenModal'
        }}
      />
    </Stack>
  );
} 