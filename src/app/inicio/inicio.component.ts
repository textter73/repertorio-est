import { Component, OnInit } from '@angular/core';
import 'animate.css';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
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
        localStorage.removeItem('id');
        localStorage.removeItem('active');
        localStorage.removeItem('name');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('profileId');
        localStorage.removeItem('profile');
        localStorage.removeItem('imgProfile');
        localStorage.removeItem('userName');
        localStorage.removeItem('password');
        localStorage.removeItem('level');
        location.reload();
    }

}


