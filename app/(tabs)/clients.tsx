import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    client.email_address.toLowerCase().includes(search.toLowerCase())
  );

  const renderClient = ({ item }) => (
    <Link href={`/client/${item.client_id}`} asChild>
      <TouchableOpacity style={styles.clientItem}>
        <ThemedText type="defaultSemiBold">
          {item.first_name} {item.last_name}
        </ThemedText>
        <ThemedText>{item.email_address}</ThemedText>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <TextInput
          style={[styles.searchInput, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          placeholder="Search clients..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={item => item.client_id.toString()}
          ListEmptyComponent={<ThemedText>No clients found.</ThemedText>}
        />
        <Link href="/client/new" asChild>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  clientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
