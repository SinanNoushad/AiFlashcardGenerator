import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import FlashcardViewer from '../components/FlashcardViewer';

const StudyScreen = () => {
  const { getDueCards, isDarkMode } = useAppContext();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dueCards, setDueCards] = useState([]);

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const cards = getDueCards();
    setDueCards(cards);
    setCurrentCardIndex(0);
  }, []);

  const handleNextCard = () => {
    const updatedDueCards = getDueCards();
    setDueCards(updatedDueCards);
    
    if (currentCardIndex < updatedDueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  if (dueCards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>🎉 Great job!</Text>
          <Text style={styles.emptyText}>
            No flashcards are due for review right now.
          </Text>
          <Text style={styles.emptySubtext}>
            Come back later or create new flashcards to study.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Session</Text>
        <Text style={styles.progress}>
          {currentCardIndex + 1} of {dueCards.length}
        </Text>
      </View>
      
      <FlashcardViewer
        card={dueCards[currentCardIndex]}
        onNext={handleNextCard}
        totalCards={dueCards.length}
        currentIndex={currentCardIndex}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
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
  progress: {
    fontSize: 16,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StudyScreen;