import { Component, OnInit } from '@angular/core';
import {ClienteService} from "../services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api.service";

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

  constructor(
    private clienteService: ClienteService,
    private apiService: ApiService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    // @ts-ignore
    this.order = JSON.parse(localStorage.getItem("order"));
    this.aRoute.queryParams.subscribe(params =>{
      console.log(params)
      if (params['ciudad'])
        this.companyId = parseInt(params['ciudad'])
      else
        this.router.navigate(['/'])
    });

    // @ts-ignore
    this.clienteService.ObtenerCliente(localStorage.getItem("rfc")).subscribe({
      next: (r) => {
        if (r.result && r.result.id)
          this.partnerId = r.result.id;
        else
          this.router.navigate(['cliente'], {queryParams: {ciudad: this.companyId}});
      }
    });
  }

  TimbrarFactura(){
    this.isWorking = true;
    if (this.l10n_mx_edi_usage == '0'){
      alert('Debes seleccionar un uso de CFDI para continuar');
      this.isWorking = false;
      return;
    }
    this.apiService.TimbrarFactura(this.order.id, this.partnerId, this.l10n_mx_edi_usage).subscribe({
      next: value => {
        if (value.result === "OK"){
          this.showButton = false;
          this.isWorking = false;
          alert("La factura se ha generado exitosamente y se ha enviado al correo registrado")
        }
        if (value.result && value.result.error){
          alert(value.result.message);
        }
        if (value.error){
          alert("Ha ocurrido un error en el servidor y tu factura no pudo ser timbrada, si el problema persiste comunicate con soporte para obtener tu factura")
        }
      },
      error: err => {
        // TODO handle error
        alert("Error al generar factura ");
      }
    });
  }

}
