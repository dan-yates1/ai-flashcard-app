import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const slides = [
  {
    title: 'Over 90% of students who use Flashcards report receiving higher marks.',
    icon: 'school',
    color: '#FFE082',
  },
  {
    title: 'Search millions of flashcard sets.',
    icon: 'magnify',
    color: '#FFCC80',
  },
  {
    title: 'Customise flashcards to your exact needs.',
    icon: 'pencil',
    color: '#A5D6A7',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.logo}>Flashcards</ThemedText>
      
      <Carousel
        width={width}
        height={width * 0.8}
        data={slides}
        onSnapToItem={setActiveIndex}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.color }]}>
            <IconButton
              icon={item.icon}
              size={80}
              iconColor="#000"
              style={styles.icon}
            />
            <ThemedText style={styles.title}>{item.title}</ThemedText>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/sign-up')}
        >
          Sign up for free
        </Button>
        <Button
          mode="text"
          onPress={() => router.push('/sign-in')}
        >
          Or log in
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4355F9',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#4355F9',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttons: {
    padding: 16,
    marginTop: 'auto',
    gap: 8,
  },
  button: {
    backgroundColor: '#4355F9',
  },
}); 