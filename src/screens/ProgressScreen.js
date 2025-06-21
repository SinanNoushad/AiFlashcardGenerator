import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import ProgressStats from '../components/ProgressStats';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProgressScreen = () => {
  const { stats, flashcards, isDarkMode } = useAppContext();

  const styles = getStyles(isDarkMode);

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  const getMasteryPercentage = () => {
    if (stats.totalCards === 0) return 0;
    return Math.round((stats.masteredCards / stats.totalCards) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
        </View>

        <ProgressStats />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Streak</Text>
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmoji}>{getStreakEmoji(stats.studyStreak)}</Text>
            <Text style={styles.streakNumber}>{stats.studyStreak}</Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mastery Overview</Text>
          <View style={styles.masteryContainer}>
            <View style={styles.masteryProgressBar}>
              <View 
                style={[
                  styles.masteryProgressFill,
                  { width: `${getMasteryPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.masteryText}>
              {getMasteryPercentage()}% mastered ({stats.masteredCards}/{stats.totalCards})
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatItem}>
              <Icon name="today" size={24} color="#FF9800" />
              <Text style={styles.quickStatNumber}>{stats.dueCards}</Text>
              <Text style={styles.quickStatLabel}>Due Today</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Icon name="library-books" size={24} color="#4CAF50" />
              <Text style={styles.quickStatNumber}>{stats.totalCards}</Text>
              <Text style={styles.quickStatLabel}>Total Cards</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Icon name="check-circle" size={24} color="#2196F3" />
              <Text style={styles.quickStatNumber}>{stats.masteredCards}</Text>
              <Text style={styles.quickStatLabel}>Mastered</Text>
            </View>
            
            <View style={styles.quickStatItem}>
              <Icon name="schedule" size={24} color="#9C27B0" />
              <Text style={styles.quickStatNumber}>
                {stats.totalCards - stats.masteredCards}
              </Text>
              <Text style={styles.quickStatLabel}>Learning</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
          <View style={styles.badgesContainer}>
            {stats.totalCards >= 10 && (
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>📚</Text>
                <Text style={styles.badgeText}>Collector</Text>
              </View>
            )}
            {stats.studyStreak >= 7 && (
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🔥</Text>
                <Text style={styles.badgeText}>On Fire</Text>
              </View>
            )}
            {stats.masteredCards >= 5 && (
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🎓</Text>
                <Text style={styles.badgeText}>Scholar</Text>
              </View>
            )}
            {getMasteryPercentage() >= 80 && (
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>⭐</Text>
                <Text style={styles.badgeText}>Expert</Text>
              </View>
            )}
          </View>
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
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  streakEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginRight: 8,
  },
  streakLabel: {
    fontSize: 16,
    color: isDarkMode ? '#B0B0B0' : '#666666',
  },
  masteryContainer: {
    alignItems: 'center',
  },
  masteryProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  masteryProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  masteryText: {
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#212121',
    fontWeight: '500',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 8,
    marginBottom: 12,
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    marginTop: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 80,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: isDarkMode ? '#FFFFFF' : '#212121',
    fontWeight: '500',
  },
});

export default ProgressScreen;