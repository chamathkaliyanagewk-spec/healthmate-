# HealthMate - Personal Health and Wellness Tracker (React Native + Expo)

## Run it
1. Install Node.js, then in this folder run:  `npm install`
2. Install the Expo Go app on your Android phone.
3. Run `npx expo start` and scan the QR code with Expo Go.
   (SQLite works on a phone/emulator - do not test it in the web browser.)

## Build the release APK
1. In app.json change `android.package` to something unique, e.g. `com.yourname.healthmate`.
2. `npm install -g eas-cli`
3. `eas login`  (free Expo account)
4. `eas build -p android --profile preview`   (eas.json already sets buildType = apk)
5. Download the .apk from the link EAS gives you and upload it to Google Drive
   (Share > "Anyone with the link" > Viewer).

## Folder structure (MVVM-style, feature separated by layer)
```
App.js                          entry point: opens DB, sets up navigation
src/
  database/database.js          opens SQLite, creates health_records table, dummy data
  models/HealthRecord.js        MODEL - what a record looks like
  repositories/healthRepository.js   all SQL / CRUD (insert, read, update, delete)
  store/useHealthStore.js       STATE MANAGEMENT (Zustand) = ViewModel
  screens/                      VIEWS - Dashboard, RecordList, AddEditRecord
  components/                   reusable UI pieces - SummaryCard, RecordItem
  theme/theme.js                colours (water blue, calories red, steps green)
  utils/                        dateUtils.js, validation.js
```
Data flow:  Screen -> Store -> Repository -> Database (SQLite)
