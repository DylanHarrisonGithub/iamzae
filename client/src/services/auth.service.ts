import { Service, ServicePromise } from './services';
import StorageService from './storage.service';
import config from '../config/config';

type AuthMethod = "LOCAL" | "SESSION" | "COOKIE" | "WINDOW";

const AuthService = ((): typeof service extends Service ? typeof service : never => {
  const service = {
    storeToken: (token: any, method?: AuthMethod): ServicePromise => {
      StorageService[method || config.AUTH_TOKEN_STORAGE_METHOD].store('token', token);
      return new Promise(resolve => resolve({
        success: true,
        messages: [`CLIENT->SERVICES->AUTHSERVICE->STORETOKEN: Token stored successfully.`]
      }));
    },
    retrieveToken: <T=any>(method?: AuthMethod): ServicePromise<T | undefined> => StorageService[method || config.AUTH_TOKEN_STORAGE_METHOD].retrieve('token').then(res => ({
      success: res.success,
      messages: [res.success ?
          `CLIENT->SERVICES->AUTHSERVICE->RETRIEVETOKEN: Token retrieved successfully.`
        :
          `CLIENT->SERVICES->AUTHSERVICE->RETRIEVETOKEN: Token could not be retrieved.`
      ],
      body: res.body
    })),
    logout: (method?: AuthMethod): ServicePromise => StorageService[method || config.AUTH_TOKEN_STORAGE_METHOD].store('token', undefined).then(res => ({
      success: res.success,
      messages: [res.success ?
          `CLIENT->SERVICES->AUTHSERVICE->LOGOUT: Successfully logged out.`
        :
          `CLIENT->SERVICES->AUTHSERVICE->LOGOUT: Failed to log out.`
      ]
    })),
    getUserDetails<T=any>(): ServicePromise<T | undefined> {
      try {
        return this.retrieveToken<string>().then(res => ({
          success: res.success,
          messages: [res.success ? 
              `CLIENT->SERVICES->AUTHSERVICE->GETUSERDETAILS: Successfully retrieved user details.`
            :
              `CLIENT->SERVICES->AUTHSERVICE->GETUSERDETAILS: User details not found.`
          ],
          body: res.success ? JSON.parse(window.atob(res.body!.split('.')[1])) : undefined
        }));
      } catch {
        return this.retrieveToken().then(res => ({
          success: false,
          messages: [`CLIENT->SERVICES->AUTHSERVICE->GETUSERDETAILS: Error occured parsing user details.`]
        }));
      }
    },
    isLoggedIn(): ServicePromise {
      return this.getUserDetails().then(res => ({
        success: res.success,
        messages: [res.success ?
            `CLIENT->SERVICES->AUTHSERVICE->ISLOGGEDIN: User is logged in.`
          :
            `CLIENT->SERVICES->AUTHSERVICE->ISLOGGEDIN: User not logged in.`
        ]
      }));
    }
  }
  
  return service;
})();

export default AuthService;
