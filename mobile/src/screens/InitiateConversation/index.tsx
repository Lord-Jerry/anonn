import {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Platform,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import colors from 'constant/colors';
import Layout from 'components/layout';
import {useInitiateConversation} from 'hooks/useInitiateConversation';

type Props = {
  route: {
    params: {
      participantId: string;
    };
  };
};

const InitiateConversationScreen = (props: Props) => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {initiateConversation} = useInitiateConversation(props.route.params.participantId);

  const handleSendMessage = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      await initiateConversation(text);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <Layout>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable onPress={navigation.goBack}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          {isLoading && <ActivityIndicator />}
          <Pressable onPress={handleSendMessage} style={[styles.button, !text ? styles.disabledButton : null]}>
            <Text>Send</Text>
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            autoFocus={true}
            value={text}
            onChangeText={setText}
            placeholder="Type your message here...."
            multiline
            numberOfLines={5}
            style={styles.input}
            keyboardAppearance="dark"
            placeholderTextColor={colors.grey}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.anonn_green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  disabledButton: {
    backgroundColor: colors.grey,
  },
  cancelText: {
    color: colors.white,
    fontSize: 18,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: 500,
    color: colors.light_grey,
  },
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default InitiateConversationScreen;
