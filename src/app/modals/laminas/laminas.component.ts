import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { LaminasServices } from "src/app/services/laminas.services";
import Swal from "sweetalert2";

@Component({
    selector: 'app-laminas',
    templateUrl: './laminas.component.html',
    styleUrls: ['./laminas.component.scss']
  })
  export class LaminasComponent implements OnInit {

    dataSource: any = null;
    displayedColumns: string[] = ['id','nombre', 'cantidad'];
    itemsList: any = [];
    foods: any;

    constructor(
        private _laminasServices: LaminasServices,
    ){}

    ngOnInit(): void {
        this.foods = [
            {value: 'A', viewValue: 'A'},
            {value: 'B', viewValue: 'B'},
            {value: 'C', viewValue: 'C'},
            {value: 'D', viewValue: 'D'},
            {value: 'E', viewValue: 'E'},
            {value: 'F', viewValue: 'F'},
            {value: 'G', viewValue: 'G'},
            {value: 'H', viewValue: 'H'},
            {value: 'I', viewValue: 'I'},
            {value: 'J', viewValue: 'J'},
            {value: 'K', viewValue: 'K'},
            {value: 'L', viewValue: 'L'},
            {value: 'M', viewValue: 'M'},
            {value: 'N', viewValue: 'N'},
            {value: 'O', viewValue: 'O'},
            {value: 'P', viewValue: 'P'},
            {value: 'Q', viewValue: 'Q'},
            {value: 'R', viewValue: 'R'},
            {value: 'S', viewValue: 'S'},
            {value: 'T', viewValue: 'T'},
            {value: 'U', viewValue: 'U'},
            {value: 'V', viewValue: 'V'},
            {value: 'X', viewValue: 'X'},
            {value: 'Y', viewValue: 'Y'},
            {value: 'Z', viewValue: 'Z'},
          ];
        
        this.itemsList = [];
        this.dataSource = new MatTableDataSource<any>([]);
        for (const letra of this.foods) {
            
            this._laminasServices.laminasbyLetras(letra.value + '').subscribe((laminas) => {
                let listaLaminas: any = [];
                this.dataSource = new MatTableDataSource<any>([]);
                for (const item of laminas) {
                    listaLaminas.push(
                        item.payload.doc.data()
                    );
                }
                let contador = this.itemsList.length + 1;
                let sortList = [];
                for (const item of listaLaminas) {
                    if (item.activo) {
                        sortList.push({
                            ...item,
                            orden: contador,
                            letra: letra.value
                        });
                    }
                }
                let enOrden = sortList.sort(( {orden:b}, {orden:a}) => a-b);
                for (const item of enOrden) {
                    this.itemsList.push(item)
                }
                
                this.dataSource = new MatTableDataSource<any>(this.itemsList);
                
                Swal.close();
            });
        }
    }

    filtrar(event: Event): any {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }
  }