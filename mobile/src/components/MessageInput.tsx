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

  const onSubmit = () => {
    props.handleSubmit(value);
    setValue('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TextInput style={styles.input} onChangeText={text => setValue(text)} value={value} placeholder="Type here..." />
      <TouchableOpacity onPress={onSubmit}>
        <View style={styles.iconButton}>
          <FontAwesomeIcon style={styles.icon} icon={faPaperPlane} size={22} color={colors.white} />
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
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#292929',
    backgroundColor: '#292929',
    borderRadius: 20,
    color: 'white',
  },
  iconButton: {
    marginTop: 20,
    marginRight: 20,
  },
  icon: {
    // backgroundColor: colors.anonn_green,
    // padding: 30,
  },
});

export default MessageInput;
