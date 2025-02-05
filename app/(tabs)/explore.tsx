import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ScrollView } from 'react-native';
import { Searchbar, Chip, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FlashcardSet } from '@/components/FlashcardSet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import type { FlashcardSet as FlashcardSetType } from '@/types/database';

const CATEGORIES = [
  'Languages',
  'Science',
  'Math',
  'History',
  'Arts',
  'Technology',
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [publicSets, setPublicSets] = useState<FlashcardSetType[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPublicSets();
  }, []);

  const loadPublicSets = async () => {
    try {
      setLoading(true);
      const data = await database.flashcardSets.listPublic();
      setPublicSets(data);
    } catch (error) {
      console.error('Error loading public sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSets = publicSets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (set.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search study sets"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.textSecondary}
          />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredSets}
        renderItem={({ item }) => (
          <FlashcardSet
            set={item}
            onPress={() => router.push(`/sets/${item.id}`)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconButton
              icon="magnify"
              size={48}
              iconColor={theme.colors.textSecondary}
            />
            <ThemedText style={styles.emptyText}>
              No sets found
            </ThemedText>
          </View>
        }
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
  searchContainer: {
    padding: theme.spacing.md,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.md,
  },
  categories: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
