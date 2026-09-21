import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';

type Base = 2 | 8 | 10 | 16;

const BASES: { key: Base; label: string }[] = [
  { key: 2, label: 'Binary (2)' },
  { key: 8, label: 'Octal (8)' },
  { key: 10, label: 'Decimal (10)' },
  { key: 16, label: 'Hexadecimal (16)' },
];

export default function App() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [toBase, setToBase] = useState<Base>(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const [pickerFor, setPickerFor] = useState<'from' | 'to' | null>(null);

  const openPicker = (which: 'from' | 'to') => setPickerFor(which);

  const selectBase = (base: Base) => {
    if (pickerFor === 'from') setFromBase(base);
    if (pickerFor === 'to') setToBase(base);
    setPickerFor(null);
  };

  const convert = () => {
    setError('');
    setResult('');
    const value = input.trim();
    if (!value) {
      setError('Please enter a number');
      return;
    }
    const parsed = parseInt(value, fromBase);
    if (isNaN(parsed)) {
      setError(`Invalid ${BASES.find((b) => b.key === fromBase)?.label} number`);
      return;
    }
    setResult(parsed.toString(toBase).toUpperCase());
  };

  const labelFor = (base: Base) => BASES.find((b) => b.key === base)?.label ?? '';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Number Converter</Text>

        <Text style={styles.label}>From</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => openPicker('from')}
        >
          <Text style={styles.dropdownText}>{labelFor(fromBase)}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter number"
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <Text style={styles.label}>To</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => openPicker('to')}
        >
          <Text style={styles.dropdownText}>{labelFor(toBase)}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={convert}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        {result !== '' && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultValue}>{result}</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={pickerFor !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerFor(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerFor(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select {pickerFor === 'from' ? 'From' : 'To'} Base
            </Text>
            <FlatList
              data={BASES}
              keyExtractor={(item) => String(item.key)}
              renderItem={({ item }) => {
                const active =
                  (pickerFor === 'from' && fromBase === item.key) ||
                  (pickerFor === 'to' && toBase === item.key);
                return (
                  <TouchableOpacity
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => selectBase(item.key)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active && styles.optionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 8,
    marginTop: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#111827',
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    color: '#7C3AED',
  },
  input: {
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 16,
    backgroundColor: '#1E293B',
  },
  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#F87171',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  resultBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 6,
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.72)',
    justifyContent: 'center',
    padding: 32,
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 12,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  optionActive: {
    backgroundColor: '#312E81',
  },
  optionText: {
    fontSize: 15,
    color: '#E2E8F0',
  },
  optionTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});