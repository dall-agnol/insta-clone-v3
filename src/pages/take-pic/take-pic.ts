import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { PhotoProvider } from '../../providers/photo/photo';
import { SessionProvider } from '../../providers/session/session';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-take-pic',
  templateUrl: 'take-pic.html',
})
export class TakePicPage {
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    targetHeight: 411,
    targetWidth: 247.78
  }
  imagebase64: string;
  description: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera,
    private alert: AlertController,
    private photoService: PhotoProvider,
    private loaderCtrl: LoadingController,
    private sessionHelper: SessionProvider) {
  }

  ionViewWillEnter() {
    this.openCamera();
  }

  openCamera() {
    return this.camera.getPicture(this.options)
    .then(image => {
      this.imagebase64 = 'data:image/png;base64,' + image;
    })
    .catch(err => {
      console.log('erro: ', err);
      let alert = this.alert.create({
        title: 'Erro',
        message: err,
        buttons: [{
          text: 'ok',
          handler: () => this.closePage()
        }]
      });
      alert.present();
    })
  }

  upload() {
    let loader = this.loaderCtrl.create({
      content: 'Enviando...'
    });
    loader.present();
    return this.sessionHelper.getSession().then(sessao => {
      let params = {
        id: sessao._id,
        username: sessao.username,
        userimage: sessao.imageUser,
        image: this.imagebase64,
        description: this.description
      }
      return this.photoService.postPhoto(params)
      .subscribe(retorno => {
        console.log(retorno);
        loader.dismiss();
        this.closePage();
      }, err => {
        loader.dismiss();
        console.log('erro ao publicar foto: ', err);
      })
    })
  }

  closePage() {
    this.navCtrl.setRoot(TabsPage)
  }

  


}
