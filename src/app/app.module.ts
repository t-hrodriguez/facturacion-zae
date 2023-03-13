import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.modile";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { OrderComponent } from './order/order.component';
import { ClienteComponent } from './cliente/cliente.component';
import { BranchesComponent } from './branches/branches.component';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
    AppComponent,
    BusquedaComponent,
    HomeComponent,
    OrderComponent,
    ClienteComponent,
    BranchesComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
