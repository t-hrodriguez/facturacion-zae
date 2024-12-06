import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from "./global";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = GLOBAL.url;
  }

  SearchOrder(pointOfSale:number, saleRef:string, companyId: number, tipo: number, date: Date): Observable<any>{
    let args = []
    if (tipo == 1)
      args.push(["pos_reference", "like", saleRef], ["company_id", "=", companyId]);
    else
      args.push(["note", "=", saleRef], ["config_id", "=", pointOfSale], ["company_id", "=", companyId]);
    let headers = new HttpHeaders({
      'Authorization': GLOBAL.password,
      'Content-Type': 'application/json'
    })
    let body = {
      "params": {
        "args":
          args,
        "date": date
        }
    };
    return this.httpClient.post(this.url + "buscar", JSON.stringify(body), {headers});
  }
}
