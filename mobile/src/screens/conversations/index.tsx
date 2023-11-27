import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, ActivityIndicator, RefreshControl} from 'react-native';

import Layout from 'components/layout';
import ConversationItem from 'components/ConversationItem';
import useFetchConversations from 'hooks/useFetchConversations';
import ConversationsHeader from 'components/ConversationsHeader';
import useRequestNotificationPermission from 'src//hooks/useRequestNotificationPermission';

const {width} = Dimensions.get('window');

const Conversations = () => {
  const {isLoading, conversations, refreshConversations, isFetchingOldConversations, fetchPaginatedConversations} =
    useFetchConversations();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useRequestNotificationPermission();

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    refreshConversations().finally(() => {
      setIsRefreshing(false);
    });
  }, [refreshConversations]);

  return (
    <Layout>
      <>
        <ConversationsHeader />
        <FlatList
          windowSize={21}
          data={conversations}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          style={styles.container}
          onEndReachedThreshold={0.5}
          onEndReached={fetchPaginatedConversations}
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
