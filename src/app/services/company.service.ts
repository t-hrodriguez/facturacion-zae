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
export class CompanyService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    this.url = GLOBAL.url;
  }

  GetCompany(companyId: number): Observable<any>{
    let body = {
      "params": {
        "company": companyId
      }
    };

    return this.httpClient.post(this.url + "infocompany", JSON.stringify(body), HTTP_HEADERS);
  }
}
