import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';
import { SessionProvider } from '../../providers/session/session';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
  
  imageUser: string;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    targetHeight: 88,
    targetWidth: 88
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera,
    private loginService: LoginProvider,
    private sessionHelper: SessionProvider,
    private alertCtrl: AlertController,
    private loaderCtrl: LoadingController,
    private platform: Platform
    ) {
      console.log(this.platform.is('cordova'))
  }

  tirarFoto() {
    return this.camera.getPicture(this.options)
    .then(imageBase => {
      let base64Image = 'data:image/png;base64,' + imageBase;
      this.imageUser = base64Image;
    })
  }

  cadastrar() {
    if (this.platform.is('cordova')) {
      this.tirarFoto()
      .then(() => {
        this.requisitarCadastro();
      })
      .catch(err => {
        console.log(err)
        this.requisitarCadastro();
      })
    } else {
      this.requisitarCadastro();
    }
    
  }

  requisitarCadastro() {
    let params = {
      name: this.nome,
      username: this.usuario,
      email: this.email,
      password: this.senha,
      imageUser: this.imageUser
    }
    let loader = this.loaderCtrl.create({
      content: 'Solicitando...'
    });
    loader.present()
    return this.loginService.register(params)
    .subscribe((retorno: any) => {
      if (retorno) {
        this.sessionHelper.setSession(retorno)
        .then(() => {
          loader.dismiss()
          this.navCtrl.setRoot(TabsPage)
        })
      }
    }, err => {
      console.log('erro: ', err);
      loader.dismiss()
      let alert = this.alertCtrl.create({
        title: 'Erro ao cadastrar',
        message: 'Houve um erro ao solicitar o cadastro. Tente novamente.',
        buttons: [
          {
            text: 'Ok',
            role: 'ok'
          }
        ]
      });
      alert.present();
    })
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage)
  }
}
