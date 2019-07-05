import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    public router: Router,
    public navCtrl: NavController,
    private menu: MenuController
    ) { }

    showMenu(){
      this.menu.toggle();
    }

  ngOnInit() {
    this.password = "";
      this.email = "";
  }

  onSubmitLogin() {
    this.authService.login(this.email, this.password).then(res => {
      //this.router.navigate(['/home']);
      this.navCtrl.navigateForward(`/home/${this.email}`);
    }).catch(err => alert('El nombre de usuario o contraseña son incorrectos.'))
  }

}
