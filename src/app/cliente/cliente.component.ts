import {Component, OnInit} from '@angular/core';
import {ClienteService} from "../services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  fiscalRegimes = [
    {id: "601", name: "General de Ley Personas Morales"},
    {id: "603", name: "Personas Morales con Fines No Lucrativos"},
    {id: "605", name: "Sueldos y Salarios e Ingresos Asimilados a Salarios"},
    {id: "606", name: "Arrendamiento"},
    {id: "607", name: "Régimen de Enajenación o Adquisición de Bienes"},
    {id: "608", name: "Demás Ingresos"},
    {id: "609", name: "Consolidación"},
    {id: "610", name: "Residentes en el Extranjero sin Establecimiento Permanente en México"},
    {id: "611", name: "Ingresos por Dividendos (socios y accionistas)"},
    {id: "612", name: "Personas Físicas con Actividades Empresariales y Profesionales"},
    {id: "614", name: "Ingresos por Intereses"},
    {id: "615", name: "Régimen de los Ingresos por Obtención de Premios"},
    {id: "616", name: "Sin Obligaciones Fiscales"},
    {id: "620", name: "Sociedades Cooperativas de Producción que Optan por Diferir sus Ingresos"},
    {id: "621", name: "Incorporación Físcal"},
    {id: "622", name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras"},
    {id: "623", name: "Opcional para Grupos de Sociedades"},
    {id: "624", name: "Coordinados"},
    {id: "625", name: "Régimen de las Actividades Empresariales con Ingresos a Través de Plataformas Tecnológicas"},
    {id: "626", name: "Régimen Simplificado de Confianza - RESICO"},
    {id: "628", name: "Hidrocarburos"},
    {id: "629", name: "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales"},
    {id: "630", name: "Enajenación de Acciones en Bolsa de Valores"}
  ]

  public name: string = "";
  // public street_name?: string;
  // public street_number?: number;
  // public l10n_mx_edi_colony?: string;
  public zip: string = "";
  public vat: string = "";
  public email: string = "";
  public order_id: number = 0;
  // TODO Agregar Régimen fiscal, no se encuentra en odoo, ¿porque? No se
  public l10n_mx_edi_fiscal_regime!: string;
  private companyId!: number;
  public order: any;
  isLoading = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // @ts-ignore
    this.vat = localStorage.getItem("rfc");
  }

  ngOnInit(): void {
    this.fiscalRegimes.sort((a, b) => a.name.localeCompare(b.name));
    this.aRoute.queryParams.subscribe({
      next: params => {
        if(params['ciudad'])
          console.log(params['ciudad'])
          this.companyId = parseInt(params['ciudad']);
          this.order_id = parseInt(params['order_id']);
      },
      error: err => {
        this.router.navigate(['/'])
      }});
  }

  CreateCustomer() {
    this.isLoading = true;
    if(this.isFormValid()){
      this.clienteService.CrearCliente(this.name, this.zip, this.vat, this.email, this.companyId, this.l10n_mx_edi_fiscal_regime, this.order_id).subscribe({
          next: (r) => {
            this.isLoading = false;
            if (r.result && r.result.id){
              // @ts-ignore
              // update order with partner id
              this.order = JSON.parse(localStorage.getItem("order"));
              this.order.partner = {
                id: r.result.id,
                name: this.name,
                rfc: this.vat
              }
              localStorage.setItem("order", JSON.stringify(this.order));

              this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
            }
            if (r.result.error){
              // alert("Ha ocurrido un error en el servidor y no se ha podido crear el cliente: " + r.result?.message);
              this.toastr.error('Ha ocurrido un error en el servidor y no se ha podido crear el cliente: ' + r.result?.message, 'Error');
            }
          },
          error: (e) => {
            this.isLoading = false;
            // TODO handle error
            this.toastr.error('Ha ocurrido un error en el servidor y no se ha podido crear el cliente', 'Error');
          }
        }
      );
    }
    else {
      this.isLoading = false;
      // alert("Por favor llena todos los campos, no se permiten espacios vacíos");
      this.toastr.warning('Por favor llena todos los campos, no se permiten espacios vacíos', 'Advertencia');
    }
  }

  isFormValid(): boolean {
    return this.name?.trim().length > 1 && this.zip?.trim().length > 0 && this.vat?.trim().length > 11
      && this.email?.trim().length > 0 && this.l10n_mx_edi_fiscal_regime?.trim() != '';
  }

}
