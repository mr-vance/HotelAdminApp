import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Make sure this uses www to avoid redirects
const API_URL = 'https://www.milkandhoneybnb.com/api';

export default function NewClientScreen() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: '',
    company_name: '',
    company_address: '',
    company_vat_number: '',
    company_website: '',
  });
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleCreate = async () => {
    console.log('🔧 Submitting new client...');
    console.log('📦 Form data:', form);
    console.log('🌍 POST to:', `${API_URL}/clients`);

    if (!form.first_name || !form.email_address) {
      Alert.alert('Validation Error', 'First name and email address are required');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/clients`, form);

      console.log('✅ Response Status:', response.status);
      console.log('✅ Server Response:', response.data);

      if (response.data && response.data.client_id) {
        Alert.alert('Success', 'Client created successfully');
        router.back();
      } else {
        Alert.alert('Unexpected Response', 'The server did not return a valid client_id');
      }
    } catch (error) {
      console.error('❌ Error creating client:', error);
      if (error.response) {
        console.error('🔴 Server Error Status:', error.response.status);
        console.error('🔴 Server Error Data:', error.response.data);
        Alert.alert('Error', `Server error: ${error.response.status}`);
      } else {
        Alert.alert('Error', 'Failed to create client');
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.input}
          value={form.first_name}
          onChangeText={(text) => setForm({ ...form, first_name: text })}
          placeholder="First Name *"
        />
        <TextInput
          style={styles.input}
          value={form.last_name}
          onChangeText={(text) => setForm({ ...form, last_name: text })}
          placeholder="Last Name"
        />
        <TextInput
          style={styles.input}
          value={form.email_address}
          onChangeText={(text) => setForm({ ...form, email_address: text })}
          placeholder="Email Address *"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={form.phone_number}
          onChangeText={(text) => setForm({ ...form, phone_number: text })}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          value={form.company_name}
          onChangeText={(text) => setForm({ ...form, company_name: text })}
          placeholder="Company Name"
        />
        <TextInput
          style={styles.input}
          value={form.company_address}
          onChangeText={(text) => setForm({ ...form, company_address: text })}
          placeholder="Company Address"
        />
        <TextInput
          style={styles.input}
          value={form.company_vat_number}
          onChangeText={(text) => setForm({ ...form, company_vat_number: text })}
          placeholder="Company VAT Number"
        />
        <TextInput
          style={styles.input}
          value={form.company_website}
          onChangeText={(text) => setForm({ ...form, company_website: text })}
          placeholder="Company Website"
          keyboardType="url"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={handleCreate}
          >
            <ThemedText style={styles.buttonText}>Create</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ccc' }]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
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
