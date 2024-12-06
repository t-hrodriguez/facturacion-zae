import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";
import {Observable, ObservedValueOf} from "rxjs";
import {PointOfSale} from "../models/PointOfSale";

const HTTP_HEADERS = {
  headers: new HttpHeaders({
    'Authorization': GLOBAL.password,
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url: string;
  constructor(private httpClient: HttpClient) {
    this.url = GLOBAL.url;
  }

  TimbrarFactura(orderId: number, parterId: number, usage: string): Observable<any>{
    let body = {
      "params": {
        "orderId": orderId,
        "partnerId": parterId,
        "usage": usage
      }
    };

    return this.httpClient.post(this.url + "facturar", JSON.stringify(body), HTTP_HEADERS);
  }

  GetPointOfSales(company: number): Observable<any>{
    let body = {
      "params": {
        "company": company
      }
    };

    return this.httpClient.post(this.url + 'pos', JSON.stringify(body), HTTP_HEADERS);

  }
}
