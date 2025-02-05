import { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { FAB, IconButton, Button, Avatar, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FlashcardViewer } from '@/components/FlashcardViewer';
import type { FlashcardSet, Flashcard } from '@/types/database';
import { theme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FlashcardSetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [set, setSet] = useState<FlashcardSet & { flashcards: Flashcard[] }>();
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const loadSet = async () => {
    try {
      const data = await database.flashcardSets.get(id);
      setSet(data);
    } catch (error) {
      console.error('Error loading set:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSet();
  }, [id]);

  const handleDeleteCard = async (cardId: string) => {
    try {
      await database.flashcards.delete(cardId);
      await loadSet();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!set) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Set not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton 
          icon="arrow-left" 
          onPress={() => router.back()} 
          iconColor={theme.colors.text}
        />
        <View style={styles.headerContent}>
          <ThemedText style={styles.title}>{set.title}</ThemedText>
          {set.description && (
            <ThemedText style={styles.description}>
              {set.description}
            </ThemedText>
          )}
          <View style={styles.meta}>
            <Avatar.Text 
              size={24} 
              label={set.title.substring(0, 2).toUpperCase()} 
              style={styles.avatar}
            />
            <ThemedText style={styles.author}>
              {set.profiles?.username || 'Anonymous'}
            </ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.count}>
              {set.flashcards.length} terms
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="play"
          onPress={() => router.push({ pathname: '/sets/[id]/study', params: { id } })}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          contentStyle={styles.buttonContent}
        >
          Study
        </Button>
        <View style={styles.secondaryActions}>
          <Button
            mode="outlined"
            icon="share"
            onPress={() => router.push({ pathname: '/sets/[id]/share', params: { id } })}
            style={styles.secondaryButton}
          >
            Share
          </Button>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => router.push({ pathname: '/sets/[id]/edit', params: { id } })}
            style={styles.secondaryButton}
          >
            Edit
          </Button>
        </View>
      </View>

      <Divider style={styles.divider} />

      <ScrollView style={styles.content}>
        <View style={styles.viewerContainer}>
          <FlashcardViewer
            flashcards={set.flashcards}
            onDelete={handleDeleteCard}
            setId={id}
          />
        </View>
      </ScrollView>

      <IconButton
        icon="plus"
        mode="contained"
        size={24}
        onPress={() => router.push({ pathname: '/sets/[id]/cards/new', params: { id } })}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  author: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  dot: {
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm,
  },
  count: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  actions: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  buttonContent: {
    height: 48,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  secondaryButton: {
    flex: 1,
  },
  divider: {
    backgroundColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  viewerContainer: {
    padding: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    borderRadius: 28,
  },
}); 