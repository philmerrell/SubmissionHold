import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { UserService } from './user.service';

export interface Tokens {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelperService = new JwtHelperService();
  tokensSubject: BehaviorSubject<any> = new BehaviorSubject({});
  authClient: HttpClient;
  
  constructor(private http: HttpClient, private handler: HttpBackend, private userService: UserService) {
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

  getTokensFromCognito(postObj: { code: string; state: string;}): Promise<Tokens> {
    return this.authClient.post<Tokens>(`${environment.authUrl}/v1/auth/token`, postObj, { withCredentials: true }).toPromise();
  }

  async refreshToken() {
    const tokens = await this.getAuthTokens();
    return this.authClient.post(`${environment.authUrl}/v1/auth/refresh`, { refresh_token: tokens.refresh_token}).toPromise();
  }

  async saveTokensToLocalStorage(tokensResponse: Tokens) {
    if (tokensResponse.refresh_token) {
      this.tokensSubject.next(tokensResponse);
      this.userService.setUser(tokensResponse);
      return Storage.set({ key: `${environment.localStoragePrefix}-TOKENS`, value: JSON.stringify(tokensResponse) });
    } else {
      const tokens = await this.getAuthTokens();
      tokens.access_token = tokensResponse.access_token;
      tokens.id_token = tokensResponse.id_token;
      tokens.expires_in = tokensResponse.expires_in;
      tokens.token_type = tokensResponse.token_type;
      this.tokensSubject.next(tokens);
      this.userService.setUser(tokensResponse);
      return Storage.set({ key: `${environment.localStoragePrefix}-TOKENS`, value: JSON.stringify(tokens) });
    }
  }

  async getAuthTokens(): Promise<Tokens> {
    const token = await Storage.get({ key: `${environment.localStoragePrefix}-TOKENS`});
    return JSON.parse(token.value);
  }

  async isAuthenticated() {
    const tokens = await this.getAuthTokens();
    if (tokens) {
      // const isExpired = this.jwtHelperService.isTokenExpired(tokens.access_token);
      // return !isExpired;
      this.userService.setUser(tokens);
      return true;
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