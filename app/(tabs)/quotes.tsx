import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes`);
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const filteredQuotes = quotes.filter(quote =>
    `${quote.first_name} ${quote.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    quote.quote_number.toLowerCase().includes(search.toLowerCase())
  );

  const renderQuote = ({ item }) => (
    <Link href={`/quote/${item.quote_id}`} asChild>
      <TouchableOpacity style={styles.quoteItem}>
        <ThemedText type="defaultSemiBold">
          {item.first_name} {item.last_name}
        </ThemedText>
        <ThemedText>Quote #{item.quote_number}</ThemedText>
        <ThemedText>Last Modified: {new Date(item.last_modified).toLocaleDateString()}</ThemedText>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.searchInput, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
        placeholder="Search quotes..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredQuotes}
        renderItem={renderQuote}
        keyExtractor={item => item.quote_id.toString()}
        ListEmptyComponent={<ThemedText>No quotes found.</ThemedText>}
      />
      <Link href="/quote/new" asChild>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <IconSymbol name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  quoteItem: {
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