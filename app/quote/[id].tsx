import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import * as DocumentPicker from 'expo-document-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function QuoteDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [quote, setQuote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [selectedDates, setSelectedDates] = useState({
    breakfast: {},
    lunch: {},
    dinner: {},
    laundry: {},
  });
  const [showCalendar, setShowCalendar] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes?id=${id}`);
      if (response.data.error) {
        Alert.alert('Error', response.data.error);
        router.back();
        return;
      }
      setQuote(response.data);
      setForm({
        client_id: response.data.client_id,
        number_of_beds: response.data.number_of_beds.toString(),
        number_of_guests: response.data.number_of_guests.toString(),
        unit_bed_cost: response.data.unit_bed_cost.toString(),
        unit_breakfast_cost: response.data.unit_breakfast_cost.toString(),
        unit_lunch_cost: response.data.unit_lunch_cost.toString(),
        unit_dinner_cost: response.data.unit_dinner_cost.toString(),
        unit_laundry_cost: response.data.unit_laundry_cost.toString(),
        guest_details: response.data.guest_details,
        check_in_date: response.data.check_in_date,
        check_out_date: response.data.check_out_date,
        discount_percentage: response.data.discount_percentage.toString(),
        discount_amount: response.data.discount_amount.toString(),
        document_type: response.data.document_type,
        invoice_status: response.data.invoice_status,
      });
      setSelectedDates({
        breakfast: JSON.parse(response.data.breakfast_dates).reduce((acc, date) => ({ ...acc, [date]: { selected: true } }), {}),
        lunch: JSON.parse(response.data.lunch_dates).reduce((acc, date) => ({ ...acc, [date]: { selected: true } }), {}),
        dinner: JSON.parse(response.data.dinner_dates).reduce((acc, date) => ({ ...acc, [date]: { selected: true } }), {}),
        laundry: JSON.parse(response.data.laundry_dates).reduce((acc, date) => ({ ...acc, [date]: { selected: true } }), {}),
      });
      setAttachedFiles(JSON.parse(response.data.attached_documents));
    } catch (error) {
      console.error('Error fetching quote:', error);
      Alert.alert('Error', 'Failed to load quote');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedForm = {
        ...form,
        breakfast_dates: Object.keys(selectedDates.breakfast).filter(date => selectedDates.breakfast[date].selected),
        lunch_dates: Object.keys(selectedDates.lunch).filter(date => selectedDates.lunch[date].selected),
        dinner_dates: Object.keys(selectedDates.dinner).filter(date => selectedDates.dinner[date].selected),
        laundry_dates: Object.keys(selectedDates.laundry).filter(date => selectedDates.laundry[date].selected),
        attached_documents: attachedFiles,
      };
      await axios.put(`${API_URL}/quotes?id=${id}`, updatedForm);
      setQuote({ ...quote, ...updatedForm });
      setIsEditing(false);
      Alert.alert('Success', 'Quote updated successfully');
    } catch (error) {
      console.error('Error updating quote:', error);
      Alert.alert('Error', 'Failed to update quote');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this quote?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/quotes?id=${id}`);
            router.back();
          } catch (error) {
            console.error('Error deleting quote:', error);
            Alert.alert('Error', 'Failed to delete quote');
          }
        },
      },
    ]);
  };

  const handleInvoice = async () => {
    Alert.alert('Confirm Invoice', 'Mark this quote as invoiced?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Invoice',
        onPress: async () => {
          try {
            await axios.put(`${API_URL}/quotes?id=${id}`, { invoice_status: 'invoiced' });
            setQuote({ ...quote, invoice_status: 'invoiced' });
            setForm({ ...form, invoice_status: 'invoiced' });
            Alert.alert('Success', 'Quote marked as invoiced');
          } catch (error) {
            console.error('Error invoicing quote:', error);
            Alert.alert('Error', 'Failed to invoice quote');
          }
        },
      },
    ]);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      const formData = new FormData();
      formData.append('document', {
        uri: result[0].uri,
        name: result[0].name,
        type: result[0].type,
      });
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachedFiles([...attachedFiles, response.data]);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error uploading file:', error);
        Alert.alert('Error', 'Failed to upload file');
      }
    }
  };

  const toggleDate = (service, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        [date]: prev[service][date] ? {} : { selected: true },
      },
    }));
  };

  if (!quote) {
    return <ThemedView><ThemedText>Loading...</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="subtitle">
          Quote #{quote.quote_number} for {quote.first_name} {quote.last_name}
        </ThemedText>
        <TextInput
          style={styles.input}
          value={isEditing ? form.number_of_beds : quote.number_of_beds.toString()}
          onChangeText={text => setForm({ ...form, number_of_beds: text })}
          placeholder="Number of Beds"
          keyboardType="numeric"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.number_of_guests : quote.number_of_guests.toString()}
          onChangeText={text => setForm({ ...form, number_of_guests: text })}
          placeholder="Number of Guests"
          keyboardType="numeric"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.unit_bed_cost : quote.unit_bed_cost.toString()}
          onChangeText={text => setForm({ ...form, unit_bed_cost: text })}
          placeholder="Unit Bed Cost (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.unit_breakfast_cost : quote.unit_breakfast_cost.toString()}
          onChangeText={text => setForm({ ...form, unit_breakfast_cost: text })}
          placeholder="Unit Breakfast Cost (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.unit_lunch_cost : quote.unit_lunch_cost.toString()}
          onChangeText={text => setForm({ ...form, unit_lunch_cost: text })}
          placeholder="Unit Lunch Cost (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.unit_dinner_cost : quote.unit_dinner_cost.toString()}
          onChangeText={text => setForm({ ...form, unit_dinner_cost: text })}
          placeholder="Unit Dinner Cost (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.unit_laundry_cost : quote.unit_laundry_cost.toString()}
          onChangeText={text => setForm({ ...form, unit_laundry_cost: text })}
          placeholder="Unit Laundry Cost (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.guest_details : quote.guest_details}
          onChangeText={text => setForm({ ...form, guest_details: text })}
          placeholder="Guest Details"
          multiline
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.check_in_date : quote.check_in_date}
          onChangeText={text => setForm({ ...form, check_in_date: text })}
          placeholder="Check-in Date (YYYY-MM-DD)"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.check_out_date : quote.check_out_date}
          onChangeText={text => setForm({ ...form, check_out_date: text })}
          placeholder="Check-out Date (YYYY-MM-DD)"
          editable={isEditing}
        />
        {isEditing && (
          <>
            {['breakfast', 'lunch', 'dinner', 'laundry'].map(service => (
              <View key={service} style={styles.serviceSection}>
                <TouchableOpacity
                  style={styles.calendarButton}
                  onPress={() => setShowCalendar(showCalendar === service ? null : service)}
                >
                  <ThemedText>Select {service.charAt(0).toUpperCase() + service.slice(1)} Dates</ThemedText>
                </TouchableOpacity>
                {showCalendar === service && (
                  <Calendar
                    onDayPress={day => toggleDate(service, day.dateString)}
                    markedDates={selectedDates[service]}
                    minDate={form.check_in_date}
                    maxDate={form.check_out_date}
                  />
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <ThemedText>Upload Document</ThemedText>
            </TouchableOpacity>
            {attachedFiles.map(file => (
              <ThemedText key={file.filename}>{file.filename}</ThemedText>
            ))}
          </>
        )}
        <TextInput
          style={styles.input}
          value={isEditing ? form.discount_percentage : quote.discount_percentage.toString()}
          onChangeText={text => setForm({ ...form, discount_percentage: text })}
          placeholder="Discount Percentage"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          value={isEditing ? form.discount_amount : quote.discount_amount.toString()}
          onChangeText={text => setForm({ ...form, discount_amount: text })}
          placeholder="Discount Amount (ZAR)"
          keyboardType="decimal-pad"
          editable={isEditing}
        />
        <ThemedText>Subtotal: R{quote.subtotal}</ThemedText>
        <ThemedText>VAT (15%): R{quote.vat}</ThemedText>
        <ThemedText>Total: R{quote.total}</ThemedText>
        <ThemedText>Status: {quote.invoice_status}</ThemedText>
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
            {quote.invoice_status !== 'invoiced' && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4caf50' }]}
                onPress={handleInvoice}
              >
                <ThemedText style={styles.buttonText}>Invoice</ThemedText>
              </TouchableOpacity>
            )}
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
  serviceSection: {
    marginBottom: 16,
  },
  calendarButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});