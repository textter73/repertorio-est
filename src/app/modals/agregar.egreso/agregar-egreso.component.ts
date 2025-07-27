import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import { FinanzasServices } from "src/app/services/finanzas.services";
import Swal from "sweetalert2";


@Component({
    selector: 'app-agregar-egreso',
    templateUrl: './agregar-egreso.component.html',
    styleUrls: ['./agregar-egreso.component.scss']
})
export class AgregarEgresoComponent implements OnInit {

    userData: String = '';
    cantidadVendida: Number;
    descripcion: String = '';
    fecha: String = '';
    tipo: String = '';

    constructor(
        public dialogRef: MatDialogRef<AgregarEgresoComponent>,
        private _finanzas: FinanzasServices,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.userData = `${localStorage.getItem("usuario")}`;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    guardarEgreso(): void {
        let alta = new Date();
        let id = this.data.list.length + 1;

        let data = {
            activo: true,
            fechaAlta: alta,
            fechaModificacion: alta,
            usuarioCrea: this.userData,
            cantidadVendida: this.cantidadVendida,
            descripcion: this.descripcion,
            fecha: this.fecha,
            tipo: this.tipo,
            ingreso: false,
            pendiente: false,
            id: id
        };

        this._finanzas.guardaFinanzas(id + '', data)
            .then(async () => {
                Swal.fire({
                    title: '!Éxito!',
                    icon: 'success',
                    text: 'Egregso guardado',
                    confirmButtonText: 'Ok',
                })
                    .then(result => {
                        this.onNoClick();
                    });
            });


    }
}