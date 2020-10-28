import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


@Injectable()
export class SessionProvider {

  constructor(private storage: Storage, private events: Events) {

  }

  setSession(user) {
    this.events.publish('session_created')
    return this.storage.set('user', user)
  }

  getSession() {
    return this.storage.get('user');
  }

  clearSession() {
    this.events.publish('session_destroyed')
    return this.storage.remove('user');
  }

}
