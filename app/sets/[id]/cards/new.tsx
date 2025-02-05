import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function NewCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await database.flashcards.create({
        set_id: id,
        front,
        back,
        sort_order: 0, // TODO: Implement proper ordering
      });
      router.back();
    } catch (error) {
      console.error('Error creating flashcard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>New Flashcard</ThemedText>
      
      <TextInput
        label="Front"
        value={front}
        onChangeText={setFront}
        mode="outlined"
        multiline
        style={styles.input}
      />
      
      <TextInput
        label="Back"
        value={back}
        onChangeText={setBack}
        mode="outlined"
        multiline
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleCreate}
        loading={loading}
        disabled={!front.trim() || !back.trim()}
        style={styles.button}
      >
        Create Card
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 