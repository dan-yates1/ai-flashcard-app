import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, List, Switch, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { database } from '@/lib/database';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import type { SharePermission } from '@/types/database';

export default function ShareSetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [permissions, setPermissions] = useState<SharePermission[]>([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await database.sharePermissions.list(id);
        setPermissions(data);
        const set = await database.flashcardSets.get(id);
        setIsPublic(set.is_public);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [id]);

  const handleShare = async () => {
    if (!email.trim()) return;

    try {
      setSharing(true);
      await database.sharePermissions.create({
        set_id: id,
        email,
        permission_level: canEdit ? 'edit' : 'view',
      });
      setEmail('');
      const updatedPermissions = await database.sharePermissions.list(id);
      setPermissions(updatedPermissions);
    } catch (error) {
      console.error('Error sharing set:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleUpdatePublic = async (value: boolean) => {
    try {
      await database.flashcardSets.update(id, { is_public: value });
      setIsPublic(value);
    } catch (error) {
      console.error('Error updating public status:', error);
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await database.sharePermissions.delete(permissionId);
      const updatedPermissions = await database.sharePermissions.list(id);
      setPermissions(updatedPermissions);
    } catch (error) {
      console.error('Error removing permission:', error);
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
      <ScrollView>
        <List.Item
          title="Public Set"
          description="Anyone with the link can view this set"
          right={() => (
            <Switch
              value={isPublic}
              onValueChange={handleUpdatePublic}
            />
          )}
        />

        <ThemedText style={styles.section}>Share with Others</ThemedText>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <List.Item
          title="Can Edit"
          right={() => (
            <Switch
              value={canEdit}
              onValueChange={setCanEdit}
            />
          )}
        />
        
        <Button
          mode="contained"
          onPress={handleShare}
          loading={sharing}
          disabled={!email.trim()}
          style={styles.button}
        >
          Share
        </Button>

        {permissions.length > 0 && (
          <>
            <ThemedText style={styles.section}>Shared With</ThemedText>
            {permissions.map((permission) => (
              <List.Item
                key={permission.id}
                title={permission.email}
                description={`Can ${permission.permission_level}`}
                right={() => (
                  <IconButton
                    icon="close"
                    onPress={() => handleRemovePermission(permission.id)}
                  />
                )}
              />
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 