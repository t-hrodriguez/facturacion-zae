import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from "./global";
import {Observable} from "rxjs";

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
