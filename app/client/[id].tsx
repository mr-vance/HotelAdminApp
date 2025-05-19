import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients?id=${id}`);
      setClient(response.data);
      setForm(response.data);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/clients?id=${id}`, form);
      setClient(form);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/clients?id=${id}`);
      router.back();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  if (!client) {
    return <ThemedView><ThemedText>Loading...</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.input}
          value={isEditing ? form.first_name : client.first_name}
          onChangeText={(text) => setForm({ ...form, first_name: text })}
          placeholder="First Name"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.last_name : client.last_name}
          onChangeText={(text) => setForm({ ...form, last_name: text })}
          placeholder="Last Name"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.email_address : client.email_address}
          onChangeText={(text) => setForm({ ...form, email_address: text })}
          placeholder="Email Address"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.phone_number : client.phone_number}
          onChangeText={(text) => setForm({ ...form, phone_number: text })}
          placeholder="Phone Number"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.company_name : client.company_name}
          onChangeText={(text) => setForm({ ...form, company_name: text })}
          placeholder="Company Name"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.company_address : client.company_address}
          onChangeText={(text) => setForm({ ...form, company_address: text })}
          placeholder="Company Address"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.company_vat_number : client.company_vat_number}
          onChangeText={(text) => setForm({ ...form, company_vat_number: text })}
          placeholder="Company VAT Number"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.company_website : client.company_website}
          onChangeText={(text) => setForm({ ...form, company_website: text })}
          placeholder="Company Website"
          editable={isEditing}
        />
        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={handleUpdate}
            >
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ccc' }]}
              onPress={() => setIsEditing(false)}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => setIsEditing(true)}
            >
              <ThemedText style={styles.buttonText}>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff4444' }]}
              onPress={handleDelete}
            >
              <ThemedText style={styles.buttonText}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    paddingBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});