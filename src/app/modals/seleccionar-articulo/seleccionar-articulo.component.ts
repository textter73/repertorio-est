import {Component, Inject, OnInit} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-seleccionar-articulo',
  templateUrl: './seleccionar-articulo.component.html',
  styleUrls: ['./seleccionar-articulo.component.scss']
})
export class SeleccionarArticuloComponent  implements OnInit {

    itemsList: any = [];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['itemName', 'branch', 'quantityAvailable', 'saleAmount', 'action'];

    constructor(
        public dialogRef: MatDialogRef<SeleccionarArticuloComponent>,
        private _catalogoServices: CatalogoServices,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
    
    ngOnInit(): void {
        this.itemsList = [];
        this.dataSource = new MatTableDataSource<any>(this.itemsList);
        for (let item of this.data['candyList']) {
            this.itemsList.push({
                ...item,
                checked: false
            });
        }

        this.dataSource = new MatTableDataSource<any>(this.itemsList);
    }

    changeCheckedTrue(i: any, value: any): any {
        this.dataSource.data[i]['checked'] = value === 1; 
    }

    saveItems(): any {
        let processList = [];
        for (let item of this.dataSource.data) {
            if (item.checked) {
                processList.push(item);
            }
        }
        this.dialogRef.close({data: processList});
    }

}