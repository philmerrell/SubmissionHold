import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Tokens } from './auth.service';

export interface User {
  authenticated: boolean;
  claims?: {
    email: string;
    username: string;
    roles: string[];
    isVoter: boolean;
    isAdmin: boolean;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = { authenticated: false };
  jwtHelperService = new JwtHelperService();
  private userSubject: BehaviorSubject<User> = new BehaviorSubject({ authenticated: false } as User);

  constructor() { }

  async clearUser() {
    this.userSubject.next({ authenticated: false } as User);
  }

  async setUser(tokens: Tokens) {
    this.user = {
      authenticated: true,
      claims: await this.mapClaims(tokens)
    };
    this.userSubject.next(this.user);
  }

  async decodeToken(accessToken: string) {
    const token = await this.jwtHelperService.decodeToken(accessToken);
    return token;
  }

  getUserObservable() {
    return this.userSubject.asObservable();
  }

  async getUser() {
    return this.user;
  }

  private async mapClaims(tokens: Tokens) {
    const idToken = await this.decodeToken(tokens.id_token);
    const accessToken = await this.decodeToken(tokens.access_token);
    return {
      email: idToken.email,
      username: accessToken.username,
      roles: accessToken['cognito:groups'] || [],
      isVoter: this.setRole(accessToken, 'voter'),
      isAdmin: this.setRole(accessToken, 'admin')
    }
  }

  private setRole(accessToken, role) {
    if (accessToken['cognito:groups']) {
      return accessToken['cognito:groups'].indexOf(role) !== -1
    } else {
      return false;
    }
  }
}
