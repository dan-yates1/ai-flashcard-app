import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Alert } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { FlashcardSet } from '@/components/FlashcardSet';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { database } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import type { FlashcardSet as FlashcardSetType } from '@/types/database';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [sets, setSets] = useState<FlashcardSetType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSets = async () => {
    try {
      if (!user) return;
      const data = await database.flashcardSets.list(user.id);
      setSets(data);
    } catch (error) {
      console.error('Error loading sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSets();
    setRefreshing(false);
  };

  const handleDelete = async (setId: string) => {
    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.flashcardSets.delete(setId);
              await loadSets();
            } catch (error) {
              console.error('Error deleting set:', error);
              Alert.alert('Error', 'Failed to delete set. Please try again.');
            }
          },
        },
      ]
    );
  };

  const filteredSets = sets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadSets();
  }, [user]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      paddingTop: insets.top + theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    greeting: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },
    list: {
      padding: theme.spacing.md,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      borderRadius: 28,
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
      gap: theme.spacing.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    separator: {
      height: theme.spacing.sm,
    },
    searchBar: {
      marginTop: theme.spacing.sm,
    },
  });

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>My Sets</ThemedText>
        <Searchbar
          placeholder="Search your sets"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.textSecondary}
        />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{sets.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Sets</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {sets.reduce((acc, set) => acc + (set.flashcards?.length || 0), 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Cards</ThemedText>
          </View>
        </View>
      </View>
      <FlatList
        data={filteredSets}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <FlashcardSet
            set={item}
            onPress={() => router.push(`/sets/${item.id}`)}
            onEdit={() => router.push({ pathname: "/sets/[id]/edit", params: { id: item.id } })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText>No flashcard sets yet</ThemedText>
            <ThemedText>Create one by tapping the + button</ThemedText>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/sets/new')}
      />
    </ThemedView>
  );
}
