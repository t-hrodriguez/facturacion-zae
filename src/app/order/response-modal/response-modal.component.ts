import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, ActivatedRoute } from '@angular/router';
import { IClient } from 'src/app/interfaces/client.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.css'],
})
export class ResponseModalComponent implements OnInit {
  partnerId: number = 0;
  orderId: number = 0;

  dataClient: IClient = {
    name: '',
    vat: '',
    email: '',
    zip: '',
    l10n_mx_edi_fiscal_regime: 0,
  };

  isLoading: boolean = false;
  isLoadingUpdate: boolean = false;

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

  constructor(
    private dialogRef: MatDialogRef<ResponseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fiscalRegimes.sort((a, b) => a.name.localeCompare(b.name));
    const order = localStorage.getItem('order');
    if (order) {
      this.isLoading = true;
      let orderJson = JSON.parse(order);
      this.partnerId = orderJson.partner.id;
      this.orderId = orderJson.id;
      this.clienteService.ObtenerClientePorId(orderJson.partner?.id).subscribe({
        next: (r) => {
          if (r.result && !r.result.error) {
            this.dataClient = r?.result?.partner as IClient;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.toastr.error(
              r?.result?.message,
              'Error',
              { progressBar: true }
            );
            this.close();
          }
        },
        error: (e) => {
          this.toastr.error('Ha ocurrido un error con el servidor al obtener los datos del cliente', 'Error');
          this.isLoading = false;
          this.close();
        },
      });
    } else {
      this.toastr.warning('No se ha encontrado la orden', 'Advertencia');
    }
  }


  updateFiscalData(): void {
    if (this.validateData()) {
      this.isLoadingUpdate = true;
      this.clienteService.ActualizarCliente(this.partnerId, this.dataClient, this.orderId).subscribe({
        next: (r) => {
          if (r.result && !r.result.error) {
            console.log('datos fiscales: ',r.result);
            this.toastr.success(
              'Datos fiscales actualizados correctamente',
              'Éxito',
              { progressBar: true }
            );
            localStorage.setItem('order', JSON.stringify(r.result.order));
            this.isLoadingUpdate = false;
            this.close();
          } else if (r.error){
            this.isLoadingUpdate = false;
            this.toastr.error(
              'Ha ocurrido un error con el servidor al actualizar los datos del cliente',
              'Error',
              { progressBar: true }
            );
          } else {
            this.toastr.error(
              r.result?.message,
              'Error',
              { progressBar: true }
            );
            this.isLoadingUpdate = false;
          }
        },
        error: (e) => {
          this.toastr.error('Ha ocurrido un error con el servidor al actualizar los datos del cliente', 'Error');
          this.isLoadingUpdate = false;
        },
      });
    } else {
      this.toastr.warning('Por favor, llena todos los campos', 'Advertencia');
    }
  }

  validateData(): boolean {
    if (this.dataClient.name && this.dataClient.vat && this.dataClient.email && this.dataClient.zip && this.dataClient.l10n_mx_edi_fiscal_regime) {
      return true;
    }
    return false;
  }

  close(): void {
    this.dialogRef.close();
  }
}
