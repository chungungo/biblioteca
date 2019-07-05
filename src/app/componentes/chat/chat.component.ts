import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { message } from '../../models/message';
import { ChatsService } from '../../servicios/chats.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  public chat: any;
  public messages = [];
  public room: any;
  public msg: string;
  public email: string;

  constructor(
    private navparams: NavParams,
    private modal: ModalController,
    public actionSheetController: ActionSheetController,
    private chatService: ChatsService) { }

  ngOnInit() {
    this.chatService.getChatRoom(this.chat.id).subscribe(room => {
      console.log(room);
      this.room = room;
    });
    this.chat = this.navparams.get('chat');
  }

  closeChat() {
    this.modal.dismiss();
  }

  sendMessage() {
    const mensaje: message = {
      content: this.msg,
      type: 'text',
      date: new Date(),
      autor: this.email
    }
    this.chatService.sendMsgToFirebase(mensaje, this.chat.id);
    this.msg = "";
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            if (this.email == 'ceblae@gmail.com') {
              this.chatService.deleteMsg(this.chat.id);
            }

          }
        }, {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Play (open modal)',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }

}
