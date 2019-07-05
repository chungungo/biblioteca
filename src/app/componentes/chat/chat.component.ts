import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { message } from '../../models/message';
import { ChatsService } from '../../servicios/chats.service';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

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
  private ok: boolean = false;

  constructor(
    private navparams: NavParams,
    private modal: ModalController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
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

  async mostrarMsg(mensaje) {
    const evento = await this.toastController.create({
      message: mensaje,
      duration: 1800,
      position: 'bottom'
    });
    evento.present();
  }

  async consultarVaciarChat(consulta) {
    const alerta = await this.alertCtrl.create({
      header: consulta,
      buttons: [
        {
          text: 'Aceptar',
          handler: (dato) => {
            console.log('opción aceptar elegida');
            this.ok = true;
            if (this.ok) {
              this.chatService.deleteMsg(this.chat.id);
              this.mostrarMsg('se vació el chat');
              console.log('se vació el chat');
            }
          }
        },
        {
          text: 'Cancelar',
          handler: (dato) => {
            console.log('operación cancelada');
            this.ok = false;
          }
        }
      ]
    });
    alerta.present();
  }

  async consultarEliminarSalon(consulta) {
    const alerta = await this.alertCtrl.create({
      header: consulta,
      buttons: [
        {
          text: 'Aceptar',
          handler: (dato) => {
            console.log('opción aceptar elegida');
            this.ok = true;
            if (this.ok) {
              this.chatService.eliminarSalon(this.chat.id);
              this.modal.dismiss();
              this.mostrarMsg('se elimió el salón de chat');
              console.log('se elimió el salón de chat');
            }
          }
        },
        {
          text: 'Cancelar',
          handler: (dato) => {
            console.log('operación cancelada');
            this.ok = false;
          }
        }
      ]
    });
    alerta.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Vaciar chat',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            if (this.email == 'ceblae@gmail.com') {
              this.consultarVaciarChat('¿Está seguro de vaciar el chat?');
            } else {
              console.log('operación prohibida');
              this.mostrarMsg('Solo el Asministrador puede vaciar el chat');
            }

          }
        }, {
          text: 'Eliminar Salón',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            if (this.email == 'ceblae@gmail.com') {
              this.consultarEliminarSalon('¿Está seguro de Eliminar el Salón de chat?');
            } else {
              console.log('operación prohibida');
              this.mostrarMsg('Solo el Administrador puede eliminar el salón de chat');
            }

          }
        }, {
          text: 'Compartir',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Cancelar',
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
