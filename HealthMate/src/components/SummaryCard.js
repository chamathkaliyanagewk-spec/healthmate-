// SummaryCard.js - reusable card used on the Dashboard (one for steps, calories, water).
// Props: icon name, label, value, unit and colour.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

export default function SummaryCard({ icon, label, value, unit, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#FFFFFF" />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {Number(value).toLocaleString()} <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: 16,
    marginBottom: 14,
    elevation: 2, // shadow on Android
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textBox: { flex: 1 },
  label: { fontSize: 15, color: colors.subText },
  value: { fontSize: 26, fontWeight: 'bold' },
  unit: { fontSize: 15, fontWeight: 'normal', color: colors.subText },
});
