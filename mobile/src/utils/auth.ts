import screens from '@constant/screens';


export const getAuthScreen = (props: {
  token?: string | null;
  avatar?: string | null;
  username?: string | null;
}) => {
    const {token, avatar, username} = props;
    
    if (!token) return screens.Onboarding
    if (!username) return screens.SetUsername
    if (!avatar) return screens.SetAvatar

    return screens.ProfileSetupcomplete
};
