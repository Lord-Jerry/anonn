import React, {useEffect} from 'react';
import colors from 'constant/colors';
import Layout from 'components/layout';
import screens from 'constant/screens';
import {getAuthScreen} from 'src//utils/auth';
import useUserProfile from 'hooks/useUserProfile';
import {useNavigation} from '@react-navigation/native';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import useFetchConversationProfile from 'hooks/useFetchConversationProfile';
import {View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';

type Props = {
  route: {
    params: {
      username: string;
    };
  };
};

const ConversationProfile = (props: Props) => {
  const navigation = useNavigation();
  const {username: initiatorUsername} = useUserProfile();
  const username = props.route.params.username;
  const {profile, isLoading} = useFetchConversationProfile(username);

  const handleGoBack = async () => {
    const screen = await getAuthScreen();
    navigation.navigate(screen as never);
  };

  useEffect(() => {
    if (initiatorUsername === username) {
      navigation.navigate(screens.UserProfile as never);
    }
  }, [username, initiatorUsername]);

  if (isLoading) return <ActivityIndicator />;

  return (
    <Layout>
      <ScrollView>
        <View>
          <TouchableOpacity style={styles.iconContainer} onPress={handleGoBack}>
            <FontAwesomeIcon style={styles.iconStyle} icon={faChevronLeft} size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.avatar} source={{uri: profile?.avatar}} />
            <Text style={styles.headerText}>@{username} wants to have a chat with you</Text>
          </View>
          <Text style={styles.description}>
            Welcome to our anonymous chat app! We want to ensure your privacy and security, so every time you start a
            new conversation, we will automatically generate a random username for you. This means that you can chat
            freely without revealing your personal identity. Have fun and stay safe!
          </Text>
          {profile.lastConversationId && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate(screens.Message, {
                  conversationId: profile.lastConversationId,
                } as never)
              }>
              <Text style={styles.buttonText}>Continue last conversation</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, profile.lastConversationId ? {backgroundColor: colors.white} : null]}
            onPress={() =>
              navigation.navigate(screens.InitiateConversation, {
                participantId: profile.id as string,
              })
            }>
            <Text style={styles.buttonText}>Start new conversation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginTop: 20,
  },
  iconStyle: {
    marginBottom: 40,
    marginLeft: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    width: 308,
    height: 50,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.anonn_dark_green,
  },
  buttonText: {
    fontSize: 14,
    marginRight: 10,
    textAlign: 'center',
    color: colors.primary_dark,
  },
});

export default ConversationProfile;
