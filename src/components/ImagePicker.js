import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from '../context/AppContext';

const ImagePicker = ({ onImageSelected }) => {
  const { isDarkMode, isLoading } = useAppContext();

  const styles = getStyles(isDarkMode);

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to add an image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openImageLibrary },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.assets && response.assets[0]) {
        onImageSelected(response.assets[0].uri);
      }
    });
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        onImageSelected(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={showImagePicker}
        disabled={isLoading}
      >
        <Icon name="add-a-photo" size={32} color="#2196F3" />
        <Text style={styles.imageButtonTitle}>Add Image</Text>
        <Text style={styles.imageButtonSubtitle}>
          Capture or upload an image to extract text
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  imageButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? '#FFFFFF' : '#212121',
    marginTop: 8,
  },
  imageButtonSubtitle: {
    fontSize: 12,
    color: isDarkMode ? '#B0B0B0' : '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ImagePicker;