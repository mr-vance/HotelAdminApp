import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_URL = 'https://milkandhoneybnb.com/api';

export default function NewQuoteScreen() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    client_id: '',
    number_of_beds: '',
    number_of_guests: '',
    unit_bed_cost: '',
    unit_breakfast_cost: '0',
    unit_lunch_cost: '0',
    unit_dinner_cost: '0',
    unit_laundry_cost: '0',
    guest_details: '',
    check_in_date: '',
    check_out_date: '',
    discount_percentage: '0',
    discount_amount: '0',
    document_type: 'detailed',
  });
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
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
      if (response.data.length > 0) {
        setForm(prev => ({ ...prev, client_id: response.data[0].client_id.toString() }));
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      Alert.alert('Error', 'Failed to load clients');
    }
  };

  const handleCreate = async () => {
    if (!form.client_id || !form.number_of_beds || !form.number_of_guests ||
        !form.unit_bed_cost || !form.check_in_date || !form.check_out_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      const newQuote = {
        ...form,
        breakfast_dates: Object.keys(selectedDates.breakfast).filter(date => selectedDates.breakfast[date].selected),
        lunch_dates: Object.keys(selectedDates.lunch).filter(date => selectedDates.lunch[date].selected),
        dinner_dates: Object.keys(selectedDates.dinner).filter(date => selectedDates.dinner[date].selected),
        laundry_dates: Object.keys(selectedDates.laundry).filter(date => selectedDates.laundry[date].selected),
        attached_documents: attachedFiles,
      };
      await axios.post(`${API_URL}/quotes`, newQuote);
      router.back();
      Alert.alert('Success', 'Quote created successfully');
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote');
    }
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

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Picker
          selectedValue={form.client_id}
          onValueChange={value => setForm({ ...form, client_id: value })}
          style={styles.picker}
        >
          {clients.map(client => (
            <Picker.Item
              key={client.client_id}
              label={`${client.first_name} ${client.last_name}`}
              value={client.client_id.toString()}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          value={form.number_of_beds}
          onChangeText={text => setForm({ ...form, number_of_beds: text })}
          placeholder="Number of Beds *"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={form.number_of_guests}
          onChangeText={text => setForm({ ...form, number_of_guests: text })}
          placeholder="Number of Guests *"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={form.unit_bed_cost}
          onChangeText={text => setForm({ ...form, unit_bed_cost: text })}
          placeholder="Unit Bed Cost (ZAR) *"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.unit_breakfast_cost}
          onChangeText={text => setForm({ ...form, unit_breakfast_cost: text })}
          placeholder="Unit Breakfast Cost (ZAR)"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.unit_lunch_cost}
          onChangeText={text => setForm({ ...form, unit_lunch_cost: text })}
          placeholder="Unit Lunch Cost (ZAR)"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.unit_dinner_cost}
          onChangeText={text => setForm({ ...form, unit_dinner_cost: text })}
          placeholder="Unit Dinner Cost (ZAR)"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.unit_laundry_cost}
          onChangeText={text => setForm({ ...form, unit_laundry_cost: text })}
          placeholder="Unit Laundry Cost (ZAR)"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.guest_details}
          onChangeText={text => setForm({ ...form, guest_details: text })}
          placeholder="Guest Details"
          multiline
        />
        <TextInput
          style={styles.input}
          value={form.check_in_date}
          onChangeText={text => setForm({ ...form, check_in_date: text })}
          placeholder="Check-in Date (YYYY-MM-DD) *"
        />
        <TextInput
          style={styles.input}
          value={form.check_out_date}
          onChangeText={text => setForm({ ...form, check_out_date: text })}
          placeholder="Check-out Date (YYYY-MM-DD) *"
        />
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
        <TextInput
          style={styles.input}
          value={form.discount_percentage}
          onChangeText={text => setForm({ ...form, discount_percentage: text })}
          placeholder="Discount Percentage"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={form.discount_amount}
          onChangeText={text => setForm({ ...form, discount_amount: text })}
          placeholder="Discount Amount (ZAR)"
          keyboardType="decimal-pad"
        />
        <Picker
          selectedValue={form.document_type}
          onValueChange={value => setForm({ ...form, document_type: value })}
          style={styles.picker}
        >
          <Picker.Item label="Detailed" value="detailed" />
          <Picker.Item label="Summarized" value="summarized" />
        </Picker>
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
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