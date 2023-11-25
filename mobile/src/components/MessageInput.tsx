import React, {useState} from 'react';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TextInput, StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import colors from '../constant/colors';

type Props = {
  handleSubmit: (text: string) => void;
};

const MessageInput = (props: Props) => {
  const [value, setValue] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const isButtonDisabled = value.trim().length === 0;

  const onSubmit = () => {
    setValue('');
    setInputHeight(40);
    props.handleSubmit(value.trim());
  };

  const handleContentSizeChange = (event: {nativeEvent: {contentSize: {height: React.SetStateAction<number>}}}) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TextInput
        multiline
        value={value}
        placeholder="Type here..."
        placeholderTextColor={colors.grey}
        onChangeText={text => setValue(text)}
        onContentSizeChange={handleContentSizeChange}
        style={[styles.input, {height: Math.max(40, inputHeight)}]}
      />
      <TouchableOpacity onPress={onSubmit} disabled={isButtonDisabled}>
        <View style={styles.iconButton}>
          <FontAwesomeIcon
            size={22}
            style={styles.icon}
            icon={faPaperPlane}
            color={isButtonDisabled ? colors.grey : colors.white}
          />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#292929',
    backgroundColor: '#292929',
    borderRadius: 20,
    color: 'white',
  },
  iconButton: {
    alignItems: 'center',
    marginTop: 20,
    marginRight: 20,
  },
  icon: {},
});

export default MessageInput;
