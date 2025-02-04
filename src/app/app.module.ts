import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
// import { BusquedaComponent } from './busqueda/busqueda.component';
import { BuscarComponent } from './buscar/buscar.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.modile";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { OrderComponent } from './order/order.component';
import { ClienteComponent } from './cliente/cliente.component';
import { BranchesComponent } from './branches/branches.component';
import { ServicesComponent } from './services/services.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfoModalComponent } from './buscar/info-modal/info-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResponseModalComponent } from './order/response-modal/response-modal.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrderComponent,
    ClienteComponent,
    BranchesComponent,
    ServicesComponent,
    NavbarComponent,
    FooterComponent,
    BuscarComponent,
    InfoModalComponent,
    ResponseModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [InfoModalComponent],
})
export class AppModule { }
