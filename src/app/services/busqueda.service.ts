import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GLOBAL} from "./global";
import {Observable} from "rxjs";
import { 
  TijuanaOffset, 
  CiudadJuarezOffset, 
  HermosilloOffset, 
  AcapulcoOffset, 
  EnsenadaOffset, 
  MexicaliOffset 
} from '../utils';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private url: string;

  timesMap: { [key: string]: number } = {
    '113': TijuanaOffset,
    '50': CiudadJuarezOffset,
    '46': HermosilloOffset,
    '31': AcapulcoOffset,
    '43': EnsenadaOffset,
    '52': MexicaliOffset
  }

  // {'id': '113', 'name': 'Tijuana'},
  //   {'id': '50', 'name': 'Acapulco'},
  //   {'id': '46', 'name': 'Ciudad Juárez'},
  //   {'id': '31', 'name': 'Hermosillo'}

  constructor(private httpClient: HttpClient) {
    this.url = GLOBAL.url;
  }

  SearchOrder(pointOfSale:number, saleRef:string, saleRefTicket: string, companyId: number, tipo: number, date: Date): Observable<any>{
    let args = []
    if (tipo == 1){
      // agregar guines a saleRefTicket despues del septimo caracter
      saleRefTicket = saleRefTicket.slice(0, 7) + '-' + saleRefTicket.slice(7);
      saleRefTicket = saleRefTicket.slice(0, 11) + '-' + saleRefTicket.slice(11);

      args.push(["pos_reference", "like", `Orden ${saleRefTicket}`], ["company_id", "=", companyId]);
    }
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
          "date": date,
          "utc_diff": this.timesMap[companyId.toString()] || 0
        }
    };
    return this.httpClient.post(this.url + "buscar", JSON.stringify(body), {headers}); //this.httpClient.post(this.url + "buscar", JSON.stringify(body), {headers})
  }
}
