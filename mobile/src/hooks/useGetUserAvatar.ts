import avatars from 'constant/avatars';
import React, {useEffect} from 'react';
import {StoreKeys, retrieveData} from 'services/asynstorage';

const useGetUserAvatar = () => {
  const [avatar, setAvatar] = React.useState<keyof typeof avatars>('TU9OS0VZX09ORQ');

  useEffect(() => {
    const getAvatar = async () => {
      const avatar = (await retrieveData(StoreKeys.avatar)) as keyof typeof avatars;
      if (avatar) {
        setAvatar(avatar);
      }
    };
    getAvatar();
  }, []);

  return avatars[avatar];
};

export default useGetUserAvatar;
