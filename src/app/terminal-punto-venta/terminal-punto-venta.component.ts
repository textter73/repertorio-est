import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { CatalogoServices } from 'src/app/services/catalogo.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from "@angular/material/dialog";
import { ResumenComprasComponent } from '../modals/resumen-compras/resumen-compras.component';
import { VentasServices } from '../services/ventas.services';
import { ExcelServices } from '../services/excel.services';
import { ExcelVentasServices } from '../services/excelVentas.serices';
import { MatSort } from '@angular/material/sort';
import { ResumenTurnoComponent } from '../modals/resumen-turno/resumen-turno.component';
import { ResumenDiaComponent } from '../modals/resumen-dia/resumen-dia.component';
import { SeleccionarArticuloComponent } from '../modals/seleccionar-articulo/seleccionar-articulo.component';
import { LaminasComponent } from '../modals/laminas/laminas.component';
import 'animate.css';
import { RegistrarArticuloComponent } from '../modals/registrar-articulo/registrar-articulo.component';
import { AgregarStockComponent } from '../modals/agregar-stock/agregar-stock.component';
import { ModificarArticuloUsuarioComponent } from '../modals/modificar-articulo-usuario/modificar-articulo-usuario.component';
import { CerrarCajaComponent } from '../modals/cerrar-caja/cerrar-caja.component';
import { AgregarUsuarioRewardComponent } from '../modals/agregar-usuario-reward/agregar-usuario-reward.component';
import { LoginServices } from '../services/login.services';

@Component({
    selector: 'app-terminal-punto-venta',
    templateUrl: './terminal-punto-venta.component.html',
    styleUrls: ['./terminal-punto-venta.component.scss']
})
export class TerminalPuntoVentaComponent implements OnInit {
    usernName = '';
    nameProfile = '';
    imgProfile = '';
    userData = '';
    perfil = 0;
    nivel = 0;
    id = 0;

    evaluationList = [];

    constructor(
        private _loginServices: LoginServices
      ) { }

    async ngOnInit(): Promise<void> {
        this.getLocalStorage();

        (await this._loginServices.getEvaluations(this.id + '')).subscribe((data: any) =>{ 
            console.log('ooooooo');
            console.log('ooooooo');
            console.log(data);
            this.evaluationList = data;
            console.log('ooooooo');
            console.log('ooooooo');
            
          });
    }

    getLocalStorage(): void {
        this.usernName = `${localStorage.getItem("nombre")} ${localStorage.getItem("apllPtrn")} ${localStorage.getItem("apllMtrn")}`;
        this.nameProfile = `${localStorage.getItem("nombrePerfil")}`;
        this.imgProfile = `${localStorage.getItem("imagenPerfil")}`;
        this.userData = `${localStorage.getItem("usuario")}`;
        this.perfil = parseInt(`${localStorage.getItem("perfil")}`);
        this.nivel = parseInt(`${localStorage.getItem("nivel")}`);
        this.id = parseInt(`${localStorage.getItem("nivel")}`);
    }

    exit(): void {
        localStorage.removeItem('nombre');
        localStorage.removeItem('apllPtrn');
        localStorage.removeItem('apllMtrn');
        localStorage.removeItem('perfil');
        localStorage.removeItem('usuario');
        localStorage.removeItem('imagenPerfil');
        localStorage.removeItem('nombrePerfil');
        location.reload();
    }

}


