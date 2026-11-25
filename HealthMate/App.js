// App.js - the entry point.
// 1. Opens the database and loads the data when the app starts.
// 2. Sets up navigation: bottom tabs (Dashboard, Records) + a form screen on top.

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { initDatabase } from './src/database/database';
import { useHealthStore } from './src/store/useHealthStore';
import DashboardScreen from './src/screens/DashboardScreen';
import RecordListScreen from './src/screens/RecordListScreen';
import AddEditRecordScreen from './src/screens/AddEditRecordScreen';
import { colors } from './src/theme/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// The two main screens with a tab bar at the bottom
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Dashboard' ? 'home' : 'list';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Records" component={RecordListScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [startupError, setStartupError] = useState(null);
  const loadData = useHealthStore((state) => state.loadData);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase(); // create table + dummy data
        await loadData();     // read data into the store
        setReady(true);
      } catch (e) {
        console.log('Startup error:', e);
        setStartupError('The database could not be opened.');
      }
    }
    setup();
  }, []);

  if (startupError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{startupError}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#FFFFFF',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddEditRecord"
          component={AddEditRecordScreen}
          options={({ route }) => ({
            title: route.params?.record ? 'Edit Record' : 'Add Record',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
