import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../context/AppContext';
import { SpacedRepetitionService } from '../utils/spacedRepetition';
import { TTSService } from '../services/ttsService';

const { width } = Dimensions.get('window');

const FlashcardViewer = ({ card, onNext, totalCards, currentIndex }) => {
  const { updateFlashcard, isDarkMode } = useAppContext();
  const [showAnswer, setShowAnswer] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const styles = getStyles(isDarkMode);

  useEffect(() => {
    setShowAnswer(false);
    flipAnimation.setValue(0);
  }, [card]);

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: showAnswer ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = async (difficulty) => {
    const updatedCard = SpacedRepetitionService.updateCard(card, difficulty);
    await updateFlashcard(updatedCard);
    setShowAnswer(false);
    flipAnimation.setValue(0);
    onNext();
  };

  const speakText = (text) => {
    TTSService.speak(text);
  };

  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>Question</Text>
            <TouchableOpacity
              onPress={() => speakText(card.question)}
              style={styles.speakButton}
            >
              <Icon name="volume-up" size={20} color={isDarkMode ? '#FFFFFF' : '#212121'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardText}>{card.question}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>Answer</Text>
            <TouchableOpacity
              onPress={() => speakText(card.answer)}
              style={styles.speakButton}
            >
              <Icon name="volume-up" size={20} color={isDarkMode ? '#FFFFFF' : '#212121'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardText}>{card.answer}</Text>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
        <Icon name="flip" size={24} color="#FFFFFF" />
        <Text style={styles.flipButtonText}>
          {showAnswer ? 'Show Question' : 'Show Answer'}
        </Text>
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.answerButtons}>
          <Text style={styles.rateText}>How did you do?</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.answerButton, styles.againButton]}
              onPress={() => handleAnswer('again')}
            >
              <Icon name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.answerButton, styles.goodButton]}
              onPress={() => handleAnswer('good')}
            >
              <Icon name="thumb-up" size={20} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>Good</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.answerButton, styles.easyButton]}
              onPress={() => handleAnswer('easy')}
            >
              <Icon name="star" size={20} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>Easy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.progressIndicator}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / totalCards) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalCards}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardContainer: {
    height: 300,
    marginBottom: 30,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  },
  cardBack: {
    backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  speakButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: isDarkMode ? '#333333' : '#F0F0F0',
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
    color: isDarkMode ? '#FFFFFF' : '#212121',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
    gap: 8,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  answerButtons: {
    marginBottom: 20,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  againButton: {
    backgroundColor: '#F44336',
  },
  goodButton: {
    backgroundColor: '#FF9800',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    fontWeight: '500',
  },
});

export default FlashcardViewer;