// HealthRecord.js - the MODEL.
// Describes what one health record looks like. It matches the health_records table.

export function createHealthRecord({ id = null, date, steps, calories, water }) {
  return {
    id,                          // primary key (null until saved in the database)
    date,                        // text, "yyyy-MM-dd"
    steps: Number(steps),        // int
    calories: Number(calories),  // int (kcal)
    water: Number(water),        // int (ml)
  };
}

// Converts a row from the database into a HealthRecord object
export function fromRow(row) {
  return createHealthRecord(row);
}
