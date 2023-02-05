import { useEffect, useState } from 'react';
import {Keyboard} from 'react-native';

const useHandleKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => setKeyboardVisible(true),
      );
      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => setKeyboardVisible(false),
      );
  
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => setKeyboardVisible(true),
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => setKeyboardVisible(false),
      );
  
      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
  }, []);

  return keyboardVisible;
};

export default useHandleKeyboard;
