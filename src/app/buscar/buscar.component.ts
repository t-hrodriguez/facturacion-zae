import { Component, OnInit } from '@angular/core';
import {BusquedaService} from "../services/busqueda.service";
import { ClienteService } from '../services/cliente.service';
import {ActivatedRoute, Router} from "@angular/router";
import {GLOBAL} from "../services/global";
import {ApiService} from "../services/api.service";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { GlobalStateService } from '../services/globalState.service';

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

  public soporte: string = '';
  public rfc: string = '';
  public pointOfSale: number = 0;
  public gasparRef: string = '';
  public saleRef: string = '';
  public saleRefTicket: string = '';
  public saleDate!: Date;
  private companyId!: number;
  public tipo: string = "0";
  public pointOfSales!: Array<any>;
  public showPOS: boolean = false;
  isLoading = false;

  dataSearchBy = [
    { 
      title: 'Nota de venta',
      description: 'Este es el ticket generado al realizar tu compra gaspar.',
      image: `<img class="w-1/2" src="assets/img/ticket-gaspar.png" alt="Nota de venta">`
    },
    { 
      title: 'Ticket de venta',
      description: 'Este es el ticket de venta que generado al realizar tu compra.',
      image: `<img class="w-1/2" src="assets/img/ticket-venta.png" alt="Ticket de venta">`
    }
  ]

  dataNumberTicket = [
    {
      title: 'Número de ticket',
      description: 'Este es el número que se encuentra en la parte inferior de tu ticket de venta, se debe ingresar <strong>sin guiones ni espacios</strong> y únicamente los números (14 digitos).',
      image: `<img class="w-3/5" src="assets/img/numero-ticket.png" alt="Ticket de venta">`
    }
  ]

  dataGasparNote = [
    {
      title: 'Número de nota',
      description: 'Este es el número que se encuentra en la parte superior de tu nota, marcado como folio venta.',
      image: `<img class="w-3/5" src="assets/img/nota-gaspar.png" alt="Nota de venta">`
    }
  ]

  dataGasparPos = [
    {
      title: 'Punto de venta',
      description: 'Es el punto de venta del cual se realizo la venta gaspar, se encuentra en la parte superior de tu nota, marcado como punto de venta.',
      image: `<img class="w-3/5" src="assets/img/nota-gaspar.png" alt="Punto de venta">`
    }
  ]


  constructor(
    private busquedaService: BusquedaService,
    private apiService: ApiService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private globalState: GlobalStateService
  ) { }

  validateNumber(event: any): void {
    const input = event.target;
    const value = input.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) {
      input.value = value.replace(/[^0-9]/g, '');
    }
  }

  ngOnInit(): void {
    // this.openDialog();
    this.globalState.state$.subscribe({
      next: (state) => {
        this.soporte = state.email;
      }
    })
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

  // normalize text to remove accents and special characters
  normalizeText(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  async SearchSaleOrder(){
    // word to search in the string
    const regex = new RegExp(`\\b${this.normalizeText('PÚBLICO EN GENERAL')}\\b`, 'i');
    if (this.tipo == "0"){
      this.toastr.warning('Selecciona un valor para "Buscar por"', 'Campo requerido');
      return;
    }
    this.isLoading = true;
    const validate = await this.validateClient(this.rfc, this.companyId)

    if (!validate) {
      return;
    } else {
      this.busquedaService.SearchOrder(this.pointOfSale, this.saleRef, this.saleRefTicket, this.companyId, parseInt(this.tipo), this.saleDate).subscribe({
        next: (r) => {
          this.isLoading = false;
          if (r.result && r.result.length == 0){
            this.isLoading = false;
            this.toastr.error('No se ha encontrado ninguna orden de venta', 'Error');
          }
          else if (r.result && r.result.length > 1){
            this.isLoading = false;
            this.toastr.warning('Esta orden de venta no puede ser facturada debido a que ha sido reembolsada', 'Advertencia');
          }
          else{
            let order = r.result[0];
            if (order.state === 'invoiced') {
              Swal.fire({
                title: 'Orden facturada',
                html: `<p>Esta intentando realizar una acción sobre una orden que ya ha sido facturada.<br/> Si necesitas una copia de la factura o tienes alguna otra pregunta, te recomendamos que te pongas en contacto con nuestro equipo de <a class="font-bold underline" href="mailto:${this.soporte}">soporte</a>.</p>`,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#cc2128',
                allowOutsideClick: false
              })
              return;
            } else if (order.partner.rfc === this.rfc){
              localStorage.setItem("order", JSON.stringify(order));
              localStorage.setItem("rfc", this.rfc)
              this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
            }
            else {
              if (order.partner.rfc === GLOBAL.rfc && regex.test(this.normalizeText(order?.partner?.name))) {
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
                      localStorage.setItem("rfc", this.rfc);
                      this.router.navigate(['cliente'], {queryParams: {ciudad: this.companyId, order_id: order.id}});
                    }
                  }, error: (e) => {
                    this.isLoading = false;
                    console.log(e)
                    this.toastr.error('Ha ocurrido un error al obtener los datos del cliente', 'Error');
                  }
                });
              } else {
                this.isLoading = false;
                // this.toastr.warning('Esta orden no puede ser facturada ya que está asignada a un cliente distinto', 'Advertencia');
                Swal.fire({
                  title: 'Parece que hay un pequeño inconveniente con tu orden',
                  html: `<p>No se puede facturar porque está asignada a un cliente diferente. Te recomendaría verificar los detalles de la orden o contactar a nuestro equipo de <a class="font-bold underline" href="mailto:${this.soporte}">soporte</a>.</p>`,
                  icon: 'warning',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#cc2128',
                  allowOutsideClick: false
                })
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

  async validateClient(rfc: string, companyId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.clienteService.ObtenerClientes(rfc, companyId).subscribe({
        next: (r) => {
          if (r.result){
            if (r.result.length === 1){
              if (r.result[0].x_studio_categoria_cliente === "Crédito") {
                this.isLoading = false;
                Swal.fire({
                  title: 'Cliente de crédito',
                  html: `<p>Si el cliente tiene un crédito activo, no podremos proceder con la solicitud. Si necesitas más información comunicarse con nuestro equipo de <a class="font-bold underline" href="mailto:${this.soporte}">soporte</a>.</p>`,
                  icon: 'warning',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#cc2128',
                  allowOutsideClick: false
                })
                resolve(false);
              } else {
                resolve(true);
              }
            } else if (r.result.length > 1) {
              this.isLoading = false;
              Swal.fire({
                title: 'RFC duplicado',
                html: `<p>Queremos informarte que hemos detectado que hay dos clientes registrados con el mismo <strong>RFC</strong>. Esto puede causar confusiones en la gestión de sus datos y transacciones. Te recomendamos que revises la información o comunícate con nuestro equipo de <a class="font-bold underline" href="mailto:${this.soporte}">soporte</a>.</p>`,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#cc2128',
                allowOutsideClick: false
              })
              resolve(false);
            } else {
              resolve(true);
            }
          }
        }, error: (e) => {
          console.log(e);
          reject(e);
        }
      })
    });
  }

  returnHome() {
    localStorage.removeItem('order');
    localStorage.removeItem('rfc');
    this.router.navigate(['/']);
  }

  validateData(): boolean {
    const ticket = (
      this.saleRefTicket.length >=14 &&
      this.rfc !== '' && this.rfc.length >= 12 &&
      this.saleDate !== undefined
    )

    const nota = (
      this.pointOfSale !== 0 &&
      this.rfc !== '' && this.rfc.length >= 12 &&
      this.saleRef !== ''&&
      this.saleDate !== undefined
    )

    const tipo: {[key: string]: boolean} = {
      '1': ticket,
      '2': nota
    }

    if (this.tipo !== '0'){
      if(tipo[this.tipo]){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
