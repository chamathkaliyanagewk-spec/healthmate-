// AddEditRecordScreen.js - VIEW. One form used for BOTH adding and editing.
// If a "record" is passed in route.params we are editing, otherwise we are adding.
// The values are validated before they are saved.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useHealthStore } from '../store/useHealthStore';
import { validateRecord } from '../utils/validation';
import { createHealthRecord } from '../models/HealthRecord';
import { colors } from '../theme/theme';
import { displayDate, formatDate, getTodayString, parseDate } from '../utils/dateUtils';

export default function AddEditRecordScreen({ navigation, route }) {
  const existingRecord = route.params?.record; // undefined when adding
  const isEditing = existingRecord !== undefined;

  const addRecord = useHealthStore((state) => state.addRecord);
  const editRecord = useHealthStore((state) => state.editRecord);

  // Form values (kept as text because they come from TextInputs)
  const [date, setDate] = useState(isEditing ? existingRecord.date : getTodayString());
  const [steps, setSteps] = useState(isEditing ? String(existingRecord.steps) : '');
  const [calories, setCalories] = useState(isEditing ? String(existingRecord.calories) : '');
  const [water, setWater] = useState(isEditing ? String(existingRecord.water) : '');
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);

  function onDateChosen(event, selectedDate) {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(formatDate(selectedDate));
    }
  }

  async function handleSave() {
    // 1. Validate
    const foundErrors = validateRecord({ date, steps, calories, water });
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      return; // stop - show the errors on screen
    }

    // 2. Build the record object
    const record = createHealthRecord({
      id: isEditing ? existingRecord.id : null,
      date, steps, calories, water,
    });

    // 3. Save (add or update)
    const success = isEditing ? await editRecord(record) : await addRecord(record);

    // 4. Tell the user
    if (success) {
      Alert.alert('Saved', isEditing ? 'Record updated.' : 'Record added.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Something went wrong while saving. Please try again.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar" size={22} color={colors.primary} />
        <Text style={styles.dateText}>{displayDate(date)}</Text>
      </TouchableOpacity>
      {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}
      {showPicker ? (
        <DateTimePicker
          value={parseDate(date)}
          mode="date"
          maximumDate={new Date()}
          onChange={onDateChosen}
        />
      ) : null}

      {/* Steps */}
      <Text style={styles.label}>Steps walked</Text>
      <View style={styles.inputRow}>
        <Ionicons name="walk" size={24} color={colors.steps} />
        <TextInput
          style={styles.input}
          value={steps}
          onChangeText={setSteps}
          keyboardType="numeric"
          placeholder="e.g. 7850"
        />
      </View>
      {errors.steps ? <Text style={styles.error}>{errors.steps}</Text> : null}

      {/* Calories */}
      <Text style={styles.label}>Calories burned (kcal)</Text>
      <View style={styles.inputRow}>
        <Ionicons name="flame" size={24} color={colors.calories} />
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          placeholder="e.g. 420"
        />
      </View>
      {errors.calories ? <Text style={styles.error}>{errors.calories}</Text> : null}

      {/* Water */}
      <Text style={styles.label}>Water intake (ml)</Text>
      <View style={styles.inputRow}>
        <Ionicons name="water" size={24} color={colors.water} />
        <TextInput
          style={styles.input}
          value={water}
          onChangeText={setWater}
          keyboardType="numeric"
          placeholder="e.g. 2000"
        />
      </View>
      {errors.water ? <Text style={styles.error}>{errors.water}</Text> : null}

      {/* Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{isEditing ? 'Update record' : 'Save record'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 6 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
  },
  dateText: { marginLeft: 10, fontSize: 16, color: colors.text },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 16, padding: 14, color: colors.text },
  error: { color: colors.error, marginTop: 4 },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
});
