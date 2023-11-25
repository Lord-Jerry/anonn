import screens from 'constant/screens';
import {IConversation} from './conversation';

export type Screens = keyof typeof screens;

export type RootStackParamList = {
  [screens.Onboarding]: undefined;
  [screens.Signup]: undefined;
  [screens.Login]: undefined;
  [screens.SetUsername]: undefined;
  [screens.SetAvatar]: undefined;
  [screens.ProfileSetupcomplete]: undefined;
  [screens.Conversation]: undefined;
  [screens.ConversationRequest]: undefined;
  [screens.ConversationMessages]: {conversationId: string};
  [screens.Message]: IConversation;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
