import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { ChatsService, chat } from '../servicios/chats.service';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../componentes/chat/chat.component';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

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
    public actionSheetController: ActionSheetController
  ) { }


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
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
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
