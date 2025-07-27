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
import { ResumenComprasComponent } from '../modals/resumen-compras/resumen-compras.component';
import { VentasServices } from '../services/ventas.services';
import { ExcelServices } from '../services/excel.services';
import { ResumenTurnoComponent } from '../modals/resumen-turno/resumen-turno.component';
import { LaminasComponent } from '../modals/laminas/laminas.component';
import { ExcelVentasServices } from '../services/excelVentas.serices';
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['imagen','nombre','costoPublico'];
  dataSource: any = null;
  itemsListCatalog: any = [];
  salesList: MatTableDataSource<any>;
  dataSourceVentasHoy: MatTableDataSource<any>;
  totalCarrito = 0;
  displayedColumnsSales: string[] = ['number', 'items', 'remove', 'quantity','add', 'subtotal', 'accion'];
  fechaActual: String = '';
  listaVentasHoy: any = [];
  displayedColumnsSalesList: string[] = ['number', 'items', 'quantity', 'amount', 'vendor' ,'saleDay'];
  contadorArticulos: any = 0;
  isLoadingSales = false;
  
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
  existeCaja = false;
  totalVentas = 0;
  cajaCerrada = false;
  panelOpenState = false;
  dineroEnCaja = 0;
  totalPapeleria = 0;
  totalRecargas = 0;
  totalDulce = 0;
  perfil = 0;
  isLoading = true;

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
    this.isLoading = true;
    localStorage.removeItem('nombre');
    localStorage.removeItem('apllPtrn');
    localStorage.removeItem('apllMtrn');
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('nombrePerfil');
    this.isLoading = false;
    this.router.navigateByUrl('');
  }

  /********* RELOJ */

  /**VARIABLES DEL FLUJO */
  constructor(
    private router: Router,
    private _catalogoServices: CatalogoServices,
    private _ventasServices: VentasServices,
    private _excelServices: ExcelServices,
    private _excelVentasServices: ExcelVentasServices,
    private dialog: MatDialog
  ){
    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const formatHoy = hoy < 10 ? '0' + hoy : hoy;

    this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
  }
    
    ngOnInit(): void {
      this.clock();
      this.getLocalStorage();
      this.verificaCaja();
      this.existeVenta();
      this.salesList = new MatTableDataSource();
    }

    existeVenta(): void {
      this._ventasServices.ventasHoy(this.fechaActual).subscribe((ventas) => {
        this.listaVentasHoy = [];
        let listaVentasTemporal: any = [];
         let sortList = [];
        if (ventas && ventas.length > 0) {
          for (const item of ventas) {
            listaVentasTemporal.push(item);
          }
          sortList = [];
          for (const item of listaVentasTemporal) {
            sortList.push({
              ... item,
              orden : parseInt(item.order)
            });
          }
          this.listaVentasHoy = [];
          this.listaVentasHoy = sortList.sort(( {orden:b}, {orden:a}) => a-b);
          this.sumaTotal();
        }
        
      });
    }

    verificaCaja(): void {
      this._ventasServices.verificaCaja(this.fechaActual).subscribe((ventas) => {
        let verificaCaja: any = {};
        verificaCaja = ventas;
        if (verificaCaja === undefined) {
          this.existeCaja = false;
          this.isLoading = false;
        } else if (verificaCaja['cajaAbierta']) {
          this.existeCaja = true;
          this.dineroEnCaja = verificaCaja['caja'];
          this.getCatalog();
        } else {
          this.existeCaja = false;
          this.cajaCerrada = true;
          this.isLoading = false;
        }
      });
    }

    getCatalog(): void {
      this.isLoading = true;
      this._catalogoServices.getCatalog().subscribe((listItems) => {
        this.itemsList = [];
        let temporal: any[] = [];
        listItems.forEach((item) => {
          temporal.push(item);
        });
        
        let activos = [];
        for (const item of temporal) {
          if (item.activo) {
            activos.push(item)
          } 
        }
        this.itemsList = activos.slice();
        this.dataSource = new MatTableDataSource<any>(this.itemsList);
        setTimeout( () => {
          this.dataSource.paginator = this.paginator;
        }, 2000);
        this.isLoading = false;
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
            categoria: element.categoria,
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
      })
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

    lamina(): void {
      const dialogRef = this.dialog.open(LaminasComponent);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    procederPago(): void {
      const dialogRef = this.dialog.open(ResumenComprasComponent, {
        width: '350px',
        data: {
          salesList: this.salesList.data,
          totalCarrito: this.totalCarrito
        },
      });
  
      dialogRef.afterClosed().subscribe(async result => {
        if (result.pagar) {
          let alta = new Date(); 
          let indexAuto = this.listaVentasHoy.length;
          this.isLoadingSales = true;
          this.contadorArticulos = 0;
          for (const element of this.salesList.data) {
            indexAuto++;
            let data = {
              cantidadVendida: element.cantidadSelecionada,
              costoPublico: element.costoPublico,
              fechaVenta: alta,
              idArticulo: element.id,
              nombre: element.nombre,
              categoria: element.categoria,
              vendedor: this.userData,
              order: (this.listaVentasHoy.length + 1).toString(),
              activo: true
            };
          
            await this._ventasServices.creaVentasHoy(this.fechaActual,data,((indexAuto).toString()))
            .then(async () => {
              let data = {
                cantidad: (element.cantidad - element.cantidadSelecionada),
                fechaModificacion: alta
              };
  
              let id = element.id;
              await this._catalogoServices.actualizaArticulo(id + '', data)
              .then(() => {
                this.contadorArticulos++;
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
          if (this.contadorArticulos === this.salesList.data.length) {
            this.isLoadingSales = false;
            this.totalCarrito = 0;
            this.salesList = new MatTableDataSource();
            Swal.fire({
              icon: 'success',
              title: 'Venta registrada',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }
      });
  
    }
    
    sumaTotal(): void {
      let recargasId = [229,230,231,232,233,234,235,236,237,238,239,240,241,242];
      this.totalVentas = 0;
      this.totalRecargas = 0;
      this.totalPapeleria = 0;
      this.totalDulce = 0;
      for (const item of this.listaVentasHoy) {
        console.log(item);
        this.totalVentas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
        let findRecarga = recargasId.find((x: any) => parseFloat(x) === parseFloat(item.idArticulo));
        
        if (findRecarga) {
          this.totalRecargas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
        } else if(item.categoria.toUpperCase() === 'DULCE') {
          console.log('xxxxxxxxxxxxxxxxx');
          console.log(item);
          console.log('xxxxxxxxxxxxxxxxx');
          this.totalDulce += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
        }else {
          this.totalPapeleria += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
        }
      }
  
      this.dataSourceVentasHoy = new MatTableDataSource<any>(this.listaVentasHoy);
      
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

    productoSelected(element: any): void {
      if (element.cantidad <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin stock',
          showConfirmButton: false,
          timer: 3000
        })
      } else {
        const find = this.itemsList.find((x: any) => x.id === element.id);
        find.cantidadSelecionada = 1;
        find.subtotal = (find.cantidadSelecionada * find.costoPublico);
        let temporalList = this.salesList.data;
        temporalList.push(find);
        this.value = "";
        this.itemsListAux = [];
        this.salesList = new MatTableDataSource(temporalList);
        this.calculaTotal();
      }
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
          if(abrirCaja) {
            Swal.fire({
              icon: 'success',
              title: 'Excelente turno',
              showConfirmButton: false,
              timer: 4000
            })
          } else {
            let cont = 0;
            let excelPapeleria: any = [];
            let excelRecargas: any = [];
            let excelDulces: any = [];
            for(const row of this.listaVentasHoy) {
              cont++
              if (row.idArticulo === 229 || row.idArticulo === 230 || row.idArticulo === 231 || row.idArticulo === 232 || row.idArticulo === 233 || row.idArticulo === 234 || row.idArticulo === 235 || row.idArticulo === 236 || row.idArticulo ===237 || row.idArticulo ===238 || row.idArticulo ===239 || row.idArticulo ===240 || row.idArticulo === 241 || row.idArticulo ===242) {
                excelRecargas.push({
                  '#': cont,
                  'Usuario': row.vendedor,
                  'Articulo': row.nombre,
                  'Cantidad': row.cantidadVendida,
                  'Costo': (row.cantidadVendida * row.costoPublico),
                });
              } else if (row.idArticulo === 849 || row.idArticulo === 850 || row.idArticulo === 851 || row.idArticulo ===852 || row.idArticulo ===853 || row.idArticulo ===854 || row.idArticulo === 855 || row.idArticulo ===857 || row.idArticulo ===856 || row.idArticulo ===858 || row.idArticulo ===859 || row.idArticulo ===860 || row.idArticulo ===861 || row.idArticulo ===862 || row.idArticulo ===863 || row.idArticulo ===864 || row.idArticulo ===865 || row.idArticulo ===866 || row.idArticulo ===867
                || row.idArticulo ===868 || row.idArticulo ===873 || row.idArticulo === 874 || row.idArticulo === 875 || row.idArticulo === 876 || row.idArticulo === 881 || row.idArticulo === 887 || row.idArticulo === 943) {
                  excelDulces.push({
                    '#': cont,
                    'Usuario': row.vendedor,
                    'Articulo': row.nombre,
                    'Cantidad': row.cantidadVendida,
                    'Costo': (row.cantidadVendida * row.costoPublico),
                  });
              } else {
                excelPapeleria.push({
                  '#': cont,
                  'Usuario': row.vendedor,
                  'Articulo': row.nombre,
                  'Cantidad': row.cantidadVendida,
                  'Costo': (row.cantidadVendida * row.costoPublico),
                });
              }
              
            }
            this._excelVentasServices.exportAsExcelFile(excelPapeleria, excelRecargas,excelDulces,this.fechaActual+'_'+this.userData);
            const dialogRef = this.dialog.open(ResumenTurnoComponent, {
              data: {
                caja: (this.dineroEnCaja) * 1,
                papeleria: this.totalPapeleria,
                recargas: this.totalRecargas,
                subtotal: (this.totalPapeleria + this.totalRecargas),
                total: this.totalVentas,
                dulce: this.totalDulce
              }
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

    async anotarImpresiones(): Promise<void> {
      const { value: cantidad } = await Swal.fire({
        title: 'Enter your password',
        input: 'number',
        inputLabel: 'Costo de las impresiones',
      })

      let temporalList = this.salesList.data;
      let find = {
        activo: true,
        caja: 0,
        cantidad: 1,
        cantidadSelecionada: 1,
        categoria: "impresiones",
        codigo: "impresiones",
        costo: cantidad,
        costoPublico: cantidad,
        fechaAlta: new Date(),
        fechaModificacion: new Date(),
        id: 255,
        imagen: "",
        marca: "impresiones",
        nombre: "impresiones",
        subtotal: cantidad,
        usuarioCrea: "aortiz"
      };
      temporalList.push(find);
      this.value = "";
      this.itemsListAux = [];
      this.salesList = new MatTableDataSource(temporalList);
      this.calculaTotal();
    }

}
