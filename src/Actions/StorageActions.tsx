import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserSession(
  key: string,
  value: string,
  onError?: Function
) {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    onError && onError(error);
  }
}

export async function retrieveUserSession(
  onSuccess: Function,
  onError?: Function
) {
  try {
    const session = await EncryptedStorage.getItem('user_session');

    if (session !== undefined) {
      onSuccess(session);
    }
  } catch (error) {
    onError && onError(error);
  }
}

export async function removeUserSession(key: string, onError?: Function) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    onError && onError(error);
  }
}

export async function clearStorage(onError?: Function) {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    onError && onError(error);
  }
}
