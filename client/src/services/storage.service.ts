import { Service, ServicePromise } from './services';

import config from '../config/config';

const StorageService = ((): typeof service extends Service ? typeof service : never => {
  const service = {
    SESSION: {
      store: (key: string, value: any): ServicePromise => {
        let storageObj: any = {};
        let storage = sessionStorage.getItem(config.APP_NAME);
        if (storage) {
          try {
            storageObj = JSON.parse(storage) || {}; 
          } catch {
            storageObj = {};
          }
        }
        storageObj[key] = value;
        sessionStorage.setItem(config.APP_NAME, JSON.stringify(storageObj));
        window.dispatchEvent(new Event('storage'));
        return new Promise(resolve => resolve({
          success: true, 
          messages: [`CLIENT->SERVICES->STORAGE->SESSION->STORE: Value successfully stored to key ${key}.`]
        }));
      },
      retrieve: <T=any>(key: string): ServicePromise<T | undefined> => { 
        let storage = sessionStorage.getItem(config.APP_NAME);
        if (storage === null) {
          return new Promise(resolve => resolve({
            success: false,
            messages: [`CLIENT->SERVICES->STORAGE->SESSION->RETRIEVE: Storage object not found.`]
          }));
        }
        try {
          let storageObj = JSON.parse(storage);
          return new Promise(resolve => resolve({
            success: !!(storageObj?.hasOwnProperty(key)),
            messages: [!!(storageObj?.hasOwnProperty(key)) ?
                `CLIENT->SERVICES->STORAGE->SESSION->RETRIEVE: Value successfully retrieved from key ${key}.`
              :
                `CLIENT->SERVICES->STORAGE->SESSION->RETRIEVE: Key ${key} is undefined.`
            ],
            body: storageObj?.[key]
          })); 
        } catch {
          return new Promise(resolve => resolve({
            success: false,
            messages: [`CLIENT->SERVICES->STORAGE->SESSION->RETRIEVE: Storage object could not be parsed.`]
          }));
        }
      }
    },
    LOCAL: {
      store: (key: string, value: any): ServicePromise => {
        let storageObj: any = {};
        let storage = localStorage.getItem(config.APP_NAME);
        if (storage) {
          try {
            storageObj = JSON.parse(storage) || {}; 
          } catch {
            storageObj = {};
          }
        }
        storageObj[key] = value;
        localStorage.setItem(config.APP_NAME, JSON.stringify(storageObj));
        window.dispatchEvent(new Event('storage'));
        return new Promise(resolve => resolve({
          success: true, 
          messages: [`CLIENT->SERVICES->STORAGE->LOCAL->STORE: Value successfully stored to key ${key}.`]
        }));
      },
      retrieve: <T=any>(key: string): ServicePromise<T | undefined> => { 
        let storage = localStorage.getItem(config.APP_NAME);
        if (storage === null) {
          return new Promise(resolve => resolve({
            success: false,
            messages: [`CLIENT->SERVICES->STORAGE->LOCAL->RETRIEVE: Storage object not found.`]
          }));
        }
        try {
          let storageObj = JSON.parse(storage);
          return new Promise(resolve => resolve({
            success: !!(storageObj?.hasOwnProperty(key)),
            messages: [!!(storageObj?.hasOwnProperty(key)) ?
                `CLIENT->SERVICES->STORAGE->LOCAL->RETRIEVE: Value successfully retrieved from key ${key}.`
              :
                `CLIENT->SERVICES->STORAGE->LOCAL->RETRIEVE: Key ${key} is undefined.`
            ],
            body: storageObj?.[key]
          })); 
        } catch {
          return new Promise(resolve => resolve({
            success: false,
            messages: [`CLIENT->SERVICES->STORAGE->LOCAL->RETRIEVE: Storage object could not be parsed.`]
          }));
        }
      }
    },
    COOKIE: {
      store: (key: string, value: any): ServicePromise => {
        let storage: any = (<any>document.cookie
          .split(';')
          .map(c => c.split('='))
          .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: JSON.parse(btoa(value))}), {}))
          [config.APP_NAME] || {};
  
        storage[key] = value;
  
        document.cookie = config.APP_NAME+'='+atob(JSON.stringify(storage));
        window.dispatchEvent(new Event('storage'));

        return new Promise(resolve => resolve({
          success: true, 
          messages: [`CLIENT->SERVICES->STORAGE->COOKIE->STORE: Value successfully stored to key ${key}.`]
        }));
      },
      retrieve: <T=any>(key: string): ServicePromise<T | undefined> => { 
        let val = (<any>document.cookie
        .split(';')
        .map(c => c.split('='))
        .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: JSON.parse(btoa(value))}), {}))
        [config.APP_NAME]?.[key];
        return new Promise(resolve => resolve({
          success: val !== undefined,
          messages: [val !== undefined ?
              `CLIENT->SERVICES->STORAGE->COOKIE->RETRIEVE: Value successfully retrieved from key ${key}.`
            :
              `CLIENT->SERVICES->STORAGE->COOKIE->RETRIEVE: Key ${key} is undefined.`
          ],
          body: val
        }));
      }
    },
    WINDOW: {
      store: (key: string, value: any): ServicePromise => { 
        (<any>window)[config.APP_NAME][key] = value;
        window.dispatchEvent(new Event('storage'));
        return new Promise(resolve => resolve({
          success: true, 
          messages: [`CLIENT->SERVICES->STORAGE->WINDOW->STORE: Value successfully stored to key ${key}.`]
        }));
      },
      retrieve: <T=any>(key: string): ServicePromise<T | undefined> => { 
        let val = (<any>window)[config.APP_NAME][key];
        return new Promise(resolve => resolve({
          success: val !== undefined,
          messages: [val !== undefined ?
              `CLIENT->SERVICES->STORAGE->WINDOW->RETRIEVE: Value successfully retrieved from key ${key}.`
            :
              `CLIENT->SERVICES->STORAGE->WINDOW->RETRIEVE: Key ${key} is undefined.`
          ],
          body: val
        }));
      }
    }
  }
  return service;
})();

export default StorageService;
