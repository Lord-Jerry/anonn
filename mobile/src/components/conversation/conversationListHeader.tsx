import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowUpRightFromSquare, faMagnifyingGlass, faChevronLeft} from '@fortawesome/free-solid-svg-icons/';

import Text from '@components/text';
import Input from '@components/inputs';

import colors from '@constant/colors';
import screens from '@constant/screens';

export const ConversationListHeader = () => {
  const navigation = useNavigation();

  const handleGoToRequest = () => {
    navigation.navigate(screens.ConversationRequest as never);
  };

  return (
    <React.Fragment>
      <View style={conversationStyles.header}>
        <Text style={conversationStyles.title}>Chats</Text>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} color={colors.anonn_green} />
      </View>
      <View>
        <Input
          placeholder="Search"
          style={conversationStyles.searchInput}
          wrapperStyle={conversationStyles.searchInputWrapper}
          iconLeft={
            <FontAwesomeIcon
              style={conversationStyles.searchInputIcon}
              size={12}
              icon={faMagnifyingGlass}
              color="grey"
            />
          }
        />
      </View>

      <View style={conversationStyles.headerBtnWrapper}>
        <Pressable onPress={handleGoToRequest}>
          <Text style={conversationStyles.headerBtn}>Requests</Text>
        </Pressable>
        <Pressable>
          <Text style={conversationStyles.headerBtn}>Create group</Text>
        </Pressable>
      </View>
    </React.Fragment>
  );
};

export const ConversationRequestsHeader = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <React.Fragment>
      <View style={conversationRequestStyles.header}>
        <Pressable onPress={handleGoBack}>
          <FontAwesomeIcon icon={faChevronLeft} color={colors.anonn_green} />
        </Pressable>

        <Text style={conversationRequestStyles.title}>Requests</Text>
      </View>
      <View>
        <Input
          placeholder="Search"
          style={conversationRequestStyles.searchInput}
          wrapperStyle={conversationRequestStyles.searchInputWrapper}
          iconLeft={
            <FontAwesomeIcon
              style={conversationRequestStyles.searchInputIcon}
              size={12}
              icon={faMagnifyingGlass}
              color="grey"
            />
          }
        />
      </View>
    </React.Fragment>
  );
};

const conversationStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchInputWrapper: {
    borderBottomColor: '#1C1C1C',
    borderBottomWidth: 1,
    borderColor: '#1C1C1C',
    borderWidth: 1,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    marginTop: 20,
    height: 40,
  },
  searchInput: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    padding: 10,
    paddingLeft: 10,
  },
  searchInputIcon: {
    marginLeft: 25,
    marginTop: 14,
  },
  headerBtnWrapper: {
    marginTop: 20,
    // marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerBtn: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.anonn_green,
    lineHeight: 12.5,
  },
});

const conversationRequestStyles = StyleSheet.create({
  ...conversationStyles,
  header: {
    flexDirection: 'row',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
