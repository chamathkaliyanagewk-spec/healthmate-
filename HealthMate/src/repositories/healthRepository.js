// healthRepository.js - ALL the SQL lives here (the CRUD operations).
// Screens and the store never write SQL; they call these functions instead.
// The "?" marks are placeholders - values are passed separately (safe from SQL injection).

import { getDb } from '../database/database';
import { fromRow } from '../models/HealthRecord';

// CREATE - add a new record
export async function insertRecord(record) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
    [record.date, record.steps, record.calories, record.water]
  );
}

// READ - get every record, newest first
export async function getAllRecords() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM health_records ORDER BY date DESC, id DESC'
  );
  return rows.map(fromRow);
}

// READ - get the records for one date (used for search/filter)
export async function getRecordsByDate(date) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM health_records WHERE date = ? ORDER BY id DESC',
    [date]
  );
  return rows.map(fromRow);
}

// READ - total steps, calories and water for one date (used by the dashboard)
export async function getTotalsForDate(date) {
  const db = await getDb();
  const row = await db.getFirstAsync(
    `SELECT COALESCE(SUM(steps), 0) AS steps,
            COALESCE(SUM(calories), 0) AS calories,
            COALESCE(SUM(water), 0) AS water
     FROM health_records WHERE date = ?`,
    [date]
  );
  return row;
}

// UPDATE - change an existing record
export async function updateRecord(record) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
    [record.date, record.steps, record.calories, record.water, record.id]
  );
}

// DELETE - remove a record
export async function deleteRecord(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM health_records WHERE id = ?', [id]);
}
