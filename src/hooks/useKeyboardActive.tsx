import React from 'react';
import { Keyboard } from 'react-native';

const useKeyboardActive = () => {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
  }, []);

  return {
    keyboardVisible,
  };
};

export default useKeyboardActive;
