import {Component, OnInit} from '@angular/core';
import {ClienteService} from "../services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";

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
  // TODO Agregar Régimen fiscal, no se encuentra en odoo, ¿porque? No se
  public l10n_mx_edi_fiscal_regime!: string;
  private companyId!: number;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    // @ts-ignore
    this.vat = localStorage.getItem("rfc");
  }

  ngOnInit(): void {
    this.aRoute.queryParams.subscribe({
      next: params => {
        if(params['ciudad'])
          console.log(params['ciudad'])
          this.companyId = parseInt(params['ciudad']);
      },
      error: err => {
        this.router.navigate(['/'])
      }});
  }

  CreateCustomer() {
    if(this.isFormValid()){
      this.clienteService.CrearCliente(this.name, this.zip, this.vat, this.email, this.companyId, this.l10n_mx_edi_fiscal_regime).subscribe({
          next: (r) => {
            if (r.result && r.result.id){
              this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
            }
            if (r.result.error){
              alert("Ha ocurrido un error en el servidor y tu factura no pudo ser timbrada, si el problema persiste comunicate con soporte para obtener tu factura")
            }
          },
          error: (e) => {
            // TODO handle error
          }
        }
      );
    }
    else {
      alert("Por favor llena todos los campos, no se permiten espacios vacíos");
    }
  }

  isFormValid(): boolean {
    return this.name?.trim().length > 10 && this.zip?.trim().length > 0 && this.vat?.trim().length > 11
      && this.email?.trim().length > 0 && this.l10n_mx_edi_fiscal_regime?.trim() != '';
  }

}
