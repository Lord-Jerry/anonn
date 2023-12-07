import avatars from 'constant/avatars';
import React, {useEffect} from 'react';
import {StoreKeys, retrieveData} from 'services/asynstorage';

const useUserProfile = () => {
  const [username, setUsername] = React.useState<string>('');
  const [avatar, setAvatar] = React.useState<keyof typeof avatars>('TU9OS0VZX09ORQ');

  useEffect(() => {
    const getAvatar = async () => {
      const avatar = (await retrieveData(StoreKeys.avatar)) as keyof typeof avatars;
      if (avatar) setAvatar(avatar);

      const username = (await retrieveData(StoreKeys.username)) as string;
      if (username) setUsername(username);
    };
    getAvatar();
  }, []);

  return {avatar: avatars[avatar], username};
};

export default useUserProfile;
