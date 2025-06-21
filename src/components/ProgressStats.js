import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';

const ProgressStats = () => {
  const { stats, isDarkMode } = useAppContext();

  const styles = getStyles(isDarkMode);

  const getCompletionRate = () => {
    if (stats.totalCards === 0) return 0;
    return ((stats.masteredCards / stats.totalCards) * 100).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalCards}</Text>
        <Text style={styles.statLabel}>Total Cards</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.masteredCards}</Text>
        <Text style={styles.statLabel}>Mastered</Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{getCompletionRate()}%</Text>
        <Text style={styles.statLabel}>Completion</Text>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#212121',
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    marginTop: 4,
  },
});

export default ProgressStats;