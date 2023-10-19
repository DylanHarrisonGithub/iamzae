import React, { Children } from 'react';

import { ServicePromise } from '../../services/services';

import StorageService from '../../services/storage.service';
import AuthService from '../../services/auth.service';

import config from '../../config/config';

export type StorageProps = {
  children: React.ReactNode[] | React.ReactElement<any, any> | null,
  keys: string[]
}

export const StorageContext = React.createContext<{ [key: string]: any }>({});

const Storage: React.FC<StorageProps> = ({ children, keys }) => {

  const [storageObj, setStorageObj] = React.useState<{ [key: string]: any }>(async () => await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})));

  React.useEffect(() => {

    const handleStorageChange = async () => {
      //console.log('storageobj', await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})))
      const newStorage = await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({}));
      console.log(newStorage)
      setStorageObj(newStorage);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => { window.removeEventListener('storage', handleStorageChange) };

  }, []);

  return (<StorageContext.Provider value={storageObj}>{children}</StorageContext.Provider>)
};

export default Storage;