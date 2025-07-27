import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, share, Subscription, timer } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
//import { LoginServices } from '../services/login.services';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { CatalogoServices } from 'src/app/services/catalogo.services';
import { VentasServices } from '../services/ventas.services';
import { MatDialog } from '@angular/material/dialog';
import { ResumenComprasComponent } from '../modals/resumen-compras/resumen-compras.component';
import { ExcelServices } from '../services/excel.services';
import { ResumenTurnoComponent } from '../modals/resumen-turno/resumen-turno.component';

import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class principalComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  //@ViewChild(MatPaginator, { static: true }) paginatorItems!: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginatorItems: MatPaginator;

  displayedColumns: string[] = ['number', 'items','quantity', 'amount', 'vendor', 'saleDay'];
  displayedColumnsSales: string[] = ['number', 'items', 'remove', 'quantity','add', 'stock','amount', 'subtotal', 'accion'];
  dataSource: MatTableDataSource<any>;
  dataSourceItems: any = null;
  salesList: MatTableDataSource<any>;

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
  totalCarrito = 0;
  fechaActual: String = '';
  listaVentasHoy: any = [];
  userData= '';
  existeCaja = false;
  totalVentas = 0;
  cajaCerrada = false;
  panelOpenState = false;
  dineroEnCaja = 0;
  totalPapeleria = 0;
  totalRecargas = 0;
  displayedColumnsItems = ['np']

  getLocalStorage(): void {
    this.usernName = `${localStorage.getItem("nombre")} ${localStorage.getItem("apllPtrn")} ${localStorage.getItem("apllMtrn")}`;
    this.nameProfile = `${localStorage.getItem("nombrePerfil")}`;
    this.imgProfile = `${localStorage.getItem("imagenPerfil")}`;
    this.userData = `${localStorage.getItem("usuario")}`;
  }

  clock(): any {
    console.log('hola');
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

  ngOnInit(): void {
    this.clock();
    this.getLocalStorage();
    this.existeVenta();

    this.salesList = new MatTableDataSource();
    this.verificaCaja();
    this.sumaTotal();
  }


  constructor(
    private router: Router,
    private _catalogoServices: CatalogoServices,
    private _ventasServices: VentasServices,
    private _excelServices: ExcelServices,
    public dialog: MatDialog
  ){}

  existeVenta(): void {
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const formatHoy = hoy < 10 ? '0' + hoy : hoy;

    this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
  }

  sumaTotal(): void {
    let recargasId = [229,230,231,232,233,234,235,236,237,238,239,240,241,232];
    this.totalVentas = 0;
    this.totalRecargas = 0;
    this.totalPapeleria = 0;
    for (const item of this.listaVentasHoy) {
      this.totalVentas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
      let findRecarga = recargasId.find((x: any) => parseFloat(x) === parseFloat(item.idArticulo)); 
      if (findRecarga) {
        this.totalRecargas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
      } else {
        this.totalPapeleria += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
      }
    }

    this.dataSource = new MatTableDataSource<any>(this.listaVentasHoy);
    setTimeout( () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.firstPage();
    });
  }

  verificaCaja(): void {
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const formatHoy = hoy < 10 ? '0' + hoy : hoy;

    this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;

  }

  filtrarProducto(value: any): any {
    let filterValue = this.RemoveAccents(value.target.value).toLowerCase();
    this.itemsListAux =  this.itemsList.filter((option: any) => this.RemoveAccents(option.nombre).toLowerCase().includes(filterValue));
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

  productoSelected(element: any): void {
    const find = this.itemsList.find((x: any) => x.id === element.option.value);
    find.cantidadSelecionada = 1;
    find.subtotal = (find.cantidadSelecionada * find.costoPublico);
    let temporalList = this.salesList.data;
    temporalList.push(find);
    this.value = "";
    this.itemsListAux = [];
    this.salesList = new MatTableDataSource(temporalList);
    this.calculaTotal();
  } 

  calculaTotal(): any {
    this.totalCarrito = 0;
    for (const item of this.salesList.data) {
      this.totalCarrito += item.subtotal;
    }
  }

  eliminaArticulo(index: number): void {
    let temporalList = this.salesList.data;
    this.salesList = new MatTableDataSource();
    temporalList.splice((index), 1);
    this.salesList = new MatTableDataSource(temporalList);
    this.calculaTotal();
  }

  addItem(index: number): void {
    let temporalList = this.salesList.data;
    this.salesList = new MatTableDataSource();
    temporalList[index].cantidadSelecionada++;
    
    if (temporalList[index].cantidadSelecionada <= temporalList[index].cantidad) {
      temporalList[index].subtotal = (temporalList[index].cantidadSelecionada * temporalList[index].costoPublico);
    } else {
      temporalList[index].cantidadSelecionada = temporalList[index].cantidad;
      Swal.fire({
        icon: 'info',
        title: 'Artículos disponibles: ' + temporalList[index].cantidad,
        showConfirmButton: false,
        timer: 3000
      })
    }
    this.salesList = new MatTableDataSource(temporalList);
    
    this.calculaTotal();
  }

  removeItem(index: number): void {
    let temporalList = this.salesList.data;
    this.salesList = new MatTableDataSource();
    temporalList[index].cantidadSelecionada--;
    if (temporalList[index].cantidadSelecionada < 1) {
      temporalList.splice((index), 1);
    } else {
      temporalList[index].subtotal = (temporalList[index].cantidadSelecionada * temporalList[index].costoPublico);
    }
    this.salesList = new MatTableDataSource(temporalList);
    this.calculaTotal();
  }

  procederPago(): void {
    const dialogRef = this.dialog.open(ResumenComprasComponent, {
      width: '350px',
      data: {
        salesList: this.salesList.data,
        totalCarrito: this.totalCarrito
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.pagar) {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;

        let alta = new Date();

        let indexAuto = this.listaVentasHoy.length;

        for (const element of this.salesList.data) {
          indexAuto++;
          let data = {
            cantidadVendida: element.cantidadSelecionada,
            costoPublico: element.costoPublico,
            fechaVenta: alta,
            idArticulo: element.id,
            nombre: element.nombre,
            vendedor: this.userData,
            order: (this.listaVentasHoy.length + 1).toString(),
            activo: true
          };
        
          this._ventasServices.creaVentasHoy(this.fechaActual,data,((indexAuto).toString()))
          .then(() => {
            let data = {
              caja: element.caja ? parseFloat(element.caja) : 0,
              cantidad: (element.cantidad - element.cantidadSelecionada),
              costoPublico: element.costoPublico ? parseFloat(element.costoPublico) : 0,
              costo: element.costo ? parseFloat(element.costo) : 0,
              fechaModificacion: alta,
              imagen: element.imagen ? element.imagen : '',
              nombre: element.nombre,
              activo: element.activo,
              categoría: element.categoria,
              codigo: element.codigo,
              id: element.id,
              marca: element.marca
            };

            let id = element.id;
            this._catalogoServices.actualizaArticulo(id + '', data)
            .then(() => {
              this.totalCarrito = 0;
              this.salesList = new MatTableDataSource();
              this.existeVenta();
              Swal.fire({
                icon: 'success',
                title: 'Venta registrada',
                showConfirmButton: false,
                timer: 1500
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
              text: 'Ocurrió un error al guardar la venta',
            });
          });

        }
      }
    });

  }

  exportarExcel(): void {
    const excel: any = [];
    let cont = 0;
    for(const item of this.listaVentasHoy) {
      cont++;
      excel.push({
        '#': cont,
        'Fecha': this.fechaActual,
        'Articulo': item.nombre,
        'Cantidad': item.cantidadVendida,
        'Costo': (item.cantidadVendida * item.costoPublico),
        'Fecha venta': item.fechaVenta,
        'Usuario': item.vendedor
      });
    }
    this._excelServices.exportAsExcelFile(excel,this.fechaActual+'');
  }

  abrirCaja(abrirCaja: any): void {
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const formatHoy = hoy < 10 ? '0' + hoy : hoy;

    this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
    let fechaInicio = new Date();

    let dineroCaja = 0;
    if(!this.cajaCerrada && abrirCaja) {
      Swal.fire({
        title: 'Dinero en caja',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.isConfirmed && result.value.length > 0) {
          dineroCaja = result.value
          this.dineroEnCaja = dineroCaja;
          let data = {
            fechaInicio: fechaInicio,
            caja: dineroCaja,
            totalVentas: this.totalVentas,
            papeleria: this.totalPapeleria,
            recargas: this.totalRecargas,
            activo: true,
            usuario: this.userData,
            contado: false,
            cajaAbierta: true
          };
      
          this._ventasServices.abrirCaja(this.fechaActual,data)
          .then(() => {
            this.verificaCaja();
            Swal.fire({
              icon: 'success',
              title: 'Excelente turno',
              showConfirmButton: false,
              timer: 4000
            })
          }, (error) => {
            Swal.fire({
              title: '!Error!',
              icon: 'error',
              text: 'Ocurrió un error al guardar la venta',
            });
          });
        }
      })

    } else {
      let data = {
        cajaAbierta: abrirCaja,
        totalVentas: this.totalVentas,
        papeleria: this.totalPapeleria,
        recargas: this.totalRecargas,
      };
      this._ventasServices.abrirCajaNuevamente(this.fechaActual,data)
      .then(() => {
        this.verificaCaja();
        if(abrirCaja) {
          Swal.fire({
            icon: 'success',
            title: 'Excelente turno',
            showConfirmButton: false,
            timer: 4000
          })
        } else {
          const excel: any = [];
          let cont = 0;
          for(const item of this.listaVentasHoy) {
            cont++;
            excel.push({
              '#': cont,
              'Fecha': this.fechaActual,
              'Fecha venta': item.fechaVenta,
              'Usuario': item.vendedor,
              'Articulo': item.nombre,
              'Cantidad': item.cantidadVendida,
              'Costo': (item.cantidadVendida * item.costoPublico),
            });
          }
          this._excelServices.exportAsExcelFile(excel,this.fechaActual+'_'+this.userData);
          const dialogRef = this.dialog.open(ResumenTurnoComponent, {
            width: '350px',
            data: {
              caja: (this.dineroEnCaja) * 1,
              papeleria: this.totalPapeleria,
              recargas: this.totalRecargas,
              total: this.totalVentas
            },
          });

          dialogRef.afterClosed().subscribe(result => {
            this.exit();
            Swal.fire({
              icon: 'success',
              title: 'Gracias',
              showConfirmButton: false,
              timer: 4000
            })
          })
        }
        
      }, (error) => {
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar la venta',
        });
      });
    }
  }
    
}