import { Service, ServicePromise } from './services';
import AuthService from './auth.service';
import ValidationService from './validation.service';

import config from '../config/config';

type ServiceType<T=any> = {
  success: boolean,
  messages: string[],
  body?: T
}

// all http service calls are assumed to accept only application/json except upload

const HttpService = ((): typeof service extends Service ? typeof service : never => {
  const service = {
    async get<T=any>(route: string, params?: any, schema?: any, url?: string): ServicePromise<T> {
      let options: any = { method: 'GET', headers: { Accept: 'application/json' } };
      if ((await AuthService.isLoggedIn()).success && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') {
        options.headers['token'] = (await AuthService.retrieveToken()).body;
      }
      
      if (params) {
        route += '?' + new URLSearchParams(params).toString();
      }

      return fetch(
        url || (config.URI[config.ENVIRONMENT] + "api/" + route),
        options
      ).then(res => res.json()).then(async (res: ServiceType<T>) => { 
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService->GET->Validation Error: ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => { 
        return { 
          success: false,
          messages: [`HttpService - Could not GET ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    },
  
    async post<T = void>(route: string, body: any, schema?: any, url?: string): ServicePromise<T> {
      let options: any = { 
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'}
      };
      if ((await AuthService.isLoggedIn()).success && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') {
        options.headers['token'] = (await AuthService.retrieveToken()).body;
      }
      return fetch(
        url ? url : config.URI[config.ENVIRONMENT] + "api/" + route,
        {
          body: JSON.stringify(body),
          ...options
        }
      ).then(res => res.json()).then(async (res: ServiceType<T>) => {
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService - POST - Validation Error - ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => {
        return { 
          success: false,
          messages: [`HttpService - POST - Could not POST ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    },
  
    async put<T = void>(route: string, body: any, schema?: any, url?: string): ServicePromise<T> {
      let options: any = { 
        method: 'PUT',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'} 
      };
      if ((await AuthService.isLoggedIn()).success && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') {
        options.headers['token'] = (await AuthService.retrieveToken()).body;
      }
      return fetch(
        url? url : config.URI[config.ENVIRONMENT] + "api/" + route,
        {
          body: JSON.stringify(body),
          ...options
        }
      ).then(res => res.json()).then(async (res: ServiceType<T>) => {
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService - PUT - Validation Error - ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => {
        return { 
          success: false,
          messages: [`HttpService - PUT - Could not PUT ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    },
  
    async patch<T = void>(route: string, body: any, schema?: any, url?: string): ServicePromise<T> {
      let options: any = { 
        method: 'PATCH',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'} 
      };
      if ((await AuthService.isLoggedIn()).success && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') {
        options.headers['token'] = (await AuthService.retrieveToken()).body;
      }
      return fetch(
        url? url : config.URI[config.ENVIRONMENT] + "api/" + route,
        {
          body: JSON.stringify(body),
          ...options
        }
      ).then(res => res.json()).then(async (res: ServiceType<T>) => {
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService - PATCH - Validation Error - ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => {
        return { 
          success: false,
          messages: [`HttpService - PATCH - Could not PATCH ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    },
  
    async delete<T = void>(route: string, params?: any, schema?: any, url?: string): ServicePromise<T> {
      
      let options: any = { 
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'} 
      };
      if ((await AuthService.isLoggedIn()) && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') {
        options.headers['token'] = (await AuthService.retrieveToken()).body;
      }
      if (params) {
        route += '?' + new URLSearchParams(params).toString();
      }
  
      return fetch(
        url? url : config.URI[config.ENVIRONMENT] + "api/" + route,
        {
          ...options
        }
      ).then(res => res.json()).then(async (res: ServiceType<T>) => {
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService - DELETE - Validation Error - ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => {
        return { 
          success: false,
          messages: [`HttpService - DELETE - Could not DELETE ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    },
  
    async upload<T= void>(route: string, file: File, schema?: any, url?: string): ServicePromise<T> {
      
      const body = new FormData();
      body.append(file.name, file);
      
      return fetch(
        url? url : config.URI[config.ENVIRONMENT] + "api/" + route,
        {
          method: 'POST',
          headers: ((await AuthService.isLoggedIn()) && config.AUTH_TOKEN_STORAGE_METHOD !== 'COOKIE') ? { token: (await AuthService.retrieveToken()).body } : {},
          body: body
        }
      ).then(res => res.json()).then(async (res: ServiceType<T>) => {
        if (schema) {
          const schemaErrors = (await ValidationService.validate(res.body, schema)).body?.map(u => `HttpService - UPLOAD - Validation Error - ${u}`);
          return {
            success: res.success && !(schemaErrors?.length),
            messages: [ ...(schemaErrors || []), ...res.messages ],
            body: res.body
          }
        } else {
          return res;
        }
      }).catch((e: Error) => {
        return { 
          success: false,
          messages: [`HttpService - UPLOAD - Could not UPLOAD ${url || (config.URI[config.ENVIRONMENT] + "api/" + route)}`, e.message]
        } 
      });
    }
  }
  return service;
})();

export default HttpService;
