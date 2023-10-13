import AuthService from './auth.service';
import HttpService from './http.service';
import StorageService from './storage.service';
import ValidationService from './validation.service';

export class spromise<T> extends Promise<T> {
  
}

export type ServicePromise<T=any> = Promise<{
  success: boolean, messages: string[], body?: T
}>;

export type Service = (
  (<T=any>(...args: any[]) => ServicePromise<T | any>) | 
  { [key: string]: Service }
);

// syntactic hack to mandate that services conform to Service type
const services = ((): typeof service extends Service ? typeof service : never => {
  const service = {
    AuthService: AuthService,
    HttpService: HttpService,
    StorageService: StorageService,
    ValidationService: ValidationService
  }
  return service;
})();

export default services;