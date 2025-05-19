import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        Welcome to Hotel Admin
      </ThemedText>
      <ThemedText style={styles.subheading}>
        Manage clients, create quotes, and track invoices with ease.
      </ThemedText>

      <View style={styles.section}>
        <ThemedText type="subtitle">Quick Access</ThemedText>

        <Link href="/client/new" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="person.badge.plus" size={24} color="#fff" />
            <ThemedText style={styles.buttonText}>Create Client</ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/quote/new" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="doc.badge.plus" size={24} color="#fff" />
            <ThemedText style={styles.buttonText}>Create Quote</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#888',
  },
  section: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
