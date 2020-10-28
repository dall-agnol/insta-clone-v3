import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { PhotoProvider } from '../../providers/photo/photo';
import { SessionProvider } from '../../providers/session/session';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  profile_segment: string;
  images: Array<any> = new Array();
  
  user: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sessionHelper: SessionProvider,
    private loaderCtrl: LoadingController,
    private photoService: PhotoProvider,
    private modalCtrl: ModalController) {
  }

  ionViewWillEnter() {
    this.profile_segment = 'grid';
    let loader = this.loaderCtrl.create()
    loader.present();
    this.sessionHelper.getSession()
    .then(user => {
      this.user = user;
      this.photoService.getPhotosById(user._id)
      .subscribe((retorno: any) => {
        this.images = retorno;
        loader.dismiss();
      }, err => {
        console.log('erro ao consultar fotos do usuário: ', err);
        loader.dismiss();
      })
    })
  }


  logout() {
    this.sessionHelper.clearSession()
    .then(() => this.navCtrl.push(LoginPage))
  }

  goEditProfile() {
    let modal = this.modalCtrl.create(EditarPerfilPage);
    modal.present();
    modal.onWillDismiss(() => {
      this.sessionHelper.getSession().then(session => this.user = session);
    })
  }

}
