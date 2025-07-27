import {Component, Inject, OnInit} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";

@Component({
  selector: 'app-resumen-turno',
  templateUrl: './resumen-turno.component.html',
  styleUrls: ['./resumen-turno.component.scss']
})
export class ResumenTurnoComponent  implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ResumenTurnoComponent>,
        private _catalogoServices: CatalogoServices,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
    
    ngOnInit(): void {
        console.log(this.data);
    }

}