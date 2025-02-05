import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      router.replace('/');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <IconButton 
        icon="arrow-left"
        size={24}
        onPress={() => router.back()}
        style={styles.backButton}
      />

      <ThemedText style={styles.title}>QUICKLY SIGN UP WITH</ThemedText>

      <View style={styles.socialButtons}>
        <Button
          mode="outlined"
          icon="facebook"
          onPress={() => {}}
          style={styles.socialButton}
        >
          Continue with Facebook
        </Button>
        <Button
          mode="outlined"
          icon="google"
          onPress={() => {}}
          style={styles.socialButton}
        >
          Continue with Google
        </Button>
        <Button
          mode="outlined"
          icon="apple"
          onPress={() => {}}
          style={styles.socialButton}
        >
          Sign in with Apple
        </Button>
      </View>

      <ThemedText style={styles.divider}>OR CREATE AN ACCOUNT</ThemedText>

      <TextInput
        label="DATE OF BIRTH"
        value={birthDate}
        onChangeText={setBirthDate}
        mode="flat"
        style={styles.input}
      />

      <TextInput
        label="EMAIL"
        value={email}
        onChangeText={setEmail}
        mode="flat"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="PASSWORD"
        value={password}
        onChangeText={setPassword}
        mode="flat"
        style={styles.input}
        secureTextEntry
      />

      <ThemedText style={styles.terms}>
        By signing up, you accept Flashcards's{' '}
        <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>
      </ThemedText>

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        disabled={!email || !password || !birthDate}
        style={styles.signUpButton}
      >
        Sign up
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: -8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    borderRadius: 8,
  },
  divider: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  terms: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  signUpButton: {
    backgroundColor: '#4355F9',
    marginTop: 'auto',
  },
}); 