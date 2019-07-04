import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { Router } from '@angular/router';

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
    public router: Router
    ) { }

  ngOnInit() {
    this.password = "";
      this.email = "";
  }

  onSubmitLogin() {
    this.authService.login(this.email, this.password).then(res => {
      this.router.navigate(['/home']);
      //this.navController.navigateForward('home');
    }).catch(err => alert('El nombre de usuario o contraseña son incorrectos.'))
  }

}
