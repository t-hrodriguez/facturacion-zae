import { Component, OnInit } from '@angular/core';
import { CompanyService} from "../../services/company.service";
import {GlobalStateService} from "../../services/globalState.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public phone: string = '';
  public email: string = '';
  public facebook: string = '';
  public companyName: string = '';

  constructor(
    private companyService: CompanyService,
    private globalStateService: GlobalStateService
  ) {
  }

  ngOnInit(): void {
    this.globalStateService.state$.subscribe({
      next: (r) => {
        this.companyName = r.company;
        this.phone = r.phone;
        this.email = r.email;
        this.facebook = r.facebook;
      }
    });
  }
}
