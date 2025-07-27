import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {FormControl} from "@angular/forms";
import { CatalogoServices } from "src/app/services/catalogo.services";
import { Observable, map, startWith } from "rxjs";


@Component({
  selector: 'app-modificar-articulo-usuario',
  templateUrl: './modificar-articulo-usuario.component.html',
  styleUrls: ['./modificar-articulo-usuario.component.scss']
})
export class ModificarArticuloUsuarioComponent implements OnInit {

  marcanueva: String = '';
  userData: any = '';

  myControl = new FormControl();

  catalogoMarcas: any = [];
  catalogoMarcasAux: any = [];
  catalogoCategorias: any = [];
  catalogoCategoriasAux: any = [];

  filteredOptions: Observable<any[]>;

  existe: Boolean = false;

  itemName = '';
  category = '';
  value = '';
  branch = '';
  salesAmount = '';
  image = '';
  amount = '';
  id = '';
  stock = '';

  options = [
    { id: 1, itemName: 'Espiral 250 hojas', branch: 'Espiraflex', quantityAvailable: 0, saleAmount: 2, category: 'DULCE' },
    { id: 2, itemName: 'Silicon Liquido', branch: 'Pelikan', quantityAvailable: 2, saleAmount: 2, category: 'DULCE' },
    { id: 3, itemName: 'Escaneo de documentos', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
    { id: 4, itemName: 'Prit', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
    { id: 5, itemName: 'Lapiz', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
    { id: 6, itemName: 'Goma', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ModificarArticuloUsuarioComponent>,
    private _catalogoServices: CatalogoServices,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    //this.getMarcas();
    //this.getCategorias();

    const userData = localStorage.getItem('usuario');
    this.userData = (userData);

    this.options = this.data['itemList'].slice();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: any): any {
    if (value && value.length && value.length > 3 && value !== ' ') {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option['itemName'].toLowerCase().includes(filterValue));
    }
  }

  productSelected(item: any): any {
    console.log('xxxxxxxxxxxx');
    console.log(item);
    console.log('xxxxxxxxxxxx');

    this.itemName = item.option.value['nombre'];
    this.category = item.option.value['categoria'];
    this.branch = item.option.value['marca'];
    this.salesAmount = item.option.value['costoPublico'];
    this.image = item.option.value['imagen'];
    this.amount = item.option.value['costo'];
    this.stock = item.option.value['cantidad'];
    this.id = item.option.value['id'];

    this.myControl.setValue('');
  }

  /*getMarcas(): void {
    this._catalogoServices.getMarcas().subscribe((listItems) => {
      this.catalogoMarcas = [];
      listItems.forEach((item) => {
        const marca =  item.payload.doc.data();
        this.catalogoMarcas.push(marca);
      });
    });
  }*/

  /*getCategorias(): void {
    this._catalogoServices.getCategorias().subscribe((listItems) => {
      this.catalogoCategorias = [];
      listItems.forEach((item) => {
        const marca =  item.payload.doc.data();
        this.catalogoCategorias.push(marca);
      });

    });
  }*/

  onNoClick(): void {
    this.dialogRef.close();
  }

  /*onCodigo(codigo: any): void {
    this.codigo = codigo.target.value;
    this.existe = false;
    this.data.items.forEach((item: any) => {
      if (item.codigo === this.codigo) {
        this.existe = true;
        Swal.fire({
          title: 'Oops...',
          icon: 'warning',
          html: `<b>${item.codigo} - ${item.nombre.toUpperCase()}</b> <br> !Este artículo ya se encuentra registrado! <br>`,
          confirmButtonText: 'Ok'
        })
      }
    });
  }*/

  /*onNombreArticulo(nombre: any): void {
    this.nombreArticulo = nombre.target.value;
  }

  onCantidad(cantiad: any): void {
    this.cantidad = cantiad.target.value;
  }

  onSugerido(sugerido: any) {
    this.costo = sugerido.target.value;
  }

  onPrecioCaja(caja: any) {
    this.caja = caja.target.value;
  }

  onImagen(imagen: any) {
    this.imagen = imagen.target.value;
  }*/

  validarDatos(): void {
    let mensajes = '';
    let errores = false;

    if (this.itemName.length === 0) {
      mensajes += `<p>-Campo código obligatorio</p>`
      errores = true;
    }
    if (this.category.length === 0) {
      mensajes += `<p>-Campo nombre articulo obligatorio</p>`
      errores = true;
    }

    if (this.branch.length === 0) {
      mensajes += `<p>-Campo marca obligatorio</p>`
      errores = true;
    }
    if (this.amount.length === 0) {
      mensajes += `<p>-Campo categoría obligatorio</p>`
      errores = true;
    }
    if (this.salesAmount.length === 0) {
      mensajes += `<p>-Campo costo obligatorio</p>`
      errores = true;
    }

    if (this.stock.length === 0) {
      mensajes += `<p>-Campo stock obligatorio</p>`
      errores = true;
    }
  
    if (this.existe) {
      mensajes += `<p>-El artíclo ya fue resitrado con anterioridad</p>`
      errores = true;
    }

    if (errores) {
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
    let alta = new Date();
    let data = {
      costoPublico: this.salesAmount ? parseFloat(this.salesAmount) : 0,
      fechaModificacion: alta,
      imagen: this.image ? this.image : '',
      nombre: this.itemName,
      usuarioCrea: this.userData,
      categoria: this.category,
      marca: this.branch,
      costo: this.amount,
      cantidad: this.stock
    };
    console.log('xxxxxxxxxxxxxxxxx');
    console.log(data);
    this._catalogoServices.actualizaArticulo(this.id + '', data)
      .then(() => {
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
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar el artículo',
        });
      });
  }


}
