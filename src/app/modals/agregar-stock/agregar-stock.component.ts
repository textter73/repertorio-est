import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { VerImagenComponent } from "../ver-imagen/ver-imagen.component";
import { FormControl } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";


@Component({
    selector: 'app-agregar-stock',
    templateUrl: './agregar-stock.component.html',
    styleUrls: ['./agregar-stock.component.scss']
})
export class AgregarStockComponent implements OnInit {

    filteredOptions: Observable<any[]>;
    itemsList: any = [];
    myControl = new FormControl('');
    itemName: {};
    element: any = {};
    value = '';
    quantityAvailable = 0;
    options = [
        { id: 1, itemName: 'Espiral 250 hojas', branch: 'Espiraflex', quantityAvailable: 0, saleAmount: 2, category: 'DULCE' },
        { id: 2, itemName: 'Silicon Liquido', branch: 'Pelikan', quantityAvailable: 2, saleAmount: 2, category: 'DULCE' },
        { id: 3, itemName: 'Escaneo de documentos', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 4, itemName: 'Prit', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 5, itemName: 'Lapiz', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
        { id: 6, itemName: 'Goma', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
    ];
    itemList = [
        { id: 1, itemName: 'Espiral 250 hojas', branch: 'Espiraflex', quantityAvailable: 0, saleAmount: 2, category: 'DULCE' },
        { id: 2, itemName: 'Silicon Liquido', branch: 'Pelikan', quantityAvailable: 2, saleAmount: 2, category: 'DULCE' },
        { id: 3, itemName: 'Escaneo de documentos', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 4, itemName: 'Prit', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 5, itemName: 'Lapiz', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
        { id: 6, itemName: 'Goma', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
    ];

    constructor(
        public dialogRef: MatDialogRef<AgregarStockComponent>,
        private dialog: MatDialog,
        private _catalogoServices: CatalogoServices,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.itemsList = this.data['filteredOptions'].slice();
        this.itemList = this.data['filteredOptions'].slice();
        this.options = this.data['filteredOptions'].slice();

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    private _filter(value: any): any {
        if (value && value.length && value.length > 5 && value !== ' ') {
            const filterValue = value.toLowerCase();

            return this.options.filter(option => option['itemName'].toLowerCase().includes(filterValue));
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    productSelected(item: any): any {
        this.itemName = item.option.value['nombre'];
        this.quantityAvailable = item.option.value['quantityAvailable'];
        this.element = item.option.value;

        this.myControl.setValue('');
    }

    saveStock(): any {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        let fechaActual = formatHoy + '' + mesActual + '' + añoActual;
        let alta = new Date();

        let data = {
            caja: this.element.caja ? parseFloat(this.element.caja) : 0,
            cantidad: this.quantityAvailable,
            costoPublico: this.element.costoPublico ? parseFloat(this.element.costoPublico) : 0,
            costo: this.element.costo ? parseFloat(this.element.costo) : 0,
            fechaModificacion: alta,
            imagen: this.element.imagen ? this.element.imagen : '',
            nombre: this.element.nombre,
            usuarioCrea: 'aortiz',
            activo: true,
            categoría: this.element.categoria,
            codigo: this.element.codigo,
            id: this.element.id,
            marca: this.element.marca,
            comprarDespues: !((+this.element.quantityAvailable - +this.element.quantity) <= 3)
        };

        let id = this.element.id;
        this._catalogoServices.guardaHistorial(id + '', data, fechaActual)
          .then(() => {
            this._catalogoServices.actualizaArticulo(id + '', data)
            .then(() => {
              Swal.fire({
                title: '!Éxito!',
                icon: 'success',
                text: 'Articulo Guardado',
                confirmButtonText: 'Ok',
              })
            }, (error) => {
              Swal.fire({
                title: '!Error!',
                icon: 'error',
                text: 'Ocurrió un error al guardar el artículo',
              });
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
