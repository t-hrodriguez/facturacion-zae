import { Component, OnInit } from '@angular/core';
import {BusquedaService} from "../services/busqueda.service";
import { ClienteService } from '../services/cliente.service';
import {ActivatedRoute, Router} from "@angular/router";
import {GLOBAL} from "../services/global";
import {ApiService} from "../services/api.service";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {
  public tipoBusqueda = [
    {id: "1", name: 'Ticket de venta'},
    {id: "2", name: 'Nota de venta'}
  ]

  public rfc: string = '';
  public pointOfSale: number = 0;
  public gasparRef: string = '';
  public saleRef: string = '';
  public saleDate!: Date;
  private companyId!: number;
  public tipo: string = "0";
  public pointOfSales!: Array<any>;
  public showPOS: boolean = false;
  isLoading = false;

  dataSearchBy = [
    { 
      title: 'Ticket de venta',
      description: 'Este es el número de orden que se encuentra en la parte inferior de tu ticket de venta',
      image: `<img class="w-1/2" src="assets/img/1tomza.png" alt="Ticket de venta">`
    },
    { 
      title: 'Nota de venta',
      description: 'Este es el número de orden que se encuentra en la parte inferior de tu nota de venta',
      image: `<img class="w-1/2" src="assets/img/1tomza2.png" alt="Nota de venta">`
    }
  ]

  constructor(
    private busquedaService: BusquedaService,
    private apiService: ApiService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.openDialog();
    this.aRoute.queryParams.subscribe({
      next: params => {
        if(params['ciudad'])
          this.companyId = parseInt(params['ciudad']);
      },
      error: err => {
        this.router.navigate(['/'])
      }});
    this.apiService.GetPointOfSales(this.companyId).subscribe({next: (value) => {
        this.pointOfSales = value.result;
      },
      error: (error) => {
        console.log(error);
        this.toastr.error('Ha ocurrido un error al obtener los puntos de venta, por favor reintenta en unos minutos', 'Error');
      }
    });
  }

  openDialog(data: {title:string, description: string, image: string}[]): void {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  SearchSaleOrder(){
    if (this.tipo == "0"){
      this.toastr.warning('Selecciona un valor para "Buscar por"', 'Campo requerido');
      return;
    }
    this.isLoading = true;
    this.busquedaService.SearchOrder(this.pointOfSale, this.saleRef, this.companyId, parseInt(this.tipo), this.saleDate).subscribe({
      next: (r) => {
        this.isLoading = false;
        if (r.result && r.result.length == 0){
          this.isLoading = false;
          // alert("No se han encontrado ninguna orden de venta");
          this.toastr.error('No se ha encontrado ninguna orden de venta', 'Error');
        }
        else if (r.result && r.result.length > 1){
          this.isLoading = false;
          // alert("Esta orden de venta no puede ser facturada debido a que ha sido reembolsada")
          this.toastr.warning('Esta orden de venta no puede ser facturada debido a que ha sido reembolsada', 'Advertencia');
        }
        else{
          let order = r.result[0];
          if (order.partner.rfc === this.rfc){
            console.log('mismo rfc')
            localStorage.setItem("order", JSON.stringify(order));
            localStorage.setItem("rfc", this.rfc)
            this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
          }
          else {
            if (order.partner.rfc === GLOBAL.rfc) {
              this.clienteService.ObtenerCliente(this.rfc, this.companyId).subscribe({
                next: (r) => {
                  if (r.result && r.result.id){
                    this.clienteService.CambiarClienteOrden(order.id, r.result.id).subscribe({
                      next: (r) => {
                        if (r.result && !r.result.error) {
                          localStorage.setItem("order", JSON.stringify(r.result?.order));
                          localStorage.setItem("rfc", this.rfc)
                          this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
                        } else {
                          this.isLoading = false;
                          // alert("Ha ocurrido un error al cambiar el cliente de la orden: " + r.result?.message);
                          this.toastr.error('Ha ocurrido un error al cambiar el cliente de la orden: ' + r.result?.message, 'Error');
                        }
                      }, error: (e) => {
                        this.isLoading = false;
                        console.log(e)
                      }
                    });
                  } else {
                    this.isLoading = false;
                    localStorage.setItem("order", JSON.stringify(order));
                    localStorage.setItem("rfc", this.rfc)
                    this.router.navigate(['cliente'], {queryParams: {ciudad: this.companyId, order_id: order.id}});
                  }
                }, error: (e) => {
                  this.isLoading = false;
                  console.log(e)
                  this.toastr.error('Ha ocurrido un error al obtener los datos del cliente', 'Error');
                }
              });
              // console.log(clientExists)

              
            } else {
              this.isLoading = false;
              // alert("Esta orden no puede ser facturada ya que está asignada a un cliente distinto");
              this.toastr.warning('Esta orden no puede ser facturada ya que está asignada a un cliente distinto', 'Advertencia');
              return;
            }
          }

        }
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        // alert('')
        this.toastr.error('Ha ocurrido un error con el servicio al buscar la orden de venta', 'Error');
      }
    });
  }
}
