import {Share} from 'react-native';
import mixpanel from '../services/analytics';
import {StoreKeys, retrieveData} from 'services/asynstorage';

const useShareProfile = () => {
  const handleShare = async () => {
    const userProfile = await retrieveData(StoreKeys.username);
    const link = `https://anonn.xyz/profile/${userProfile}`;
    Share.share({
      message: `
          Let's chat on Anonn! \n Share your secrets, confessions and spicy gists with me anonnymously \n No one will ever know it's you! 🤫🤫🤫 \n ${link}`,
    });
    mixpanel.track('Share Profile');
  };

  return handleShare;
};

export default useShareProfile;
