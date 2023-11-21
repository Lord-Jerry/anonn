import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowUpRightFromSquare, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/';

import Layout from '@components/layout';
import Text from '@components/text';
import Input from '@components/inputs';
import Conversation from '@components/conversation';

import avatars from '@constant/avatars';
import colors from '@constant/colors';

const {width} = Dimensions.get('window');

const ConversationListHeader = () => (
  <React.Fragment>
    <View style={styles.header}>
      <Text style={styles.title}>Chats</Text>
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare}
        color={colors.anonn_green}
      />
    </View>
    <View>
      <Input
        placeholder="Search"
        style={styles.searchInput}
        wrapperStyle={styles.searchInputWrapper}
        iconLeft={
          <FontAwesomeIcon
            style={styles.searchInputIcon}
            size={12}
            icon={faMagnifyingGlass}
            color="grey"
          />
        }
      />
    </View>

    <View style={styles.headerBtnWrapper}>
      <Pressable>
        <Text style={styles.headerBtn}>Requests</Text>
      </Pressable>
      <Pressable>
        <Text style={styles.headerBtn}>Create group</Text>
      </Pressable>
    </View>
  </React.Fragment>
);

const Conversations = () => {
  const avatarKeys = Object.keys(avatars) as Array<keyof typeof avatars>;
  const conversations = Array(Math.floor(Math.random() * 10)).fill(1);
  return (
    <Layout>
      <FlatList
        style={styles.container}
        ListFooterComponent={<View style={{height: 100}} />}
        ListHeaderComponent={<ConversationListHeader />}
        data={conversations}
        renderItem={({item}) => (
          <Conversation
            msgCount={Math.floor(Math.random() * 10)}
            hasUnreadMsg={
              Math.floor(Math.random() * 10) % 2 === 0 ? true : false
            }
            avatar={
              avatars[
                avatarKeys[
                  Math.floor(Math.random() * avatarKeys.length)
                ] as never
              ]
            }
          />
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: 20,
  },
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

export default Conversations;
