// RecordItem.js - reusable row for the Records list.
// Shows the date and the three values, with edit and delete buttons.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import { displayDate } from '../utils/dateUtils';

export default function RecordItem({ record, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{displayDate(record.date)}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.valuesRow}>
        <View style={styles.valueBox}>
          <Ionicons name="walk" size={20} color={colors.steps} />
          <Text style={styles.valueText}>{record.steps.toLocaleString()} steps</Text>
        </View>
        <View style={styles.valueBox}>
          <Ionicons name="flame" size={20} color={colors.calories} />
          <Text style={styles.valueText}>{record.calories} kcal</Text>
        </View>
        <View style={styles.valueBox}>
          <Ionicons name="water" size={20} color={colors.water} />
          <Text style={styles.valueText}>{record.water} ml</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: { fontSize: 17, fontWeight: 'bold', color: colors.text },
  buttons: { flexDirection: 'row' },
  iconButton: { marginLeft: 14 },
  valuesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  valueBox: { flexDirection: 'row', alignItems: 'center' },
  valueText: { marginLeft: 5, fontSize: 14, color: colors.text },
});
