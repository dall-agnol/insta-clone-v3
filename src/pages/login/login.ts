import { Component } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SessionProvider } from '../../providers/session/session';
import { CadastroPage } from '../cadastro/cadastro';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: string = '';
  password: string = '';
  usarDigital: boolean = false;
  digitalIndisponivel: boolean = false;

  session: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sessionHelper: SessionProvider,
    private loginService: LoginProvider,
    private alertCtrl: AlertController,
    private loaderCtrl: LoadingController,
    private fingerprint: FingerprintAIO) {
  }

  ionViewWillEnter() {
    this.sessionHelper.getSession().then(user => {
      this.session = user;
      console.log('sessao: ', user);
      this.fingerprint.isAvailable()
        .then(resultado => {
          if (resultado) {
            this.digitalIndisponivel = false;
          }
          if (user) {
            this.login(true)
          }
        })
        .catch(() => this.digitalIndisponivel = true)
    })
  }

  login(logged?) {
    if (logged) {
      this.user = this.session.username;
      this.password = this.session.password;
      if (!this.digitalIndisponivel) {
        this.fingerprint.show({
          clientId: 'insta-clone',
          clientSecret: 'insta-clone-password', //Only necessary for Android
          disableBackup: true  //Only for Android(optional)
        })
        .then(response => {
          if (response) {
            this.navCtrl.setRoot(TabsPage)
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
    let loader = this.loaderCtrl.create({
      content: 'Solicitando...'
    });
    loader.present();
    let params = {
      usuario: this.user,
      senha: this.password
    }
    return this.loginService.login(params)
      .subscribe((retorno: any) => {
        return this.sessionHelper.setSession(retorno.data)
          .then(() => {
            loader.dismiss();
            return this.navCtrl.setRoot(TabsPage)
          })
      }, err => {
        loader.dismiss();
        console.log('erro: ', err);
        let alert = this.alertCtrl.create({
          title: 'Erro ao fazer login',
          message: 'Usuário não encontrado',
          buttons: [
            {
              role: 'ok',
              text: 'Tentar Novamente'
            }
          ]
        });
        alert.present();
      })
  }

  irParaCadastro() {
    this.navCtrl.push(CadastroPage)
  }


}
