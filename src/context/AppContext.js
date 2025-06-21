import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService';

const AppContext = createContext();

const initialState = {
  flashcards: [],
  currentCard: null,
  isDarkMode: false,
  isLoading: false,
  stats: {
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    studyStreak: 0,
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FLASHCARDS':
      return { ...state, flashcards: action.payload };
    case 'ADD_FLASHCARDS':
      return { ...state, flashcards: [...state.flashcards, ...action.payload] };
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.map(card =>
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      await DatabaseService.initDatabase();
      await loadFlashcards();
      await updateStats();
    };
    initialize();
  }, []);

  const loadFlashcards = async () => {
    try {
      const cards = await DatabaseService.getAllFlashcards();
      dispatch({ type: 'SET_FLASHCARDS', payload: cards });
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const updateStats = async () => {
    try {
      const stats = await DatabaseService.getStats();
      dispatch({ type: 'UPDATE_STATS', payload: stats });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const addFlashcards = async (cards) => {
    try {
      const savedCards = await DatabaseService.saveFlashcards(cards);
      dispatch({ type: 'ADD_FLASHCARDS', payload: savedCards });
      updateStats();
    } catch (error) {
      console.error('Error adding flashcards:', error);
    }
  };

  const updateFlashcard = async (card) => {
    try {
      await DatabaseService.updateFlashcard(card);
      dispatch({ type: 'UPDATE_FLASHCARD', payload: card });
      updateStats();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const getDueCards = () => {
    const now = new Date();
    return state.flashcards.filter(card => new Date(card.nextReview) <= now);
  };

  const value = {
    ...state,
    dispatch,
    addFlashcards,
    updateFlashcard,
    getDueCards,
    updateStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};