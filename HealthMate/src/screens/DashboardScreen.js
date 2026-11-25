// DashboardScreen.js - VIEW. Shows today's summary (steps, calories, water).
// The numbers come from the store (todayTotals), which gets them from SQLite.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SummaryCard from '../components/SummaryCard';
import { useHealthStore } from '../store/useHealthStore';
import { colors } from '../theme/theme';
import { displayDate, getTodayString } from '../utils/dateUtils';

export default function DashboardScreen({ navigation }) {
  const todayTotals = useHealthStore((state) => state.todayTotals);
  const error = useHealthStore((state) => state.error);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.date}>{displayDate(getTodayString())}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <SummaryCard
        icon="walk"
        label="Steps"
        value={todayTotals.steps}
        unit="steps"
        color={colors.steps}
      />
      <SummaryCard
        icon="flame"
        label="Calories burned"
        value={todayTotals.calories}
        unit="kcal"
        color={colors.calories}
      />
      <SummaryCard
        icon="water"
        label="Water intake"
        value={todayTotals.water}
        unit="ml"
        color={colors.water}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditRecord')}
      >
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add a record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text },
  date: { fontSize: 16, color: colors.subText, marginBottom: 20 },
  error: { color: colors.error, marginBottom: 10 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold', marginLeft: 8 },
});
