import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public email: string;
  public password: string;
  public password2: string;
  public nombre: string;

  constructor(
    private auth: AuthService,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    private router: Router
  ) { }

  async mostrarMsg(mensaje) {
    const evento = await this.toastController.create({
      message: mensaje,
      duration: 1800,
      position: 'middle'
    });
    evento.present();
  }

  ngOnInit() {
  }

  onSubmitRegister() {
    if (this.password == this.password2) {
      this.auth.register(this.email, this.password, this.nombre).then(auth => {
        this.mostrarMsg('Registro exitoso');
        this.router.navigate(['home']);
        console.log(auth)
        this.password = "";
        this.password2 = "";
      }).catch(err => console.log(err))
    } else {
      this.mostrarMsg('Las contraseñas no coinciden');
      this.password = "";
      this.password2 = "";
    }
  }


}
