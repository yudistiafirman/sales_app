import React from "react";
import { Keyboard, KeyboardEvent } from "react-native";

const useKeyboardActive = () => {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState<number>(0);

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
  }, []);

  return {
    keyboardHeight,
    keyboardVisible,
  };
};

export default useKeyboardActive;
