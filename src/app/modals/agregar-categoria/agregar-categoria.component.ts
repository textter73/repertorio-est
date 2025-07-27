import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";


@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.component.html',
  styleUrls: ['./agregar-categoria.component.scss']
})
export class AgregarCategoriaComponent implements OnInit {

  categorianueva: String = '';
  userData: String = '';

  constructor(
    public dialogRef: MatDialogRef<AgregarCategoriaComponent>,
    private _catalogoServices: CatalogoServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.userData = `${localStorage.getItem("usuario")}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onNuevaCategoria(value: any): void {
    this.categorianueva = value.target.value;
  }

  validarCategoria(): void {
    let mensajes = '';
    let errores = false;

    if (this.categorianueva.length === 0) {
      mensajes += `<p>-Campo código obligatorio</p>`;
      errores = true;
    }

    this.data.items.forEach( (item: any) => {
      if (item.nombre === this.categorianueva) {
        mensajes += `<p>-Ya existe la categoría ${this.categorianueva.toUpperCase()}</p>`;
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
      this.guardaCategoria();
    }
  }

  guardaCategoria(): void {
    let alta = new Date();
    let data = {
      activo: true,
      fechaAlta: alta,
      fechaModificacion: alta,
      nombre: this.categorianueva,
      usuarioCrea: this.userData
    };

    let id = this.data.items.length + 1;

    this._catalogoServices.guardaNuevaCategoria(id + '', data)
      .then(() => {
        Swal.fire({
          title: '!Éxito!',
          icon: 'success',
          text: 'Categoría Guardada',
          confirmButtonText: 'Ok',
        })
          .then( result => {
            this.onNoClick();
          });
      }, (error) => {
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar la categoría.',
        });
      });
  }
}