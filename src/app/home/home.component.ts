import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { CompanyService } from "../services/company.service";
import { GlobalStateService } from "../services/globalState.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public ciudades = [
    {'id': '113', 'name': 'Tijuana'},
    {'id': '50', 'name': 'Acapulco'},
    {'id': '46', 'name': 'Ciudad Juárez'},
    {'id': '31', 'name': 'Hermosillo'},
    {'id': '43', 'name': 'Ensenada'},
    {'id': '52', 'name': 'Mexicali'},
    {'id': '88', 'name': 'Culiacán'},
    {'id': '51', 'name': 'Los Mochis'}
  ]

  public ciudad = '0';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private globalStateService: GlobalStateService
  ) { }

  ngOnInit(): void {
    console.log(this.globalStateService.getState());
  }

  onChangeCity(event: any){
    console.log(event)
    if (event != '0') {
      this.companyService.GetCompany(parseInt(event)).subscribe({
        next: (r) => {
          if (r.result && r.result.name) {
            let data = {
              'company': r.result.name || '',
              'phone': r.result.phone || '',
              'email': r.result.email || '',
              'facebook': r.result.facebook || ''
            }
            this.globalStateService.setState(data);
          }
        }
      });
      this.router.navigate(['buscar'], {queryParams: {ciudad: parseInt(event)}});
    }
  }

}
