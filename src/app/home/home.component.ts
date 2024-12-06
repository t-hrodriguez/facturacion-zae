import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public ciudades = [
    {'id': '47', 'name': 'Acapulco'},
    {'id': '46', 'name': 'Ciudad Juárez'},
    {'id': '31', 'name': 'Hermosillo'}
  ]

  public ciudad = '0';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onChangeCity(event: any){
    console.log(event)
    if (event != '0') {
      console.log(this.ciudad)
      this.router.navigate(['buscar'], {queryParams: {ciudad: parseInt(event)}});
    }
  }

}
