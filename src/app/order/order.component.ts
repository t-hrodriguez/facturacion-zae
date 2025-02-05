import { Component, OnInit } from '@angular/core';
import {ClienteService} from "../services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import { ResponseModalComponent } from './response-modal/response-modal.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
// import { TijuanaOffset, CiudadJuarezOffset, HermosilloOffset, AcapulcoOffset } from '../utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  ediUse = [
    {id: "G01", name: "Adquisición de mercancias"},
    {id: "G02", name: "Devoluciones, descuentos o bonificaciones"},
    {id: "G03", name: "Gastos en general"},
    {id: "I01", name: "Construcciones"},
    {id: "I02", name: "Mobiliario y equipo de oficina por inversiones"},
    {id: "I03", name: "Equipo de transporte"},
    {id: "I04", name: "Equipo de cómputo y accesorios"},
    {id: "I05", name: "Daos, troqueles, moldes, matrices y herramental"},
    {id: "I06", name: "Comunicaciones telefónicas"},
    {id: "I07", name: "Comunicaciones satelitales"},
    {id: "I08", name: "Otra maquinaria y equipo"},
    {id: "D01", name: "Honorarios médicos, dentales y gastos hospitalarios"},
    {id: "D02", name: "Gastos médicos por incapacidad o dispacidad"},
    {id: "D03", name: "Gastos Funerales"},
    {id: "D04", name: "Donativos"},
    {id: "D05", name: "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)"},
    {id: "D06", name: "Aportaciones voluntarias al SAR"},
    {id: "D07", name: "Primas por seguros de gastos médicos"},
    {id: "D08", name: "Gastos de transportación escolar obligatoria"},
    {id: "D09", name: "Depósitos en cuentas para el ahorro, primas que tengan como base planes de prensiones"},
    {id: "D10", name: "Pagos por servicios educativos (colegiaturas)"},
    {id: "P01", name: "Por definir"},
    {id: "S01", name: "Sin efectos fiscales"},
  ]

  public order: any;
  private partnerId: number = 0;
  public showButton: boolean = true;
  private companyId!: number;
  public l10n_mx_edi_usage: string = "0";
  public isWorking: boolean = false;
  public mensaje: boolean = false;
  public tipoAlert: string = 'error';
  public mensajeText: string = '';
  public isLoading: boolean = false;

  public mensajeHeader : string = '';

  constructor(
    private clienteService: ClienteService,
    private apiService: ApiService,
    private router: Router,
    private aRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    // console.log('tijuana: ', TijuanaOffset);
    // console.log('ciudad juarez: ', CiudadJuarezOffset);
    // console.log('hermosillo: ', HermosilloOffset);
    // console.log('acapulco: ', AcapulcoOffset);

    // const time = new Date();
    // const offset = time.getTimezoneOffset() / 60;
    // console.log('offset: ', offset);
    this.ediUse.sort((a, b) => a.name.localeCompare(b.name));
    // @ts-ignore
    this.order = JSON.parse(localStorage.getItem("order"));
    if (this.order) {
      this.aRoute.queryParams.subscribe(params =>{
        if (params['ciudad']) {
          this.companyId = parseInt(params['ciudad'])
          //@ts-ignore
          this.clienteService.ObtenerCliente(localStorage.getItem("rfc"), this.companyId).subscribe({
            next: (r) => {
              if (r.result && r.result.id){
                this.partnerId = r.result.id;
              } else
                this.router.navigate(['cliente'], {queryParams: {ciudad: this.companyId, order_id: this.order.id} });
            }
          });
        }
        else
          // if company id is not found, redirect to home
          this.router.navigate(['/'])
      });
    } else {
      //if order is not found, redirect to home
      this.router.navigate(['/'])
    }
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(ResponseModalComponent, {
        width: '450px',
        data: {
          id: this.order?.parter?.id,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // refresh local storage order key and variable partnerId when dialog is closed
        // @ts-ignore
        this.order = JSON.parse(localStorage.getItem("order"));
        this.partnerId = this.order.partner.id;
      });
    }

  substractOffsetTime(date: string): string {
    // get time offset and substract it from the date
    const hoursOffset: number = new Date().getTimezoneOffset() / 60;
    let dateTyped = new Date(date);
    dateTyped.setHours(dateTyped.getHours() - hoursOffset);

    const day = dateTyped.getDate() < 10 ? `0${dateTyped.getDate()}` : dateTyped.getDate();
    const month = dateTyped.getMonth() + 1 < 10 ? `0${dateTyped.getMonth() + 1}` : dateTyped.getMonth() + 1;

    const hours = dateTyped.getHours() < 10 ? `0${dateTyped.getHours()}` : dateTyped.getHours();
    const minutes = dateTyped.getMinutes() < 10 ? `0${dateTyped.getMinutes()}` : dateTyped.getMinutes();
    const seconds = dateTyped.getSeconds() < 10 ? `0${dateTyped.getSeconds()}` : dateTyped.getSeconds();

    return date ? `${day}-${month}-${dateTyped.getFullYear()} ${hours}:${minutes}:${seconds}` : '';
  }

  returnHome() {
    localStorage.removeItem('order');
    localStorage.removeItem('rfc');
    this.router.navigate(['/']);
  }

  TimbrarFactura(){
    this.isWorking = true;
    if (this.l10n_mx_edi_usage == '0'){
      // alert('Debes seleccionar un uso de CFDI para continuar');
      // Swal.fire({
      //   title: 'Campos requeridos',
      //   text: 'Debes seleccionar un uso de CFDI para continuar',
      //   icon: 'warning',
      //   toast: true,
      //   position: 'top-end',
      //   timer: 4000,
      //   timerProgressBar: true,
      //   background: '#e7a71d',
      //   color: '#fff',
      //   iconColor: '#fff',
      //   showConfirmButton: false,
      //   didOpen: (toast) => {
      //     toast.onclick = () => {
      //       Swal.close();
      //     }
      //   }
      // })
      this.toastr.warning('Debes seleccionar un uso de CFDI para continuar', 'Campos requeridos', {
        progressBar: true
      });
      this.isWorking = false;
      this.isLoading = false;
      return;
    }
    this.apiService.TimbrarFactura(this.order.id, this.partnerId, this.l10n_mx_edi_usage).subscribe({
      next: value => {
        if (value.result === "OK"){
          this.isWorking = false;

          Swal.fire({
            title: 'Factura generada',
            text: 'La factura se ha generado exitosamente y se ha enviado al correo registrado, redireccionando a la vista de busqueda...',
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#cc2128',
            showConfirmButton: true,
            willClose: () => {
              this.router.navigate(['buscar'], {queryParams: {ciudad: this.companyId}});
            }
          })
        }
        if (value.result && value.result.error){
          if (value.result.message)
            // alert(value.result.message);
            this.isWorking = false;

            Swal.fire({
              title: 'Error al timbrar la factura',
              text: value.result.message,
              icon: 'error',
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: 'Cerrar',
              confirmButtonColor: '#cc2128',
            })
          if (value.result.messages){
            // let mensaje = []
            // this.mensaje = true;
            // this.mensajeHeader = 'Error al timbrar'
            this.isWorking = false;
            for (let i of value.result.messages){
              if (i){
                // @ts-ignore
                this.mensajeText = i;
              }
            }
            Swal.fire({
              title: 'Error al timbrar la factura',
              html: this.mensajeText,
              icon: 'error',
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonText: 'Cerrar',
              confirmButtonColor: '#cc2128',
            })
          }
          this.isWorking = false;
        }
        if (value.error){
          this.isWorking = false;
          Swal.fire({
            title: 'Ha ocurrido un error con el servidor',
            text: value.error?.message,
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: true,
            closeButtonHtml: 'Cerrar',
            confirmButtonColor: '#cc2128',
            confirmButtonText: 'Cerrar',
            backdrop: true,
          });
        }
      },
      error: err => {
        // TODO handle error
        // alert("Error al generar factura ");
        Swal.fire({
          title: 'Ha ocurrido un error con el servidor',
          // text: value.error?.message,
          icon: 'error',
          allowOutsideClick: false,
          showConfirmButton: true,
          closeButtonHtml: 'Cerrar',
          confirmButtonColor: '#cc2128',
          confirmButtonText: 'Cerrar',
          backdrop: true,
        });
        this.isWorking = false;
      }
    });
  }


  closeMessageTimeout(){
    setTimeout(() => {
      this.mensaje = false;
    }, 5000);
  }
}
