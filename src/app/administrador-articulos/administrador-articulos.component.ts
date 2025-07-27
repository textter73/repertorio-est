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
import { ModificarArticuloUsuarioComponent } from '../modals/modificar-articulo-usuario/modificar-articulo-usuario.component';
import { HistorialModificacionesComponent } from '../modals/historial-modificaciones/historial-modificaciones.component';
import { AgregarArticuloComponent } from '../modals/agregar-articulo/agregar-articulo.component';

@Component({
  selector: 'app-administrador-articulos',
  templateUrl: './administrador-articulos.component.html',
  styleUrls: ['./administrador-articulos.component.scss']
})
export class AdministradorArticulosComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['np','imagen', 'nombre', 'marca','categoria', 'costo', 'costoPublico','cantidad','comprarDespues', 'modificacion', 'usuario', 'activo', 'accion',];
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
  selectedValue: number = 100000;
  selectedActivo: boolean = true;

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
    
        this.dataSource = new MatTableDataSource<any>(this.itemsList);
        setTimeout( () => {
          this.dataSource.paginator = this.paginator;
        });

        this.filterData();
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

    toggle(event: any, element: any) {
      let checked = event.checked;
      const fecha = new Date();
          const añoActual = fecha.getFullYear();
          const hoy = fecha.getDate();
          const mesActual = fecha.getMonth() + 1;
          const formatHoy = hoy < 10 ? '0' + hoy : hoy;

          let fechaActual = formatHoy + '' + mesActual + '' + añoActual;
          
          let alta = new Date();
          let data = {
            caja: element.caja ? parseFloat(element.caja) : 0,
            cantidad: element.cantidad ? parseFloat(element.cantidad) : 0,
            costoPublico: element.costoPublico ? parseFloat(element.costoPublico) : 0,
            costo: element.costo ? parseFloat(element.costo) : 0,
            fechaModificacion: alta,
            imagen: element.imagen ? element.imagen : '',
            nombre: element.nombre,
            usuarioCrea: this.userData,
            activo: checked,
            categoría: element.categoria,
            codigo: element.codigo,
            id: element.id,
            marca: element.marca
          };

          let id = element.id;
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

    editarArticulo(element: any, field: any): any {
      Swal.fire({
        title: 'Cambiar ' + field,
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.isConfirmed && result.value.length > 0) {
          switch (field) {
            case 'nombre':
              element.nombre = result.value
              break;
            case 'costo publico': 
              element.costoPublico = result.value
              break;
            case 'costo': 
              element.costo = result.value
              break;
            case 'caja': 
              element.caja = result.value
              break;
            case 'imagen': 
              element.imagen = result.value
              break;
            case 'cantidad': 
              element.cantidad = result.value
              break;
            case 'categoria': 
              element.categoria = result.value
              break;
            case 'comprar despues': 
              element.comprarDespues = result.value === 'si';
              break;
            case 'para comprar': 
              element.comprarDespues = !(result.value === 'si');
              break;
            default:
              break;
          }
          
          const fecha = new Date();
          const añoActual = fecha.getFullYear();
          const hoy = fecha.getDate();
          const mesActual = fecha.getMonth() + 1;
          const formatHoy = hoy < 10 ? '0' + hoy : hoy;

          let fechaActual = formatHoy + '' + mesActual + '' + añoActual;
          
          let alta = new Date();
          let data = {
            caja: element.caja ? parseFloat(element.caja) : 0,
            cantidad: element.cantidad ? parseFloat(element.cantidad) : 0,
            costoPublico: element.costoPublico ? parseFloat(element.costoPublico) : 0,
            costo: element.costo ? parseFloat(element.costo) : 0,
            fechaModificacion: alta,
            imagen: element.imagen ? element.imagen : '',
            nombre: element.nombre,
            usuarioCrea: this.userData,
            activo: element.activo,
            categoría: element.categoria,
            codigo: element.codigo,
            id: element.id,
            marca: element.marca,
            comprarDespues: element.comprarDespues,
            categoria: element.categoria
          };

          let id = element.id;
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
      })
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

    selectActivo(value: any) {
      this.selectedActivo = value === 1;
      this.filterData();
    }

    selectStock(value: any) {
      this.selectedValue = value;
      this.filterData();
    }

    filterData(): any {
      let auxActivo = [];
      for (const item of this.itemsList) {
        if (item.activo) {
          auxActivo.push(item);
        }
      }

      let aux = [];
      for (const item of auxActivo) {
        if (Number(item.cantidad) <= Number(this.selectedValue)) {
          aux.push(item);
        }
      }

      this.dataSource = new MatTableDataSource<any>(aux);
      setTimeout( () => {
        this.dataSource.paginator = this.paginator;
      });

    }

}