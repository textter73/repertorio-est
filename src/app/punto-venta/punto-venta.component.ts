import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, share, startWith, Subscription, timer } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { CatalogoServices } from 'src/app/services/catalogo.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from "@angular/material/dialog";
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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSort } from '@angular/material/sort';
import { SeleccionarArticuloComponent } from '../modals/seleccionar-articulo/seleccionar-articulo.component';
import { AgregarStockComponent } from '../modals/agregar-stock/agregar-stock.component';
import { ResumenDiaComponent } from '../modals/resumen-dia/resumen-dia.component';

@Component({
    selector: 'app-punto-venta',
    templateUrl: './punto-venta.component.html',
    styleUrls: ['./punto-venta.component.scss']
})
export class PuntoVentaComponent implements OnInit {
    userData = '';
    value = '';
    itemsListAux: any = [];
    itemsList: any = [];
    principalList: any = [];
    existeCaja = false;
    totalVentas = 0;
    cajaCerrada = false;
    panelOpenState = false;
    dineroEnCaja = 0;
    totalPapeleria = 0;
    totalRecargas = 0;
    totalDulce = 0;
    isLoading = true;
    fechaActual: String = '';
    isLoadingSales = false;
    contadorArticulos: any = 0;
    profile = 0;


    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    filteredOptions: Observable<any[]>;
    myControl = new FormControl('');
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
    displayedColumns: string[] = ['serial', 'items', 'unit', 'remove', 'quantity', 'add', 'subtotal'];
    dataSource = new MatTableDataSource<any>();
    carShop: any = [];
    totalAmountCar: any = 0;
    listaVentasHoy: any = [];
    @ViewChild(MatSort) sort: MatSort;
    dataSourceVentasHoy: MatTableDataSource<any>;
    displayedColumnsSalesList: string[] = ['number', 'items', 'quantity', 'amount', 'vendor' ,'saleDay'];
    candyLits: any = [];
    rechargeLits: any = [];
    

