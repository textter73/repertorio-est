import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { FinanzasServices } from "src/app/services/finanzas.services";
import * as moment from 'moment';
import Swal from "sweetalert2";
import { VentasServices } from "src/app/services/ventas.services";
import { MatStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";

moment.locale("es");

@Component({
  selector: 'app-resumen-dia',
  templateUrl: './resumen-dia.component.html',
  styleUrls: ['./resumen-dia.component.scss']
})
export class ResumenDiaComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  dataSourcePapeleria: MatTableDataSource<any>;
  dataSourceRecargas: MatTableDataSource<any>;
  dataSourceDulces: MatTableDataSource<any>;
  displayedColumnsSalesList: string[] = ['number', 'items', 'quantity', 'amount', 'vendor', 'saleDay'];
  idActual = 0;
  idActual2 = 0;
  fechaActual: String = '';

  isPapeleria: any = true;
  isRecargas: any = true;
  isDulces: any = true;

  listaVentasHoy: any = [];

  monedas: any = 0
  billetes: any = 0;
  userData = '';
  flag = false;

  constructor(
    public dialogRef: MatDialogRef<ResumenDiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _finanzas: FinanzasServices,
    private _ventasServices: VentasServices,
    private router: Router,
  ) { }

  async ngOnInit() {

    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const formatHoy = hoy < 10 ? '0' + hoy : hoy;
    this.getLocalStorage();
    // this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
    this.fechaActual = '1892024';
    this.dataSourcePapeleria = new MatTableDataSource<any>(this.data['papeleria']);
    this.dataSourceRecargas = new MatTableDataSource<any>(this.data['recargas']);
    this.dataSourceDulces = new MatTableDataSource<any>(this.data['dulces']);

    await this.obtenerListado();

    let response: any = [];

    await this._finanzas.getFinanzasV2().subscribe(async(ventas: any) => {
      this.idActual = 0;
      for (const item of ventas) {
        response.push(item);
      }

      if (!this.flag) {
        this.idActual = response.length + 1;
        this.idActual2 = response.length + 2;
        console.log('flag');
        console.log('flag');
        console.log(response);
        console.log(response.length);
        console.log(this.flag);
        console.log(this.idActual);
        console.log(this.idActual2);
        console.log('flag');
        console.log('flag');
        this.flag = true;
      }
    });

    
  }

  getLocalStorage(): void {
    this.userData = `${localStorage.getItem("usuario")}`;
  }

  async guardarPapeleria(): Promise<any> {
    if (+this.data.totalPapeleria > 0) {
      Swal.showLoading();
      const fecha = new Date();

      let guardaPapeleria = {
        id: this.idActual,
        fecha: this.fechaActual,
        descripcion: moment(fecha).format('LLLL').toString(),
        cantidadVendida: this.data.totalPapeleria,
        tipo: 'PAPELERIA',
        ingreso: true,
        pendiente: true
      };
      await this._finanzas.guardaFinanzas(this.idActual + '', guardaPapeleria)
        .then(async () => {
          this.isPapeleria = false;
          await this.obtenerListado();
          await this.stepper.next();
          Swal.close();
        });
    } else {
      await this.obtenerListado();
      await this.stepper.next();
      Swal.close();
    }
  }

  async guardarRecargas(): Promise<any> {
    if (+this.data.totalRecargas > 0) {
      Swal.showLoading();
      const fecha = new Date();

      let guardaRecarga = {
        id: this.idActual2,
        fecha: this.fechaActual,
        descripcion: moment(fecha).format('LLLL').toString(),
        cantidadVendida: this.data.totalRecargas,
        tipo: 'RECARGAS',
        ingreso: true,
        pendiente: true
      };

      await this._finanzas.guardaFinanzas(this.idActual2 + '', guardaRecarga)
        .then(async () => {
          this.isRecargas = false;
          Swal.close();
          this.onNoClick();
          this.exit();
        });
    } else {
      Swal.close();
      this.onNoClick();
      this.exit();
    }

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

  async guardarDulces(): Promise<any> {
    Swal.showLoading();
    const fecha = new Date();

    let guardaDulce = {
      id: this.idActual,
      fecha: this.fechaActual,
      descripcion: moment(fecha).format('LLLL').toString(),
      cantidadVendida: this.data.totalDulce,
      tipo: 'DULCE',
      ingreso: true,
      pendiente: true
    };
    await this._finanzas.guardaFinanzas(this.idActual + '', guardaDulce)
      .then(async () => {
        this.isDulces = false;
        Swal.close();
      });
  }

  async obtenerListado() {
    await this._ventasServices.ventasHoy(this.fechaActual).subscribe(async (ventas) => {
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


          this.data.papeleria = excelPapeleria,
            this.data.totalPapeleria = totalPapeleria,
            this.data.recargas = excelRecargas,
            this.data.totalRecargas = totalRecargas,
            this.data.dulces = excelDulces,
            this.data.totalDulce = totalDulce

          this.dataSourcePapeleria = new MatTableDataSource<any>(this.data['papeleria']);
          this.dataSourceRecargas = new MatTableDataSource<any>(this.data['recargas']);
          this.dataSourceDulces = new MatTableDataSource<any>(this.data['dulces']);

        }
      }

    });
  }

  async verificaExtras(): Promise<void> {
    await this.obtenerListado().then(async () => {
      let extras = ((this.monedas + this.billetes) - (+this.data.totalPapeleria + +this.data.totalRecargas + +this.data.totalCaja));

      if (extras > 0) {
        let alta = new Date();
        let indexAuto = (+this.data.papeleria.length + +this.data.recargas.length + + this.data.dulces.length) + 1;

        let data = {
          cantidadVendida: 1,
          costoPublico: extras,
          fechaVenta: alta,
          idArticulo: 9999,
          nombre: `Extras de ${this.userData}`,
          vendedor: this.userData,
          order: (indexAuto).toString(),
          activo: true,
          categoria: 'extras',
          marca: 'extras',
          withoutRegistration: true
        };

        await this._ventasServices.creaVentasHoy(this.fechaActual, data, ((indexAuto).toString()))
          .then(async () => {
            await this.obtenerListado();
            await this.stepper.next();
          }, (error) => {
            Swal.fire({
              title: '!Error!',
              icon: 'error',
              text: 'Ocurrió un error al guardar la venta',
            });
          });
      } else {
        await this.obtenerListado();
        await this.stepper.next();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
