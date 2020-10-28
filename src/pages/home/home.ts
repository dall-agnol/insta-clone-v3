import { Component, ViewChild } from '@angular/core';
import { Content, LoadingController, NavController } from 'ionic-angular';
import { PhotoProvider } from '../../providers/photo/photo';
import { TakePicPage } from '../take-pic/take-pic';
import { SocialSharing } from '@ionic-native/social-sharing';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  images: Array<any> = new Array();

  constructor(
    public navCtrl: NavController,
    private photoProvider: PhotoProvider,
    private loaderCtrl: LoadingController,
    private socialSharing: SocialSharing) {

  }

  ionViewWillEnter() {
    this.getPhotos();
  }

  scrollToTop() {
    this.content.scrollToTop()
  }

  getPhotos() {
    let loader = this.loaderCtrl.create({content: 'Solicitando...'});
    loader.present();
    return this.photoProvider.getPhotos()
    .subscribe((retorno: any) => {
      this.images = retorno;
      loader.dismiss();
    }, err => {
      loader.dismiss();
      console.log('erro ao recuperar todas fotos: ', err);
    })
  }

  openCamera() {
    this.navCtrl.setRoot(TakePicPage)
  }

  share(img) {
    this.socialSharing.share('Imagem do instaclone', 'imagem', img.image)
    .then(response => console.log(response))
    .catch(err => console.log(err))
  }

}
