import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
// import {BusquedaComponent} from "./busqueda/busqueda.component";
import { BuscarComponent } from "./buscar/buscar.component";
import {HomeComponent} from "./home/home.component";
import {OrderComponent} from "./order/order.component";
import {ClienteComponent} from "./cliente/cliente.component";
import {ServicesComponent} from "./services/services.component";
import {BranchesComponent} from "./branches/branches.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'buscar', component: BuscarComponent },
  { path: 'orden', component: OrderComponent},
  { path: 'cliente', component: ClienteComponent },
  { path: 'servicios', component: ServicesComponent },
  { path: 'sucursales', component: BranchesComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
