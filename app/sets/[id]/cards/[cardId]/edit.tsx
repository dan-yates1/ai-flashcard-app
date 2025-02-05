import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function EditCardScreen() {
  const { id, cardId } = useLocalSearchParams<{ id: string; cardId: string }>();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const data = await database.flashcards.get(cardId);
        setFront(data.front);
        setBack(data.back);
      } catch (error) {
        console.error('Error loading card:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [cardId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await database.flashcards.update(cardId, { front, back });
      router.back();
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Edit Card</ThemedText>
      
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
        onPress={handleSave}
        loading={saving}
        disabled={!front.trim() || !back.trim()}
        style={styles.button}
      >
        Save Changes
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