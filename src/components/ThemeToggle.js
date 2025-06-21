import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../context/AppContext';

const ThemeToggle = () => {
  const { isDarkMode, dispatch } = useAppContext();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Icon
        name={isDarkMode ? 'light-mode' : 'dark-mode'}
        size={24}
        color={isDarkMode ? '#FFFFFF' : '#212121'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
  },
});

export default ThemeToggle;