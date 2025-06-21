import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../context/AppContext';
import { OpenAIService } from '../services/openaiService';
import { OCRService } from '../services/ocrService';
import ImagePicker from '../components/ImagePicker';

const InputScreen = ({ navigation }) => {
  const { addFlashcards, isDarkMode, dispatch } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const styles = getStyles(isDarkMode);

  const handleImageOCR = async (imageUri) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const text = await OCRService.extractTextFromImage(imageUri);
      setExtractedText(text);
      setInputText(text);
    } catch (error) {
      Alert.alert('OCR Error', 'Failed to extract text from image');
      console.error('OCR Error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generateFlashcards = async () => {
    const textToProcess = inputText.trim();
    
    if (!textToProcess) {
      Alert.alert('Input Required', 'Please enter some text or capture an image');
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const flashcards = await OpenAIService.generateFlashcards(textToProcess);
      
      if (flashcards && flashcards.length > 0) {
        await addFlashcards(flashcards);
        Alert.alert(
          'Success!',
          `Generated ${flashcards.length} flashcards`,
          [
            { text: 'Create More', style: 'cancel' },
            { 
              text: 'Study Now', 
              onPress: () => navigation.navigate('Study')
            }
          ]
        );
        setInputText('');
        setExtractedText('');
      } else {
        Alert.alert('No Cards Generated', 'Unable to create flashcards from the provided text');
      }
    } catch (error) {
      Alert.alert('Generation Error', 'Failed to generate flashcards. Please try again.');
      console.error('Generation Error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Flashcards</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Add Your Content</Text>
          
          <ImagePicker onImageSelected={handleImageOCR} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Paste or type your educational content here..."
            placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
            multiline
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />

          {extractedText ? (
            <View style={styles.extractedTextContainer}>
              <Text style={styles.extractedLabel}>Extracted from image:</Text>
              <Text style={styles.extractedText}>{extractedText}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.generateButton,
              (!inputText.trim()) && styles.generateButtonDisabled
            ]}
            onPress={generateFlashcards}
            disabled={!inputText.trim()}
          >
            <Icon name="auto-awesome" size={20} color="#FFF" />
            <Text style={styles.generateButtonText}>Generate Flashcards with AI</Text>
          </TouchableOpacity>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for better flashcards:</Text>
            <Text style={styles.tip}>• Provide clear, educational content</Text>
            <Text style={styles.tip}>• Include definitions, concepts, or facts</Text>
            <Text style={styles.tip}>• Images with text work great for OCR</Text>
            <Text style={styles.tip}>• The AI will create 5-10 cards automatically</Text>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: isDarkMode ? '#666666' : '#999999',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDarkMode ? '#FFFFFF' : '#212121',
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: isDarkMode ? '#333333' : '#E0E0E0',
  },
  extractedTextContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#F0F8FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  extractedLabel: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 4,
  },
  extractedText: {
    fontSize: 14,
    color: isDarkMode ? '#FFFFFF' : '#212121',
    lineHeight: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: isDarkMode ? '#333333' : '#CCCCCC',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDarkMode ? '#333333' : '#E0E0E0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginBottom: 8,
  },
  tip: {
    fontSize: 14,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default InputScreen;