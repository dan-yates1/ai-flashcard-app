import { StyleSheet, View } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { theme } from '@/theme';
import type { FlashcardSet } from '@/types/database';

interface FlashcardSetProps {
  set: FlashcardSet;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FlashcardSet({ set, onPress, onEdit, onDelete }: FlashcardSetProps) {
  return (
    <Card
      style={[styles.card, { elevation: 2 }]}
      mode="elevated"
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.topRow}>
          <Text variant="titleLarge" style={styles.title}>{set.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{set.flashcards?.length || 0} terms</Text>
          </View>
        </View>
        {set.description && (
          <Text 
            variant="bodyMedium" 
            style={styles.description}
            numberOfLines={2}
          >
            {set.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Avatar.Text 
            size={24} 
            label={set.title.substring(0, 2).toUpperCase()} 
            style={styles.avatar}
          />
          <Text variant="bodySmall" style={styles.author}>
            {set.profiles?.username || 'Anonymous'}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {new Date(set.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness * 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  count: {
    color: theme.colors.onSurfaceVariant,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  author: {
    color: theme.colors.onSurfaceVariant,
  },
  date: {
    color: theme.colors.onSurfaceVariant,
    marginLeft: theme.spacing.sm,
  },
}); 