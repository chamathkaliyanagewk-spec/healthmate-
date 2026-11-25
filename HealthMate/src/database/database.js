// database.js - opens the SQLite database, creates the table and adds dummy data.
// Uses the expo-sqlite package (the React Native/Expo way of using SQLite).

import * as SQLite from 'expo-sqlite';
import { daysAgoString } from '../utils/dateUtils';

let db = null; // we only open the database once and reuse it

// Returns the open database (opens it the first time)
export async function getDb() {
  if (db === null) {
    db = await SQLite.openDatabaseAsync('healthmate.db');
  }
  return db;
}

// Called once when the app starts
export async function initDatabase() {
  const database = await getDb();

  // Table required by the coursework: health_records(id, date, steps, calories, water)
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      steps INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      water INTEGER NOT NULL
    );
  `);

  // Add dummy records only if the table is empty
  const row = await database.getFirstAsync('SELECT COUNT(*) AS count FROM health_records');
  if (row.count === 0) {
    await insertDummyData(database);
  }
}

// Dummy records for testing: today and the last 6 days
async function insertDummyData(database) {
  const dummy = [
    [daysAgoString(0), 7850, 420, 2000],
    [daysAgoString(1), 10200, 560, 2500],
    [daysAgoString(2), 6400, 340, 1800],
    [daysAgoString(3), 8900, 480, 2200],
    [daysAgoString(4), 12000, 650, 2800],
    [daysAgoString(5), 5300, 290, 1500],
    [daysAgoString(6), 9100, 500, 2100],
  ];

  for (const item of dummy) {
    await database.runAsync(
      'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
      item
    );
  }
}
