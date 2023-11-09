// TODO: this context component should accept a generic type to strictly define the storage object
import React, { Children, ReactElement } from 'react';

import { ServicePromise } from '../../services/services';

import StorageService from '../../services/storage.service';
import AuthService from '../../services/auth.service';

import config from '../../config/config';

// export type StorageProps<T extends { [key: string]: any }> = {
//   children: React.ReactNode[] | React.ReactElement<any, any> | null,
//   keys: T //| string[] 
// }
export type StorageProps = {
  children: React.ReactNode[] | React.ReactElement<any, any> | null,
  keys: string[] 
}

export const StorageContext = React.createContext<{ [key: string]: any }>({});

// const Storage = <T=void>({children, keys}: StorageProps<T>): ReactElement => {
const Storage : React.FC<StorageProps> = ({ children, keys }) => {

  const [storageObj, setStorageObj] = React.useState<{ [key: string]: any }>(async () => await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})));
  // const [storageObj, setStorageObj] = React.useState<T>(async () => await Object.keys(keys).reduce(async (obj, k) => (
  //   { ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }
  // ), Promise.resolve({}) as T) as T);

  React.useEffect(() => {

    const handleStorageChange = async () => {
      //console.log('storageobj', await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({})))
      const newStorage = await keys.reduce(async (obj, k) => ({ ...(await obj), [k]: (await StorageService[config.AUTH_TOKEN_STORAGE_METHOD].retrieve(k)).body }), Promise.resolve({}));
      // console.log('storage update', newStorage)
      setStorageObj(newStorage);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => { window.removeEventListener('storage', handleStorageChange) };

  }, []);

  return (<StorageContext.Provider value={storageObj}>{children}</StorageContext.Provider>);
};

export default Storage;