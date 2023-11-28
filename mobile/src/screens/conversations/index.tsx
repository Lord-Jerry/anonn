import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {View, StyleSheet, Dimensions, ActivityIndicator, RefreshControl} from 'react-native';

import Layout from 'components/layout';
import useNotification from 'hooks/useNotification';
import ConversationItem from 'components/ConversationItem';
import useFetchConversations from 'hooks/useFetchConversations';
import ConversationsHeader from 'components/ConversationsHeader';
import useRequestNotificationPermission from 'src//hooks/useRequestNotificationPermission';
import EmptyConversation from 'src//components/EmptyConversation';

const {width} = Dimensions.get('window');

const Conversations = () => {
  const {onRefresh, isLoading, isRefreshing, conversations, isFetchingOldConversations, fetchPaginatedConversations} =
    useFetchConversations();
  useNotification();
  useRequestNotificationPermission();

  return (
    <Layout>
      <>
        <ConversationsHeader />
        <FlashList
          estimatedItemSize={21}
          data={conversations}
          onEndReachedThreshold={0.5}
          onEndReached={fetchPaginatedConversations}
          contentContainerStyle={styles.container}
          ListEmptyComponent={<EmptyConversation />}
          ListHeaderComponent={isLoading ? <ActivityIndicator /> : null}
          ListFooterComponent={
            <View style={{height: 50}}>{isFetchingOldConversations ? <ActivityIndicator /> : null}</View>
          }
          renderItem={({item, index}) => <ConversationItem {...item} index={index} />}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
      </>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: width * 0.03,
    paddingRight: width * 0.03,
    paddingTop: 20,
  },
});

export default Conversations;
