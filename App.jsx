import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContextProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <AppNavigator />
        </NavigationContainer>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;