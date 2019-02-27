import {
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken < Storage > ('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string): object {
    let result;
    try {
      result = JSON.parse(this.storage.getItem(key));
    } catch (e) {
      result = {};
    }
    return result;
  }

  set(key: string, v: object): void {
    try {
      this.storage.setItem(key, JSON.stringify(v));
    } catch (e) {
      this.storage.setItem(key, '{}');
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}