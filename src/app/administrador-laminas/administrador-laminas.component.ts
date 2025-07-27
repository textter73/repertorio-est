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
import { LaminasServices } from '../services/laminas.services';

@Component({
  selector: 'app-administrador-laminas',
  templateUrl: './administrador-laminas.component.html',
  styleUrls: ['./administrador-laminas.component.scss']
})
export class AdministradorLaminasComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['id','nombre', 'cantidad', 'modificacion', 'usuario'];
  dataSource: any = null;

  itemsListCatalog: any = [];

  selectedValue: string;

  letraLamina: string;

  foods: any;
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
    private _laminasServices: LaminasServices,
    private dialog: MatDialog
  ){}
    
    ngOnInit(): void {
      this.clock();
      this.getLocalStorage();
      this.foods = [
        {value: 'A', viewValue: 'A'},
        {value: 'B', viewValue: 'B'},
        {value: 'C', viewValue: 'C'},
        {value: 'D', viewValue: 'D'},
        {value: 'E', viewValue: 'E'},
        {value: 'F', viewValue: 'F'},
        {value: 'G', viewValue: 'G'},
        {value: 'H', viewValue: 'H'},
        {value: 'I', viewValue: 'I'},
        {value: 'J', viewValue: 'J'},
        {value: 'K', viewValue: 'K'},
        {value: 'L', viewValue: 'L'},
        {value: 'M', viewValue: 'M'},
        {value: 'N', viewValue: 'N'},
        {value: 'O', viewValue: 'O'},
        {value: 'P', viewValue: 'P'},
        {value: 'Q', viewValue: 'Q'},
        {value: 'R', viewValue: 'R'},
        {value: 'S', viewValue: 'S'},
        {value: 'T', viewValue: 'T'},
        {value: 'U', viewValue: 'U'},
        {value: 'V', viewValue: 'V'},
        {value: 'X', viewValue: 'X'},
        {value: 'Y', viewValue: 'Y'},
        {value: 'Z', viewValue: 'Z'},

      ];
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
            case 'cantidad': 
              element.cantidad = result.value
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
            cantidad: element.cantidad ? parseFloat(element.cantidad) : 0,
            fechaModificacion: alta,
            nombre: element.nombre,
            usuarioCrea: this.userData,
            usuarioModifica: this.userData
          };

          let id = element.id;
          /*this._catalogoServices.guardaHistorial(id + '', data, fechaActual)
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
          });*/
        }
      })
    }

    filtrar(event: Event): any {
      const filtro = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filtro.trim().toLowerCase();
    }

    agregarArticulo(): void {
      let inputValue: any;
      let nombreLamina: any;
      let numeroLamina: any;
      if (this.letraLamina) {
        Swal.fire({
          title: 'Nombre',
          input: 'text',
          inputLabel: 'Lámina',
          inputValue: inputValue,
          showCancelButton: true,
        }).then((e: any) => {
          if (e.isConfirmed && e.value.length > 5) {
            nombreLamina = e.value;
            Swal.fire({
              title: 'Número de láminas',
              icon: 'question',
              input: 'range',
              inputValue: 1
            }).then((e: any) => {
              if (e.isConfirmed && parseInt(e.value) > 0)  {
                numeroLamina = e.value;
                let data = {
                  id: ((this.itemsList.length + 1) + ''),
                  nombre: nombreLamina,
                  cantidad: numeroLamina,
                  activo: true,
                  fechaCreacion: new Date(),
                  usuarioCrea: this.userData,
                  usuarioModifica: this.userData,
                  fechaModificacion: new Date()
                };
                this._laminasServices.guardaLamina(this.letraLamina, data, (this.itemsList.length + 1) + '')
                .then(() => {
                  this.itemsList = [];
                  this.dataSource = new MatTableDataSource<any>([]);
                  Swal.fire({
                    title: '!Éxito!',
                    icon: 'success',
                    text: 'Lámina guardada',
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
            })
          }
        })
      } else {
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Seleccione una letra',
        });
      }
         
    }

    optionSelected(e: any): any {
      this.itemsList = [];
      this.dataSource = new MatTableDataSource<any>([]);
      this.letraLamina = e.value;
      Swal.showLoading();
      this._laminasServices.laminasbyLetras(this.letraLamina + '').subscribe((laminas) => {
        let listaLaminas: any = [];
        this.itemsList = [];
        this.dataSource = new MatTableDataSource<any>([]);
        for (const item of laminas) {
          listaLaminas.push(
            item.payload.doc.data()
          );
        }

        for (const item of listaLaminas) {
          if (item.activo) {
            this.itemsList.push(item);
          }
        }
        this.dataSource = new MatTableDataSource<any>(this.itemsList);
        setTimeout( () => {
          this.dataSource.paginator = this.paginator;
        });
        Swal.close();
      });
    }

}