const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearStorage() {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage has been cleared!');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
}

clearStorage();
