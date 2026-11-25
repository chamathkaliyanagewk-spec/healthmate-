// useHealthStore.js - STATE MANAGEMENT (Zustand) - this acts as the "ViewModel".
// It keeps the data the screens need (records, today's totals, search date)
// and has actions that call the repository, then refresh the data.
// When the data changes, every screen using the store updates automatically.

import { create } from 'zustand';
import {
  insertRecord,
  getAllRecords,
  getRecordsByDate,
  getTotalsForDate,
  updateRecord,
  deleteRecord,
} from '../repositories/healthRepository';
import { getTodayString } from '../utils/dateUtils';

export const useHealthStore = create((set, get) => ({
  // ----- state (data) -----
  records: [],                                  // list shown on the Records screen
  todayTotals: { steps: 0, calories: 0, water: 0 }, // numbers shown on the Dashboard
  searchDate: null,                             // "yyyy-MM-dd" or null (null = show all)
  loading: false,
  error: null,

  // ----- actions -----

  // Reads records + today's totals from the database
  loadData: async () => {
    set({ loading: true, error: null });
    try {
      const { searchDate } = get();
      const records = searchDate
        ? await getRecordsByDate(searchDate)
        : await getAllRecords();
      const todayTotals = await getTotalsForDate(getTodayString());
      set({ records, todayTotals, loading: false });
    } catch (e) {
      console.log('loadData error:', e);
      set({ loading: false, error: 'Could not load records. Please try again.' });
    }
  },

  // Filter the list by a date (pass null to clear the filter)
  setSearchDate: async (date) => {
    set({ searchDate: date });
    await get().loadData();
  },

  // Each action below returns true if it worked, false if it failed
  addRecord: async (record) => {
    try {
      await insertRecord(record);
      await get().loadData();
      return true;
    } catch (e) {
      console.log('addRecord error:', e);
      set({ error: 'Could not save the record.' });
      return false;
    }
  },

  editRecord: async (record) => {
    try {
      await updateRecord(record);
      await get().loadData();
      return true;
    } catch (e) {
      console.log('editRecord error:', e);
      set({ error: 'Could not update the record.' });
      return false;
    }
  },

  removeRecord: async (id) => {
    try {
      await deleteRecord(id);
      await get().loadData();
      return true;
    } catch (e) {
      console.log('removeRecord error:', e);
      set({ error: 'Could not delete the record.' });
      return false;
    }
  },
}));
