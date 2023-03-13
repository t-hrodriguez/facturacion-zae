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

  SearchOrder(pointOfSale:string, saleRef:string, companyId: number, tipo: number, date: Date): Observable<any>{
    let args = [["config_id", "like", pointOfSale], ["company_id", "=", companyId]]
    if (tipo == 1)
      args.push(["pos_reference", "=", saleRef]);
    else
      args.push(["note", "=", saleRef]);
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
