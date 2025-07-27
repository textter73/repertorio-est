import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, share, Subscription, timer } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { CatalogoServices } from 'src/app/services/catalogo.services';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog} from "@angular/material/dialog";
import { VerImagenComponent } from '../modals/ver-imagen/ver-imagen.component';
import { HistorialModificacionesComponent } from '../modals/historial-modificaciones/historial-modificaciones.component';
import { AgregarArticuloComponent } from '../modals/agregar-articulo/agregar-articulo.component';
import { ExcelServices } from '../services/excel.services';

@Component({
  selector: 'app-siguiente-compra',
  templateUrl: './siguiente-compra.component.html',
  styleUrls: ['./siguiente-compra.component.scss']
})
export class SiguienteCompraComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['np','clave', 'nombre', 'marca', 'costo', 'costoPublico','cantidad', 'accion',];
  dataSource: any = null;

  itemsListCatalog: any = [];

  /********* RELOJ */
  showFiller = false;
  time: any = new Date();
  rxTime: any = new Date();
  intervalId: any;
  subscription: Subscription | undefined;
  usernName = '';
  nameProfile = '';
  imgProfile = '';
  value = '';
  itemsListAux: any = [];
  itemsList: any = [];
  principalList: any = [];
  userData = '';
  perfil = 0;

  getLocalStorage(): void {
    this.usernName = `${localStorage.getItem("nombre")} ${localStorage.getItem("apllPtrn")} ${localStorage.getItem("apllMtrn")}`;
    this.nameProfile = `${localStorage.getItem("nombrePerfil")}`;
    this.imgProfile = `${localStorage.getItem("imagenPerfil")}`;
    this.userData = `${localStorage.getItem("usuario")}`;
    this.perfil = parseInt(`${localStorage.getItem("perfil")}`);
  }

  clock(): any {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = moment(time).format('h:mm:ss a');
      });
  }

  exit(): void {
    Swal.showLoading();
    localStorage.removeItem('nombre');
    localStorage.removeItem('apllPtrn');
    localStorage.removeItem('apllMtrn');
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('nombrePerfil');
    Swal.close();
    this.router.navigateByUrl('');
  }
  /********* RELOJ */

  constructor(
    private router: Router,
    private _catalogoServices: CatalogoServices,
    private _excelServices: ExcelServices,
    private dialog: MatDialog
  ){}
    
    ngOnInit(): void {
      this.clock();
      this.getLocalStorage();
      this.getCatalog();
    }

    getCatalog(): void {
      Swal.showLoading();
      this._catalogoServices.getCatalogV2().subscribe((listItems) => {
        this.itemsList = [];
        listItems.forEach((item) => {
          this.itemsList.push(item);
        });
        let temporal = [];
        for (const item of this.itemsList) {
            if (+item.cantidad <= 4 && item.activo === true && !item.comprarDespues) {
                temporal.push(item);
            }
        }
        this.itemsList = temporal.slice();
        this.dataSource = new MatTableDataSource<any>(this.itemsList);
        setTimeout( () => {
          this.dataSource.paginator = this.paginator;
        });
        Swal.close();
      });
    }

    showImg(element: any): any {
      const dialogRef = this.dialog.open(VerImagenComponent, {
        width: '500px',
        data: {
          items: element
        }
      });
    }

    editarArticulo(element: any, field: any): any {
        let data = {
            comprarDespues: true
        };

        let id = element.id;
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
        
    }

    showHistory(element: any): any {
      Swal.showLoading();
      this._catalogoServices.getCatalogHistorial(element.id).subscribe((listItems) => {
        let historial: unknown[] = [];
        listItems.forEach((item) => {
          historial.push(item.payload.doc.data());
        });
  
        Swal.close();
        const dialogRef = this.dialog.open(HistorialModificacionesComponent, {
          width: '1000px',
          data: {
            listItems: historial
          },
        });
      });
    }

    filtrar(event: Event): any {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filtro.trim().toLowerCase();
    }

    agregarArticulo(): void {
      const dialogRef = this.dialog.open(AgregarArticuloComponent, {
        width: '80%',
        data: {
          items: this.itemsList
        }
      });
    }

    exportarExcel(): void {
      const excel: any = [];
      for(const item of this.dataSource.data) {
        excel.push({
          'Articulo': item.nombre,
          'Marca': item.marca,
          'Cantidad': item.cantidad,
          'Costo': item.costo,
          'Publico': item.costoPublico
        });
      }
      this._excelServices.exportAsExcelFile(excel,'Articulos a comprar');
    }

}