import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Directory for storing user images
const IMAGE_DIRECTORY = `${FileSystem.documentDirectory}images/`;

// Ensure the images directory exists
export const ensureDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIRECTORY, { intermediates: true });
  }
};

// Request permissions for camera and media library
export const requestMediaPermissions = async (): Promise<boolean> => {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return cameraPermission.granted && mediaLibraryPermission.granted;
};

// Pick an image from the media library
export const pickImage = async (): Promise<string | undefined> => {
  try {
    await ensureDirectoryExists();
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const savedUri = await saveImage(selectedAsset.uri);
      return savedUri;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error picking image:', error);
    return undefined;
  }
};

// Take a photo with the camera
export const takePhoto = async (): Promise<string | undefined> => {
  try {
    await ensureDirectoryExists();
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const savedUri = await saveImage(selectedAsset.uri);
      return savedUri;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error taking photo:', error);
    return undefined;
  }
};

// Save image to app's file system
export const saveImage = async (uri: string): Promise<string> => {
  try {
    await ensureDirectoryExists();
    
    const fileName = `profile_${Date.now()}.jpg`;
    const destinationUri = `${IMAGE_DIRECTORY}${fileName}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: destinationUri,
    });
    
    // Save the reference to AsyncStorage
    await AsyncStorage.setItem('profileImageUri', destinationUri);
    
    return destinationUri;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

// Get the saved profile image URI
export const getProfileImage = async (): Promise<string | null> => {
  try {
    const imageUri = await AsyncStorage.getItem('profileImageUri');
    
    if (imageUri) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        return imageUri;
      }
      // If file doesn't exist, clear the reference
      await AsyncStorage.removeItem('profileImageUri');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile image:', error);
    return null;
  }
};

// Delete a profile image
export const deleteProfileImage = async (): Promise<void> => {
  try {
    const imageUri = await AsyncStorage.getItem('profileImageUri');
    
    if (imageUri) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri);
      }
      await AsyncStorage.removeItem('profileImageUri');
    }
  } catch (error) {
    console.error('Error deleting profile image:', error);
    throw error;
  }
};
