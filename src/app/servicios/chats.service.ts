import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { message } from '../models/message';
import { firestore } from 'firebase';


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
    private db: AngularFirestore
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

  deleteMsg(msgId: string) {
    return this.db.collection('salon').doc(msgId).update({
      messages: firestore.FieldValue.delete()
  });
  }

  sendMsgToFirebase(message: message, chat_id: string) {
    this.db.collection('salon').doc(chat_id).update({
      messages: firestore.FieldValue.arrayUnion(message),
    })
  }

}
