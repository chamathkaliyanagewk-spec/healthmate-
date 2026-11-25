// RecordListScreen.js - VIEW. Shows all past records and lets the user
// search by date, edit a record or delete a record.

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import RecordItem from '../components/RecordItem';
import { useHealthStore } from '../store/useHealthStore';
import { colors } from '../theme/theme';
import { displayDate, formatDate, parseDate } from '../utils/dateUtils';

export default function RecordListScreen({ navigation }) {
  const records = useHealthStore((state) => state.records);
  const searchDate = useHealthStore((state) => state.searchDate);
  const error = useHealthStore((state) => state.error);
  const setSearchDate = useHealthStore((state) => state.setSearchDate);
  const removeRecord = useHealthStore((state) => state.removeRecord);

  const [showPicker, setShowPicker] = useState(false);

  // Called when the user picks (or cancels) a date in the date picker
  function onDateChosen(event, selectedDate) {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setSearchDate(formatDate(selectedDate)); // filter the list by this date
    }
  }

  // Ask before deleting
  function confirmDelete(record) {
    Alert.alert(
      'Delete record',
      `Delete the record for ${displayDate(record.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeRecord(record.id) },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.searchButton} onPress={() => setShowPicker(true)}>
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.searchButtonText}>
            {searchDate ? displayDate(searchDate) : 'Search by date'}
          </Text>
        </TouchableOpacity>

        {searchDate ? (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchDate(null)}>
            <Ionicons name="close-circle" size={20} color={colors.primary} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {showPicker ? (
        <DateTimePicker
          value={searchDate ? parseDate(searchDate) : new Date()}
          mode="date"
          maximumDate={new Date()}
          onChange={onDateChosen}
        />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* List of records */}
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <RecordItem
            record={item}
            onEdit={() => navigation.navigate('AddEditRecord', { record: item })}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchDate ? 'No records found for this date.' : 'No records yet. Tap + to add one.'}
          </Text>
        }
      />

      {/* Add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditRecord')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 12,
  },
  searchButtonText: { color: '#FFFFFF', fontSize: 16, marginLeft: 8 },
  clearButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  clearText: { color: colors.primary, marginLeft: 4, fontSize: 16 },
  error: { color: colors.error, paddingHorizontal: 14 },
  listContent: { padding: 14, paddingBottom: 90 },
  emptyText: { textAlign: 'center', color: colors.subText, marginTop: 40, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
