import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.page.html',
  styleUrls: ['./quienes-somos.page.scss'],
})
export class QuienesSomosPage implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  showMenu(){
    this.menu.toggle();
  }

}
