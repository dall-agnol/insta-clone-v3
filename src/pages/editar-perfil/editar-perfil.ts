import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SessionProvider } from '../../providers/session/session';

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {
  user: any = {};
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
    private viewCtrl: ViewController,
    private sessionHelper: SessionProvider,
    private userService: LoginProvider,
    private loaderCtrl: LoadingController,
    private camera: Camera,
    private alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.sessionHelper.getSession().then(user => this.user = user)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  update() {
    let loader = this.loaderCtrl.create();
    loader.present();
    this.userService.update(this.user, this.user._id)
    .subscribe((retorno: any) => {
      this.sessionHelper.setSession(retorno)
      .then(() => {
        loader.dismiss();
        this.dismiss();
        console.log('retorno: ', retorno);
      })
    }, err => {
      loader.dismiss();
      console.log('erro ao atualizar: ', err);
    })
  }

  changePhoto() {
    let alert = this.alertCtrl.create({
      message: 'Escolha uma opção para atualizar a foto de perfil',
      buttons: [
        {
          text: 'Foto da galeria',
          handler: () => this.abrirGaleria()
        },
        {
          text: 'Tirar foto',
          handler: () => this.abrirFoto()
        }
      ]
    });
    alert.present();
  }

  abrirGaleria() {
    this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.tirarFoto();
  }

  abrirFoto() {
    this.options.sourceType = this.camera.PictureSourceType.CAMERA;
    this.tirarFoto();
  }

  tirarFoto() {
    this.camera.getPicture(this.options)
    .then(imageBase => {
      this.user.imageUser = 'data:image/png;base64,' + imageBase;
    })
    .catch(err => {
      console.log('houve um erro ao abrir a camera', err);
       let alert = this.alertCtrl.create({
         message: 'Houv eum erro ao salvar sua foto: ' + err,
         buttons: [{
           text: 'ok'
         }]
       });
       alert.present();
    })
  }

}
