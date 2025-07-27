import { Component, OnInit } from '@angular/core';
import 'animate.css';
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

    constructor() { }

    async ngOnInit(): Promise<void> {
        this.getLocalStorage();
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


