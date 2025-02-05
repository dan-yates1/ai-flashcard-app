import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Portal, Dialog, List, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { database } from '@/lib/database';
import { generateFlashcards } from '@/lib/openai';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function NewSetScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<Array<{ front: string; back: string }>>([]);
  const [generating, setGenerating] = useState(false);

  const handleCreate = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const set = await database.flashcardSets.create({
        user_id: user.id,
        title,
        description,
        is_public: false,
      });
      
      if (generatedCards.length > 0) {
        for (const card of generatedCards) {
          await database.flashcards.create({
            set_id: set.id,
            front: card.front,
            back: card.back,
            sort_order: 0,
          });
        }
      }
      
      router.replace({ pathname: '/sets/[id]/index', params: { id: set.id } });
    } catch (error) {
      console.error('Error creating set:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    try {
      setGenerating(true);
      const cards = await generateFlashcards(aiTopic);
      setGeneratedCards(cards);
      setTitle(aiTopic);
      setShowAiDialog(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>New Set</ThemedText>
        
        <Button
          mode="contained"
          onPress={() => setShowAiDialog(true)}
          style={styles.aiButton}
        >
          Generate with AI
        </Button>

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
        
        {generatedCards.length > 0 && (
          <View style={styles.previewContainer}>
            <ThemedText type="subtitle" style={styles.previewTitle}>
              Generated Cards Preview
            </ThemedText>
            {generatedCards.map((card, index) => (
              <Card key={index} style={styles.cardPreview}>
                <Card.Content>
                  <ThemedText>Front: {card.front}</ThemedText>
                  <ThemedText>Back: {card.back}</ThemedText>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          disabled={!title.trim()}
          style={styles.button}
        >
          Create Set
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={showAiDialog} onDismiss={() => setShowAiDialog(false)}>
          <Dialog.Title>Generate Flashcards</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Topic"
              value={aiTopic}
              onChangeText={setAiTopic}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAiDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleGenerateCards}
              loading={generating}
              disabled={!aiTopic.trim()}
            >
              Generate
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  aiButton: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    marginBottom: 8,
  },
  cardPreview: {
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
}); 