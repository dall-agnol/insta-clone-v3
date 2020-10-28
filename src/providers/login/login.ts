import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionProvider } from '../session/session';


@Injectable()
export class LoginProvider {
  private url: string = 'https://tj-treinamento-back.herokuapp.com';

  constructor(private http: HttpClient, private sessionHelper: SessionProvider) {

  }

  register(params) {
    return this.http.post(this.url + '/register', params);
  }

  login(params) {
    return this.http.post(this.url + '/login', params);
  }

  update(params, id) {
    return this.http.put(`${this.url}/login/${id}`, params)
  }

  logout() {
    return this.sessionHelper.clearSession();
  }

}
