import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import StudyScreen from '../screens/StudyScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StudyStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="StudyHome" component={StudyScreen} options={{ title: 'Study' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isDarkMode } = useAppContext();

  const tabBarOptions = {
    activeTintColor: isDarkMode ? '#64B5F6' : '#1976D2',
    inactiveTintColor: isDarkMode ? '#9E9E9E' : '#757575',
    style: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
  };

  return (
    <Tab.Navigator tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={InputScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="add-circle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Study"
        component={StudyStack}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="school" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="analytics" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;