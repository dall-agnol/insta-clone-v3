import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PerfilPage } from '../perfil/perfil';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  usuarioLogado: boolean = true;

  tab1Root = HomePage;
  //tab2Root = AboutPage;
  tab3Root = PerfilPage;

  constructor(private events: Events) {
    this.events.subscribe('session_created', () => {
      this.usuarioLogado = true;
    })
    this.events.subscribe('session_destroyed', () => {
      this.usuarioLogado = false;
    })
  }
}
