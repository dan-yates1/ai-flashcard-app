import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { IconButton, ProgressBar, Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import type { FlashcardSet, Flashcard, StudyProgress } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StudyMode = 'review' | 'quiz' | 'spaced';

export default function StudyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [set, setSet] = useState<FlashcardSet & { flashcards: Flashcard[] }>();
  const [mode, setMode] = useState<StudyMode>('review');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dueCards, setDueCards] = useState<(Flashcard & { study_progress: StudyProgress })[]>([]);
  const [progress, setProgress] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadSet = async () => {
      try {
        const data = await database.flashcardSets.get(id);
        if (mode === 'spaced') {
          const dueCardsData = await database.studyProgress.getDueCards(user!.id, id);
          setDueCards(dueCardsData);
          setSet({ ...data, flashcards: dueCardsData });
        } else {
          const shuffled = [...data.flashcards].sort(() => Math.random() - 0.5);
          setSet({ ...data, flashcards: shuffled });
        }
      } catch (error) {
        console.error('Error loading set:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSet();
  }, [id, mode]);

  const handleAnswer = (correct: boolean) => {
    setProgress(prev => ({
      ...prev,
      [set!.flashcards[currentIndex].id]: correct ? 'correct' : 'incorrect'
    }));
    setShowAnswer(false);
    setCurrentIndex(prev => (prev + 1) % set!.flashcards.length);
  };

  const handleSpacedAnswer = async (rating: 1 | 2 | 3 | 4) => {
    if (!user || !set) return;
    
    try {
      await database.studyProgress.update(
        user.id,
        set.flashcards[currentIndex].id,
        rating
      );
      setShowAnswer(false);
      setCurrentIndex(prev => (prev + 1) % set.flashcards.length);
    } catch (error) {
      console.error('Error updating study progress:', error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!set || set.flashcards.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No flashcards in this set.</ThemedText>
        <Button onPress={() => router.back()}>Go Back</Button>
      </ThemedView>
    );
  }

  const currentCard = set.flashcards[currentIndex];
  const progressCount = Object.values(progress).filter(v => v === 'correct').length;
  const progressPercent = progressCount / set.flashcards.length;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton 
          icon="close" 
          onPress={() => router.back()} 
          iconColor={theme.colors.text}
        />
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            {Math.round(progressPercent * 100)}% Complete
          </ThemedText>
          <ProgressBar 
            progress={progressPercent} 
            style={styles.progressBar}
            color={theme.colors.primary} 
          />
        </View>
      </View>

      <View style={styles.modeSelector}>
        {['Review', 'Quiz', 'Spaced'].map((m) => (
          <Button
            key={m}
            mode={mode === m.toLowerCase() ? 'contained' : 'outlined'}
            onPress={() => setMode(m.toLowerCase() as StudyMode)}
            style={styles.modeButton}
            labelStyle={styles.modeButtonLabel}
          >
            {m}
          </Button>
        ))}
      </View>

      <Pressable 
        style={styles.card} 
        onPress={() => setShowAnswer(!showAnswer)}
      >
        <ThemedText style={styles.cardText}>
          {showAnswer ? currentCard.back : currentCard.front}
        </ThemedText>
        <ThemedText style={styles.cardHint}>
          Tap to see {showAnswer ? 'front' : 'back'}
        </ThemedText>
      </Pressable>

      {mode === 'quiz' && (
        <View style={styles.quizButtons}>
          <Button
            mode="contained"
            onPress={() => handleAnswer(false)}
            style={[styles.quizButton, { backgroundColor: theme.colors.error }]}
          >
            Incorrect
          </Button>
          <Button
            mode="contained"
            onPress={() => handleAnswer(true)}
            style={[styles.quizButton, { backgroundColor: theme.colors.success }]}
          >
            Correct
          </Button>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
  },
  modeButtonLabel: {
    fontSize: 14,
  },
  card: {
    flex: 1,
    margin: theme.spacing.md,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
    color: theme.colors.text,
  },
  cardHint: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  quizButtons: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  quizButton: {
    flex: 1,
  },
}); 