import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { message } from '../models/message';
import { firestore } from 'firebase';
import { ToastController } from '@ionic/angular';


export interface chat {
  description: string;
  name: string;
  id: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private db: AngularFirestore,
    public toastController: ToastController
  ) { }

  getChatRooms() {
    return this.db.collection('salon').snapshotChanges().pipe(map(rooms => {
      return rooms.map(a => {
        const data = a.payload.doc.data() as chat;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  //conseguir el observable de un solo documento.
  getChatRoom(chat_id: string) {
    return this.db.collection('salon').doc(chat_id).valueChanges(); //retorna el observable.
  }

  //vaciar chat actual
  deleteMsg(msgId: string) {
    return this.db.collection('salon').doc(msgId).update({
      messages: firestore.FieldValue.delete()
    });
  }

  //eliminar salón de chat actual
  eliminarSalon(idSalon: string) {
    return this.db.collection('salon').doc(idSalon).delete().then(function () {
      console.log("Salón de chat eliminado!");
    }).catch(function (error) {
      console.error("Error al eliminar el salón de chat: "+ error);
    });
  }

  sendMsgToFirebase(message: message, chat_id: string) {
    this.db.collection('salon').doc(chat_id).update({
      messages: firestore.FieldValue.arrayUnion(message),
    })
  }

  createSalonToFirebase(descripcion: string, nombreSalon: string) {
    this.db.collection('salon').add({
      descripcion: descripcion,
      messages: 'messages',
      nombre: nombreSalon,
      img: 'https://firebasestorage.googleapis.com/v0/b/chatonline-b0406.appspot.com/o/salonDefault.svg?alt=media&token=1551ec52-acb5-4a15-b34b-1353998c93ce'
    }).then(function (docRef) {
      console.log("Salón creado, ID: ", docRef.id);
    }).catch(function (error) {
      console.error("Error al crear el salón: "+ error);
    });

  }

  async mostrarMsg(mensaje: string) {
    const evento = await this.toastController.create({
      message: mensaje,
      duration: 1800,
      position: 'middle'
    });
    evento.present();
  }

}
