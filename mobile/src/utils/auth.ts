import screens from 'constant/screens';
import {StoreKeys, retrieveData} from 'services/asynstorage';

const getData = async () => {
  const token = await retrieveData(StoreKeys.token);
  const username = await retrieveData(StoreKeys.username);
  const avatar = await retrieveData(StoreKeys.avatar);

  return {
    token,
    avatar,
    username,
  };
};

export const getAuthScreen = async () => {
  const {token, avatar, username} = await getData();

  if (!token) {
    return screens.Onboarding;
  }
  if (!username) {
    return screens.SetUsername;
  }
  if (!avatar) {
    return screens.SetAvatar;
  }

  return screens.Conversation;
};
