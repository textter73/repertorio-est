import {Component, Inject, OnInit} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";
import { AgregarCategoriaComponent } from "../agregar-categoria/agregar-categoria.component";
import { AgregarMarcaComponent } from "../agregar-marca/agregar-marca.component";

@Component({
  selector: 'app-agregar-articulo',
  templateUrl: './agregar-articulo.component.html',
  styleUrls: ['./agregar-articulo.component.scss']
})
export class AgregarArticuloComponent  implements OnInit {

    catalogoMarcasAux: any = [];
    catalogoMarcas: any = [];
    catalogoCategorias: any = [];
    catalogoCategoriasAux: any = [];
    options = [
        {name: '3%', value: 0.3 },
        {name: '4%', value: 0.4 },
        {name: '5%', value: 0.5 },
        {name: '6%', value: 0.6 },
        {name: '7%', value: 0.8 },
    ];
    checkoutForm: any;
    existe: Boolean = false;
    userData = '';

  getLocalStorage(): void {
    this.userData = `${localStorage.getItem("usuario")}`;
  }


  constructor(
    public dialogRef: MatDialogRef<AgregarArticuloComponent>,
    private _catalogoServices: CatalogoServices,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.checkoutForm = this.formBuilder.group({
        codigo: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required]),
        marca: new FormControl('', [Validators.required]),
        categoria: new FormControl('', [Validators.required]),
        porcentaje: new FormControl(''),
        costo: new FormControl('', [Validators.required]),
        cantidad: new FormControl('', [Validators.required]),
        costoUnitario: new FormControl(''),
        precioPublico: new FormControl('', [Validators.required]),
        total: new FormControl(''),
        ganancia: new FormControl(''),
        caja: new FormControl(''),
        imagen: new FormControl('')
    });
  }
  validarDatos(): void {
    Swal.showLoading();
    let mensajes = '';
    let errores = false;
    
    if (this.checkoutForm.get('codigo').status === 'INVALID') {
      mensajes += `<p>-Campo código obligatorio</p>`
      errores = true;
    }
    if (this.checkoutForm.get('nombre').status === 'INVALID') {
      mensajes += `<p>-Campo nombre articulo obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('marca').status === 'INVALID') {
      mensajes += `<p>-Campo marca obligatorio</p>`
      errores = true;
    }
    if (this.checkoutForm.get('categoria').status === 'INVALID') {
      mensajes += `<p>-Campo categoría obligatorio</p>`
      errores = true;
    }
    if (this.checkoutForm.get('costo').status === 'INVALID') {
      mensajes += `<p>-Campo costo obligatorio</p>`
      errores = true;
    }
    if (this.checkoutForm.get('cantidad').status === 'INVALID') {
      mensajes += `<p>-Campo cantidad obligatorio</p>`
      errores = true;
    }
    if (this.checkoutForm.get('precioPublico').status === 'INVALID') {
      mensajes += `<p>-Campo sugerido obligatorio</p>`
      errores = true;
    }
    if (this.existe) {
      mensajes += `<p>-El artíclo ya fue resitrado con anterioridad</p>`
      errores = true;
    }

    if (errores) {
        Swal.close();
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardarArticulo();
    }
  }

  guardarArticulo(): void {
    let id = this.data.items.length + 1;
    let alta = new Date();
    let data = {
      id: id,
      activo: true,
      caja: this.checkoutForm.get('caja').status !== 'INVALID' ? parseFloat(this.checkoutForm.get('caja').value) : 0,
      cantidad: this.checkoutForm.get('cantidad').value,
      categoria: this.checkoutForm.get('categoria').value,
      codigo: this.checkoutForm.get('codigo').value,
      costo: this.checkoutForm.get('costo').value,
      costoPublico: this.checkoutForm.get('precioPublico').value,
      fechaAlta: alta,
      fechaModificacion: alta,
      imagen: this.checkoutForm.get('imagen').value,
      marca: this.checkoutForm.get('marca').value,
      nombre: this.checkoutForm.get('nombre').value,
      usuarioCrea: this.userData
    };
    
    this._catalogoServices.guardaArticulo(id + '', data)
      .then(() => {
        Swal.close();
        Swal.fire({
          title: '!Éxito!',
          icon: 'success',
          text: 'Articulo Guardado',
          confirmButtonText: 'Ok',
        })
          .then( result => {
            this.onNoClick();
          });
      }, (error) => {
        Swal.close();
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar el artículo',
        });
      });
  }

  sugerirCostos(): void {

    if (this.checkoutForm.get('porcentaje').value && this.checkoutForm.get('costo').value && this.checkoutForm.get('cantidad').value) {

        this.checkoutForm.get('costoUnitario').setValue(parseFloat(this.checkoutForm.get('costo').value)  / parseFloat(this.checkoutForm.get('cantidad').value));
        this.checkoutForm.get('precioPublico').setValue((parseFloat(this.checkoutForm.get('costoUnitario').value) * parseFloat(this.checkoutForm.get('porcentaje').value)) + parseFloat(this.checkoutForm.get('costoUnitario').value));
        this.checkoutForm.get('total').setValue(parseFloat(this.checkoutForm.get('precioPublico').value) * parseFloat(this.checkoutForm.get('cantidad').value));
        this.checkoutForm.get('ganancia').setValue(parseFloat(this.checkoutForm.get('total').value) - parseFloat(this.checkoutForm.get('costo').value));
    }

  }

  ngOnInit() {
    this.getLocalStorage();
    this.getMarcas();
    this.getCategorias();
  }

  getMarcas(): void {
    this._catalogoServices.getMarcas().subscribe((listItems) => {
      this.catalogoMarcas = [];
      listItems.forEach((item) => {
        const marca =  item.payload.doc.data();
        this.catalogoMarcas.push(marca);
      });
    });
  }

  filtrarMarca(value: any): any {
    const filterValue = this.RemoveAccents(value.target.value).toLowerCase();
    this.catalogoMarcasAux =  this.catalogoMarcas.filter((option: any) => this.RemoveAccents(option.nombre).toLowerCase().includes(filterValue));
  }

  RemoveAccents(str: string): string {
    const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    const str1 = str.split('');
    const strLen = str.length;
    let i, x;
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str1[i])) !== -1) {
        str1[i] = accentsOut[x];
      }
    }
    return str1.join('');
  }

  categoriaSelected(element: any): void {
    
  }

  filtrarCategoria(value: any): any {
    const filterValue = this.RemoveAccents(value.target.value).toLowerCase();
    this.catalogoCategoriasAux =  this.catalogoCategorias.filter((option: any) => this.RemoveAccents(option.nombre).toLowerCase().includes(filterValue));
  }

  getCategorias(): void {
    this._catalogoServices.getCategorias().subscribe((listItems) => {
      this.catalogoCategorias = [];
      listItems.forEach((item) => {
        const marca =  item.payload.doc.data();
        this.catalogoCategorias.push(marca);
      });

    });
  }

  percentageSelected(element: any): void {
    //this.percentage = element.option.value;
    //this.sugerirCostos();
  }


  marcaSelected(element: any): void {

  }

  onCodigo(codigo: any): void {
    let buscarCodigo = codigo.target.value;
    this.existe = false;
    this.data.items.forEach((item: any) => {
      if (item.codigo === buscarCodigo) {
        this.existe = true;
        Swal.fire({
          title: 'Oops...',
          icon: 'warning',
          html: `<b>${item.codigo} - ${item.nombre.toUpperCase()}</b> <br> !Este artículo ya se encuentra registrado! <br>`,
          confirmButtonText: 'Ok'
        })
      }
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  nuevaCategoria(): void {
    const dialogRef = this.dialog.open(AgregarCategoriaComponent, {
      width: '500px',
      data: {
        items: this.catalogoCategorias
      }
    });
  }

  nuevaMarca(): void {
    const dialogRef = this.dialog.open(AgregarMarcaComponent, {
      width: '500px',
      data: {
        items: this.catalogoMarcas
      }
    });
  }

}