    //*VARIABLES DEL FLUJO 
    constructor(
        private _catalogoServices: CatalogoServices,
        private _ventasServices: VentasServices,
        private _excelServices: ExcelServices,
        private _excelVentasServices: ExcelVentasServices,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit(): void {
        this.userData = `${localStorage.getItem("usuario")}`;

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );

        this.existeVenta();

        this.dataSource = new MatTableDataSource<any>([
            { id: 1, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 2, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 3, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 4, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 5, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 6, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 7, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 8, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 9, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 10, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 11, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 12, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 13, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 14, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 15, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' }
        ]);
        this.existBox();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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
                        ...item,
                        orden: parseInt(item.order)
                    });
                }
                this.listaVentasHoy = [];
                this.listaVentasHoy = sortList.sort(({ orden: b }, { orden: a }) => a - b);
                this.sumaTotal();
            }

        });
    }

    sumaTotal(): void {
        this.totalVentas = 0;
        this.totalRecargas = 0;
        this.totalPapeleria = 0;
        this.totalDulce = 0;
        for (const item of this.listaVentasHoy) {
            this.totalVentas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));

            if (item.categoria && item.categoria.toUpperCase() === 'RECARGA') {
                this.totalRecargas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            } else if (item.categoria && item.categoria.toUpperCase() === 'DULCE') {
                this.totalDulce += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            } else {
                this.totalPapeleria += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            }
        }

        this.dataSourceVentasHoy = new MatTableDataSource<any>(this.listaVentasHoy);

    }

    private _filter(value: any): any {
        if (value && value.length && value.length > 3 && value !== ' ') {
            const filterValue = value.toLowerCase();

            return this.options.filter(option => option['itemName'].toLowerCase().includes(filterValue));
        }
    }

    showAddStock(): any {
        const dialogRef = this.dialog.open(AgregarStockComponent, {
            width: '600px',
            data: {
                filteredOptions: this.itemsList
            }
        });
    }

    showCandyList(): any {
        const dialogRef = this.dialog.open(SeleccionarArticuloComponent, {
            width: '600px',
            data: {
                candyList: this.candyLits,
                title: 'Listado de dulces'
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result['data'].length > 0) {
                for (let article of result['data']) {
                    this.saveCarShop(article);
                }
            }
        });
    }

    saveCarShop(item: any): any {
        let findInex = this.carShop.findIndex((x: any) => +x.id === +item['id']);
        this.dataSource = new MatTableDataSource<any>([]);
        if (findInex < 0) {
            if (+item['quantityAvailable'] > 0) {
                this.carShop.push({
                    quantity: 1,
                    subtotal: (1 * item['saleAmount']),
                    category: item.categoria,
                    ...item
                });
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            }

        } else {
            if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
                this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
                this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            this.dataSource = new MatTableDataSource<any>(this.carShop);
        }
        this.myControl.setValue('');

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    showRechargeList(): any {
        const dialogRef = this.dialog.open(SeleccionarArticuloComponent, {
            width: '600px',
            data: {
                candyList: this.rechargeLits,
                title: 'Recargas'
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result['data'].length > 0) {
                for (let article of result['data']) {
                    this.saveCarShop(article);
                }
            }
        });
    }

    payment(): void {
        const dialogRef = this.dialog.open(ResumenComprasComponent, {
            width: '350px',
            data: {
                salesList: this.carShop,
                totalCarrito: this.totalAmountCar
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result.pagar) {
                let alta = new Date();
                let indexAuto = this.listaVentasHoy.length;
                this.isLoadingSales = true;
                this.contadorArticulos = 0;

                for (const element of this.carShop) {
                    indexAuto++;

                    let data = {
                        cantidadVendida: element.quantity,
                        costoPublico: element.saleAmount,
                        fechaVenta: alta,
                        idArticulo: element.id,
                        nombre: element.itemName,
                        vendedor: this.userData,
                        order: (this.listaVentasHoy.length + 1).toString(),
                        activo: true,
                        categoria: element.category,
                        marca: element.marca
                    };

                    await this._ventasServices.creaVentasHoy(this.fechaActual, data, ((indexAuto).toString()))
                        .then(async () => {
                            let data = {
                                cantidad: (+element.quantityAvailable - +element.quantity),
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

                if (this.contadorArticulos === this.carShop.length) {
                    this.isLoadingSales = false;
                    this.totalAmountCar = 0;
                    this.carShop = [];
                    this.dataSource = new MatTableDataSource<any>(this.carShop);
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

    modificarArticulo(): void {
        const dialogRef = this.dialog.open(ModificarArticuloUsuarioComponent, {
            width: '80%',
            data: {
                itemList: this.itemList
            },
        });

    }

    productSelected(item: any): any {
        let findInex = this.carShop.findIndex((x: any) => +x.id === +item.option.value['id']);
        this.dataSource = new MatTableDataSource<any>([]);
        if (findInex < 0) {
            if (+item.option.value['quantityAvailable'] > 0) {
                this.carShop.push({
                    quantity: 1,
                    subtotal: (1 * item.option.value['saleAmount']),
                    category: item.categoria,
                    ...item.option.value
                });
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            }

        } else {
            if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
                this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
                this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            this.dataSource = new MatTableDataSource<any>(this.carShop);
        }
        this.myControl.setValue('');

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    calculateTotalAmount(): any {
        this.totalAmountCar = 0;
        for (const item of this.carShop) {
            this.totalAmountCar += item['subtotal'];
        }
    }

    addItem(findInex: any): any {
        this.dataSource = new MatTableDataSource<any>([]);
        if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
            this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
            this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Sin stock',
                showConfirmButton: false,
                timer: 2000
            })
        }
        this.dataSource = new MatTableDataSource<any>(this.carShop);
        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    removedItem(findInex: any): any {
        this.dataSource = new MatTableDataSource<any>([]);
        if (+this.carShop[findInex]['quantity'] > 0) {
            this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] - 1;
            this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);

            if (this.carShop[findInex]['quantity'] === 0) {
                this.carShop.splice(findInex, 1);
            }
        } else {
            this.carShop.splice(findInex, 1);
        }
        this.dataSource = new MatTableDataSource<any>(this.carShop);
        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    lamina(): void {
        const dialogRef = this.dialog.open(LaminasComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    async anotarImpresiones(): Promise<void> {
        const { value: cantidad } = await Swal.fire({
            title: '',
            input: 'number',
            inputLabel: 'Costo de las impresiones',
        });

        this.carShop.push(
            {
                id: 255,
                itemName: 'Impresiones',
                branch: 'impresiones',
                quantityAvailable: 1000,
                category: "impresiones",
                saleAmount: 1,
                quantity: +cantidad,
                subtotal: +cantidad,
                marca: ''
            },
        );

        this.dataSource = new MatTableDataSource<any>(this.carShop);

        this.calculateTotalAmount();
        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }



    existBox(): void {
        this._ventasServices.verificaCaja(this.fechaActual).subscribe((sales: any) => {
            if (sales === undefined) {
                this.existeCaja = false;
                this.isLoading = false;
            } else if (sales['cajaAbierta']) {
                this.existeCaja = true;
                this.dineroEnCaja = sales['caja'];
                this.getCatalog();
            } else {
                this.existeCaja = false;
                this.cajaCerrada = true;
                this.isLoading = false;
            }
        });

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    openBox(abrirCaja: any): void {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
        let fechaInicio = new Date();

        let dineroCaja = 0;
        if (!this.cajaCerrada && abrirCaja) {
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

                    this._ventasServices.abrirCaja(this.fechaActual, data)
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
            this._ventasServices.abrirCajaNuevamente(this.fechaActual, data)
                .then(() => {
                    if (abrirCaja) {
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
                        for (const row of this.listaVentasHoy) {
                            cont++
                            if (row.categoria && row.categoria.toUpperCase() === 'RECARGA') {
                                excelRecargas.push({
                                    '#': cont,
                                    'Usuario': row.vendedor,
                                    'Articulo': row.nombre,
                                    'Cantidad': row.cantidadVendida,
                                    'Costo': (row.cantidadVendida * row.costoPublico),
                                });
                            } else if (row.categoria && row.categoria.toUpperCase() === 'DULCE') {
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
                        this._excelVentasServices.exportAsExcelFile(excelPapeleria, excelRecargas, excelDulces, this.fechaActual + '_' + this.userData);
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
        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getCatalog(): void {
        this.isLoading = true;
        this._catalogoServices.getCatalogV2().subscribe((listItems: any) => {

            this.itemsList = [];
            let temporal: any[] = [];
            listItems.forEach((item: any) => {
                temporal.push(item);
            });

            let activos = [];
            for (const item of temporal) {
                if (item.activo) {
                    activos.push({
                        id: +item.id,
                        itemName: item.nombre,
                        branch: item.marca,
                        quantityAvailable: +item.cantidad,
                        saleAmount: item.costoPublico,
                        category: item.categoria,
                        ...item
                    })
                }
            }

            this.itemsList = activos.slice();
            this.itemList = activos.slice();
            this.options = activos.slice();

            let temporalCandy: any = [];
            let rechargeTemporal = [];
            this.candyLits = [];
            this.rechargeLits = [];

            for (let item of activos) {
                if (item.category.toUpperCase() === 'DULCE') {
                    temporalCandy.push(item);
                }
    
                if (item.category.toUpperCase() === 'RECARGA') {
                    this.rechargeLits.push(item);
                }
            }

            setTimeout(() => {
                this.candyLits = temporalCandy.sort(function(a: any, b: any){
                    if(a.itemName+'' < b.itemName+'') { return -1; }
                    if(a.itemName+'' > b.itemName+'') { return 1; }
                    return 0;
                })
            }, 1000);

            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
            this.isLoading = false;
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

    cerrarDia(): any {
        let cont = 0;
        let excelRecargas = [];
        let excelDulces = [];
        let excelPapeleria = [];

        let totalPapeleria = 0;
        let totalDulce = 0;
        let totalRecargas = 0;

        for (const row of this.listaVentasHoy) {
            cont++
            if (row.categoria && row.categoria.toUpperCase() === 'RECARGA') {
                excelRecargas.push(row);
                totalRecargas += (row.cantidadVendida * row.costoPublico);
            } else if (row.categoria && row.categoria.toUpperCase() === 'DULCE') {
                excelDulces.push(row);
                totalDulce += (row.cantidadVendida * row.costoPublico);
            } else {
                excelPapeleria.push(row);
                totalPapeleria += (row.cantidadVendida * row.costoPublico);
            }

        }

        const dialogRef = this.dialog.open(ResumenDiaComponent, {
            width: '90%',
            height: '90%',
            data: {
                papeleria: excelPapeleria,
                totalPapeleria: totalPapeleria,
                recargas: excelRecargas,
                totalRecargas: totalRecargas,
                dulces: excelDulces,
                totalDulce: totalDulce
            },
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
}
