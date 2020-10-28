import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PhotoProvider {
  private url: string = 'https://tj-treinamento-back.herokuapp.com';

  constructor(public http: HttpClient) {
  }

  getPhotos() {
    return  this.http.get(this.url + '/posts')
  }

  postPhoto(data) {
     return this.http.post(this.url + '/post', data)
  }

  getPhotoById(id) {
    return this.http.get(`${this.url}/post/${id}`)
  }

  getPhotosById(id) {
    return this.http.get(`${this.url}/postsById/${id}`)
  }

}
