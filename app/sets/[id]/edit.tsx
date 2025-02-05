import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import type { FlashcardSet } from '@/types/database';

export default function EditSetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSet = async () => {
      try {
        const data = await database.flashcardSets.get(id);
        setTitle(data.title);
        setDescription(data.description || '');
      } catch (error) {
        console.error('Error loading set:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSet();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await database.flashcardSets.update(id, { title, description });
      router.back();
    } catch (error) {
      console.error('Error updating set:', error);
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
      <ThemedText type="title" style={styles.title}>Edit Set</ThemedText>
      
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      
      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={!title.trim()}
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