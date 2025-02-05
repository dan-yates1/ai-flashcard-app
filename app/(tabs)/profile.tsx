import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText style={styles.email}>{user?.email}</ThemedText>
      <Button mode="contained" onPress={signOut} style={styles.button}>
        Sign Out
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    marginVertical: 20,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
}); 