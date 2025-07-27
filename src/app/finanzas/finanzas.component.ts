import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable  } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from '@angular/material/sort';
import { FinanzasServices } from '../services/finanzas.services';
import { AgregarEgresoComponent } from '../modals/agregar.egreso/agregar-egreso.component';

@Component({
    selector: 'app-finanzas',
    templateUrl: './finanzas.component.html',
    styleUrls: ['./finanzas.component.scss']
})
export class FinanzasComponent implements OnInit {


    /********* RELOJ */
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

    perfil = 0;
    isLoading = true;
    fechaActual: String = '';
    isLoadingSales = false;
    contadorArticulos: any = 0;


    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    filteredOptions: Observable<any[]>;
    myControl = new FormControl('');
    displayedColumns: string[] = ['serial', 'items', 'unit', 'remove', 'quantity', 'add', 'subtotal'];
    dataSource = new MatTableDataSource<any>();
    carShop: any = [];
    totalAmountCar: any = 0;
    listaVentasHoy: any = [];
    @ViewChild(MatSort) sort: MatSort;
    candyLits: any = [];
    rechargeLits: any = [];


    dineroEnCaja = 500;
    totalPapeleria = 0;
    totalRecargas = 0;
    totalDulce = 0;

    dataPendientes: MatTableDataSource<any>;
    pendientes: any = [];
    displayedColumnsPendientes: string[] = ['number', 'fecha', 'cantidad', 'tipo', 'action'];

    dataRecargas: MatTableDataSource<any>;
    recargas: any = [];
    displayedColumnsRecargas: string[] = ['number', 'descripcion', 'fecha', 'cantidad', 'anterior', 'actual'];

    dataPapeleria: MatTableDataSource<any>;
    papeleria: any = [];

    dataDulce: MatTableDataSource<any>;
    dulce: any = [];
    finanzasTodos: any = [];


    getLocalStorage(): void {
        this.usernName = `${localStorage.getItem("nombre")} ${localStorage.getItem("apllPtrn")} ${localStorage.getItem("apllMtrn")}`;
        this.nameProfile = `${localStorage.getItem("nombrePerfil")}`;
        this.imgProfile = `${localStorage.getItem("imagenPerfil")}`;
        this.userData = `${localStorage.getItem("usuario")}`;
        this.perfil = parseInt(`${localStorage.getItem("perfil")}`);
    }

    /**VARIABLES DEL FLUJO */
    constructor(
        private dialog: MatDialog,
        private _finanzas: FinanzasServices,
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

    async ngOnInit(): Promise<void> {
        this.dineroEnCaja = 500;
        this.totalPapeleria = 0;
        this.totalRecargas = 0;
        this.totalDulce = 0;

        this.pendientes = [];
        this.dataPendientes = new MatTableDataSource<any>([]);
        this.recargas = [];
        this.dataRecargas = new MatTableDataSource<any>([]);
        this.papeleria = [];
        this.dataPapeleria = new MatTableDataSource<any>([]);
        this.dataDulce = new MatTableDataSource<any>([]);
        this.dulce = [];
        let anteriorRecargas = 0;
        let anteriorPapeleria = 0;
        let anteriorDulce = 0;

        this.getLocalStorage();
        let response = [];
    
        this._finanzas.getFinanzas().subscribe((ventas: any) => {
            this.dineroEnCaja = 500;
            this.totalPapeleria = 0;
            this.totalRecargas = 0;
            this.totalDulce = 0;
            response = [];
            this.pendientes = [];
            this.dataPendientes = new MatTableDataSource<any>([]);
            this.recargas = [];
            this.dataRecargas = new MatTableDataSource<any>([]);
            this.papeleria = [];
            this.dataPapeleria = new MatTableDataSource<any>([]);
            this.dataDulce = new MatTableDataSource<any>([]);
            this.dulce = [];
            for (const item of ventas) {
                response.push(
                    item.payload.doc.data()
                );
            }

            response = response.sort(({ id: b }, { id: a }) => b - a);

            anteriorRecargas = 0;
            anteriorPapeleria = 0;
            anteriorDulce = 0;
            this.finanzasTodos = response;
            for (const item of response) {
                if (item.pendiente) {
                    this.pendientes.push(item);
                } else {
                    if (item.tipo === 'RECARGAS') {
                        this.recargas.push({
                            anterior: anteriorRecargas,
                            actual: +item.cantidadVendida + +anteriorRecargas,
                            ...item
                        });
                        anteriorRecargas = +item.cantidadVendida + +anteriorRecargas;
                        this.totalRecargas += +item.cantidadVendida;
                    } else if (item.tipo === 'PAPELERIA') {
                        this.papeleria.push({
                            anterior: anteriorPapeleria,
                            actual: +item.cantidadVendida + +anteriorPapeleria,
                            ...item
                        });
                        anteriorPapeleria = +item.cantidadVendida + +anteriorPapeleria;
                        this.totalPapeleria += +item.cantidadVendida;
                    } else {
                        this.dulce.push({
                            anterior: anteriorDulce,
                            actual: +item.cantidadVendida + +anteriorDulce,
                            ...item
                        });
                        anteriorDulce = +item.cantidadVendida + +anteriorDulce;
                        this.totalDulce += +item.cantidadVendida;
                    }
                }
            }

            this.dataPendientes = new MatTableDataSource<any>(this.pendientes);
            this.dataRecargas = new MatTableDataSource<any>(this.recargas);
            this.dataPapeleria = new MatTableDataSource<any>(this.papeleria);
            this.dataDulce = new MatTableDataSource<any>(this.dulce);
        });
        
    }

    saveSale(element: any): any {
        this.pendientes = [];
        this.dataPendientes = new MatTableDataSource<any>([]);
        this.recargas = [];
        this.dataRecargas = new MatTableDataSource<any>([]);
        this.papeleria = [];
        this.dataPapeleria = new MatTableDataSource<any>([]);
        this.dataDulce = new MatTableDataSource<any>([]);
        this.dulce = [];
        this.dineroEnCaja = 500;
        this.totalPapeleria = 0;
        this.totalRecargas = 0;
        this.totalDulce = 0;

        console.log(element);
        Swal.showLoading();
        let data = {
            pendiente: false
        };
        this._finanzas.actualizaPendiente(element.id + '', data)
        .then(async () => {
            Swal.close();
        })
    }

    agregarEgreso(): any {
        const dialogRef = this.dialog.open(AgregarEgresoComponent, {
            width: '600px',
            data: {
                list: this.finanzasTodos
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
           
        });
    }

}
