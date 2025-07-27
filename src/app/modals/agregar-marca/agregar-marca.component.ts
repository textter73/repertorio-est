import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";


@Component({
  selector: 'app-agregar-marca',
  templateUrl: './agregar-marca.component.html',
  styleUrls: ['./agregar-marca.component.scss']
})
export class AgregarMarcaComponent implements OnInit {

  marcanueva: String = '';
  userData: String = '';

  constructor(
    public dialogRef: MatDialogRef<AgregarMarcaComponent>,
    private _catalogoServices: CatalogoServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.userData = `${localStorage.getItem("usuario")}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onNuevaMarca(value: any): void {
    this.marcanueva = value.target.value;
  }

  validarMarca(): void {
    let mensajes = '';
    let errores = false;

    if (this.marcanueva.length === 0) {
      mensajes += `<p>-Campo código obligatorio</p>`;
      errores = true;
    }

    this.data.items.forEach( (item: any) => {
      if (item.nombre === this.marcanueva) {
        mensajes += `<p>-Ya existe la marca ${this.marcanueva.toUpperCase()}</p>`;
        errores = true;
      }
    });

    if (errores) {
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardaMarca();
    }
  }

  guardaMarca(): void {
    let alta = new Date();
    let data = {
      activo: true,
      fechaAlta: alta,
      fechaModificacion: alta,
      nombre: this.marcanueva,
      usuarioCrea: this.userData
    };

    let id = this.data.items.length + 1;

    this._catalogoServices.guardaNuevaMarca(id + '', data)
      .then(() => {
        Swal.fire({
          title: '!Éxito!',
          icon: 'success',
          text: 'Marca Guardada',
          confirmButtonText: 'Ok',
        })
          .then( result => {
            this.onNoClick();
          });
      }, (error) => {
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar la marca',
        });
      });
  }
}