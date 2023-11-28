import Clipboard from '@react-native-community/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const useCopyToClipboard = () => {
  const copyToClipboard = async (text: string) => {
    Clipboard.setString(text);
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactMedium', options);
  };

  return copyToClipboard;
};

export default useCopyToClipboard;
