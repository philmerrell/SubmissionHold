import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelperService = new JwtHelperService();
  tokensSubject: BehaviorSubject<any> = new BehaviorSubject({});
  authClient: HttpClient;
  
  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.authClient = new HttpClient(handler);
  }

  async login() {
    window.open(`${environment.authUrl}/v1/auth/login`,'_SELF' );
  }

  async signUp() {
    window.open(`${environment.authUrl}/v1/auth/signup`, '_SELF' );
  }

  async logout() {
    await Storage.remove({ key: `${environment.localStoragePrefix}-TOKENS`});
    window.open(`${environment.authUrl}/v1/auth/logout`, '_SELF' );
  }

  getTokensFromCognito(postObj: { code: string; state: string;}) {

    return this.authClient.post(`${environment.authUrl}/v1/auth/token`, postObj, { withCredentials: true });
  }

  async refreshToken() {
    const tokens = await this.getAuthTokens();
    return this.authClient.post(`${environment.authUrl}/v1/auth/refresh`, { refresh_token: tokens.refresh_token}).toPromise();
  }

  saveTokensToLocalStorage(tokens) {
    this.tokensSubject.next(tokens);
    return Storage.set({ key: `${environment.localStoragePrefix}-TOKENS`, value: JSON.stringify(tokens) });
  }

  async getAuthTokens() {
    const token = await Storage.get({ key: `${environment.localStoragePrefix}-TOKENS`});
    return JSON.parse(token.value);
  }

  async isAuthenticated() {
    const token = await this.getAuthTokens();
    if (token) {
      const isExpired = this.jwtHelperService.isTokenExpired(token.access_token);
      return !isExpired;
    } else {
      return false;
    }
  }

  decodeAccessToken(token) {
    return this.jwtHelperService.decodeToken(token.access_token);
  }

  decodeIdToken(token) {
    return this.jwtHelperService.decodeToken(token.id_token);
  }

  testApi() {
    return this.http.get(`${environment.authUrl}/v1/test/health`)
  }

  getTokenObservable() {
    return this.tokensSubject.asObservable();
  }

  

}