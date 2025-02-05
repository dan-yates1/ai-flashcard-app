import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { IconButton, Menu, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { ThemedText } from './ThemedText';
import { theme } from '@/theme';
import type { Flashcard } from '@/types/database';

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onDelete?: (id: string) => void;
  setId: string;
}

export function FlashcardViewer({ flashcards, onDelete, setId }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: showBack ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setShowBack(!showBack);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentIndex + 1) / flashcards.length) * 100}%` }
          ]} 
        />
      </View>
      <View style={styles.header}>
        <ThemedText style={styles.counter}>
          {currentIndex + 1}/{flashcards.length}
        </ThemedText>
        <View style={styles.actions}>
          <IconButton
            icon="volume-high"
            iconColor={theme.colors.onSurfaceVariant}
            onPress={() => {/* TODO: Implement text-to-speech */}}
          />
          <IconButton 
            icon="shuffle" 
            iconColor={theme.colors.onSurfaceVariant}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                iconColor={theme.colors.onSurfaceVariant}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                router.push({
                  pathname: '/sets/[id]/cards/[cardId]/edit',
                  params: { id: setId, cardId: flashcards[currentIndex].id },
                });
                setMenuVisible(false);
              }}
              title="Edit"
            />
            <Menu.Item
              onPress={() => {
                onDelete?.(flashcards[currentIndex].id);
                setMenuVisible(false);
              }}
              title="Delete"
            />
          </Menu>
        </View>
      </View>

      <Pressable style={styles.cardContainer} onPress={flipCard}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontInterpolate }] },
            showBack && styles.cardHidden,
          ]}
        >
          <ThemedText style={styles.cardText}>
            {flashcards[currentIndex].front}
          </ThemedText>
          <ThemedText style={styles.tapHint}>
            Tap to flip
          </ThemedText>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
            !showBack && styles.cardHidden,
          ]}
        >
          <ThemedText style={styles.cardText}>
            {flashcards[currentIndex].back}
          </ThemedText>
          <ThemedText style={styles.tapHint}>
            Tap to flip
          </ThemedText>
        </Animated.View>
      </Pressable>

      <View style={styles.navigation}>
        <Button
          mode="outlined"
          onPress={() => {
            setShowBack(false);
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
          }}
          disabled={currentIndex === 0}
          style={styles.navButton}
        >
          Previous
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            setShowBack(false);
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
          }}
          disabled={currentIndex === flashcards.length - 1}
          style={styles.navButton}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  counter: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  cardContainer: {
    height: 300,
    position: 'relative',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outline,
    backfaceVisibility: 'hidden',
    transform: [
      { perspective: 1000 },
      { rotateX: '0deg' },
    ],
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardHidden: {
    opacity: 0,
  },
  cardText: {
    fontSize: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  tapHint: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
}); 