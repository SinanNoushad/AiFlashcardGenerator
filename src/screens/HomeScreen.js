import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';

const HomeScreen = ({ navigation }) => {
  const { stats, isDarkMode, getDueCards } = useAppContext();
  const dueCards = getDueCards();

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Flashcard Generator</Text>
          <ThemeToggle />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="library-books" size={30} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalCards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="schedule" size={30} color="#FF9800" />
            <Text style={styles.statNumber}>{dueCards.length}</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="check-circle" size={30} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.masteredCards}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.createButton]}
            onPress={() => navigation.navigate('Create')}
          >
            <Icon name="add-circle-outline" size={24} color="#FFF" />
            <Text style={styles.actionButtonText}>Create Flashcards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.studyButton]}
            onPress={() => navigation.navigate('Study')}
            disabled={dueCards.length === 0}
          >
            <Icon name="play-arrow" size={24} color="#FFF" />
            <Text style={styles.actionButtonText}>
              {dueCards.length > 0 ? `Study (${dueCards.length})` : 'No Cards Due'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Text style={styles.tip}>
            📚 Tip: Upload an image or paste text to generate flashcards automatically with AI!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#212121',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  studyButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentActivity: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginBottom: 12,
  },
  tip: {
    color: isDarkMode ? '#B0B0B0' : '#666666',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
});

export default HomeScreen;