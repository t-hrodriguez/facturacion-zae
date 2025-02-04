import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from "./global";
import {Observable} from "rxjs";
import { IClient, IClientResponse, IOdooClientResponse } from '../interfaces/client.interface';

const HTTP_HEADERS = {
  headers: new HttpHeaders({
    'Authorization': GLOBAL.password,
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = GLOBAL.url;
  }

  ObtenerCliente(rfc: string, cid: number): Observable<any>{
    let body = {
      "params": {
        "rfc": rfc,
        "cid": cid
      }
    };
    return this.httpClient.post(this.url + "cliente", JSON.stringify(body), HTTP_HEADERS);
  }

  CambiarClienteOrden(orderId: number, partnerId: number): Observable<any>{
    let body = {
      "params": {
        "order_id": orderId,
        "partner_id": partnerId
      }
    };
    return this.httpClient.post(this.url + "cliente/changeorder", JSON.stringify(body), HTTP_HEADERS);
  }

  ObtenerClientePorId(partnerId: number): Observable<IOdooClientResponse>{
    let body = {
      "params": {
        "partner_id": partnerId
      }
    };
    return this.httpClient.post<IOdooClientResponse>(this.url + "cliente/search", JSON.stringify(body), HTTP_HEADERS);
  }

  ActualizarCliente(partner_id: number, data: any, order_id: number): Observable<any>{
    let body = {
      "params": {
        "partner_id": partner_id,
        "partner_data": data,
        "order_id": order_id
      }
    };
    return this.httpClient.post(this.url + "cliente/update", JSON.stringify(body), HTTP_HEADERS);
  }

  CrearCliente(name: string, zip: string, vat: string, email: string, companyId: number, l10n_mx_edi_fiscal_regime: string, orderId: number): Observable<any>{
    let body = {
      "params": {
        "partner": {
          "name": name,
          "vat": vat,
          "zip": zip,
          "email": email,
          "company_id": companyId,
          "l10n_mx_edi_fiscal_regime": l10n_mx_edi_fiscal_regime
        },
        "order_id": orderId
      }
    };
    return this.httpClient.post(this.url + "cliente/crear", JSON.stringify(body), HTTP_HEADERS);
  }
}
