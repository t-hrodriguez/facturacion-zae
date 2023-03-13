import { Component, OnInit } from '@angular/core';
import {BusquedaService} from "../services/busqueda.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GLOBAL} from "../services/global";

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public tipoBusqueda = [
    {id: "1", name: 'Orden de venta'},
    {id: "2", name: 'Ticket'}
  ]

  public rfc: string = '';
  public pointOfSale: string = '';
  public gasparRef: string = '';
  public saleRef: string = '';
  public saleDate!: Date;
  private companyId!: number;
  public tipo: string = "0";

  constructor(
    private busquedaService: BusquedaService,
    private router: Router,
    private aRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.aRoute.queryParams.subscribe({
      next: params => {
        if(params['ciudad'])
          this.companyId = parseInt(params['ciudad']);
      },
      error: err => {
        this.router.navigate(['/'])
      }});
  }

  SearchSaleOrder(){
    if (this.tipo == "0"){
      alert('Selecciona un valor para "Buscar por"');
      return;
    }
    this.busquedaService.SearchOrder(this.pointOfSale, this.saleRef, this.companyId, parseInt(this.tipo), this.saleDate).subscribe({
      next: (r) => {
        console.log(r.result)
        if (r.result && r.result.length == 0)
          alert("No se han encontrado ninguna orden de venta");
        else if (r.result && r.result.length > 1)
          alert("Esta orden de venta no puede ser facturada debido a que ha sido reembolsada")
        else{
          let order = r.result[0];
          if (order.partner.rfc === "" || order.partner.rfc === GLOBAL.rfc || order.partner.rfc === this.rfc){

          }
          else {
            alert("Esta orden no puede ser facturada ya que está asignada a un cliente distinto");
            return;
          }
          localStorage.setItem("order", JSON.stringify(order));
          localStorage.setItem("rfc", this.rfc);
          this.router.navigate(['orden'], {queryParams: {ciudad: this.companyId}})
        }
      },
      error: (e) => {
        alert('')
      }
    });
  }

}
