import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { ChatsService, chat } from '../servicios/chats.service';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../componentes/chat/chat.component';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public chatRooms: any = [];
  public email: string;

  constructor(
    public autService: AuthService,
    public chatService: ChatsService,
    private modal: ModalController,
    public activateRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController
  ) { }

  async mostrarMsg(mensaje: string) {
    const evento = await this.toastController.create({
      message: mensaje,
      duration: 1800,
      position: 'middle'
    });
    evento.present();
  }


  onLogout() {
    this.autService.logout();
  }

  ngOnInit() {
    this.email = this.activateRoute.snapshot.paramMap.get('email');
    this.chatService.getChatRooms().subscribe(chats => {
      this.chatRooms = chats;
    });
  }

  openChat(chat) {
    this.modal.create({
      component: ChatComponent,//se le pasa la clase.
      componentProps: {
        chat: chat,
        email: this.email //se pasa el email para ver la procedencia del mensaje.
      }
    }).then((modal) => modal.present())

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Desconectarse',
        role: 'logout',
        icon: 'log-out',
        handler: () => {
          console.log('desconectándose');
          this.onLogout();
        }
      }, {
        text: 'Crear Salón',
        icon: 'chatbubbles',
        handler: () => {
          console.log('Crear Salón clicked');
          this.crearSalon();
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

  async crearSalon() {
    const alerta = await this.alertCtrl.create({
      header: 'Información requerida',
      inputs: [
        {
          name: 'txtNombre',
          type: 'text',
          placeholder: 'Nombre de la sala'
        },
        {
          name: 'txtDescripcion',
          type: 'text',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Aceptar',
          handler: (dato) => {
            console.log(dato.txtNombre);
            console.log(dato.txtDescripcion);
            this.chatService.createSalonToFirebase(dato.txtNombre, dato.txtDescripcion)
          }
        },
        {
          text: 'Cancelar',
          handler: (dato) => {
            console.log('Construcción de salón cancelada');
          }
        }
      ]
    });
    alerta.present();
  }

}
