import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes`);
      const invoicedQuotes = response.data.filter(quote => quote.invoice_status === 'invoiced');
      setInvoices(invoicedQuotes);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Alert.alert('Error', 'Failed to load invoices');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    `${invoice.first_name} ${invoice.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    invoice.quote_number.toLowerCase().includes(search.toLowerCase())
  );

  const renderInvoice = ({ item }) => (
    <Link href={`/quote/${item.quote_id}`} asChild>
      <TouchableOpacity style={styles.invoiceItem}>
        <ThemedText type="defaultSemiBold">
          {item.first_name} {item.last_name}
        </ThemedText>
        <ThemedText>Invoice #{item.quote_number}</ThemedText>
        <ThemedText>Total: R{item.total}</ThemedText>
        <ThemedText>Last Modified: {new Date(item.last_modified).toLocaleDateString()}</ThemedText>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <TextInput
          style={[styles.searchInput, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          placeholder="Search invoices..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredInvoices}
          renderItem={renderInvoice}
          keyExtractor={item => item.quote_id.toString()}
          ListEmptyComponent={<ThemedText>No invoices found.</ThemedText>}
        />
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
  invoiceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
