// validation.js - checks the form values before saving.
// Returns an object with an error message for each bad field.
// If the object is empty, everything is valid.

import { getTodayString } from './dateUtils';

// The most each field can be (stops silly values like 99999999)
const LIMITS = {
  steps: 100000,
  calories: 10000,
  water: 10000,
};

function checkNumber(value, label, max) {
  const text = String(value).trim();
  if (text === '') return `${label} is required`;
  if (!/^\d+$/.test(text)) return `${label} must be a whole number (no letters, decimals or minus sign)`;
  if (Number(text) > max) return `${label} cannot be more than ${max}`;
  return null;
}

export function validateRecord({ date, steps, calories, water }) {
  const errors = {};

  if (!date) {
    errors.date = 'Please choose a date';
  } else if (date > getTodayString()) {
    // "yyyy-MM-dd" text can be compared directly
    errors.date = 'Date cannot be in the future';
  }

  const stepsError = checkNumber(steps, 'Steps', LIMITS.steps);
  if (stepsError) errors.steps = stepsError;

  const caloriesError = checkNumber(calories, 'Calories', LIMITS.calories);
  if (caloriesError) errors.calories = caloriesError;

  const waterError = checkNumber(water, 'Water', LIMITS.water);
  if (waterError) errors.water = waterError;

  return errors;
}
