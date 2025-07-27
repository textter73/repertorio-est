import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, share, Subscription, timer } from 'rxjs';
import * as moment from 'moment/moment';

@Component({
    selector: 'app-top-nav-bar',
    templateUrl: './top-nav-bar.component.html',
    styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {


    /********* RELOJ */
    time: any = new Date();
    rxTime: any = new Date();
    intervalId: any;
    subscription: Subscription | undefined;
    usernName = '';
    nameProfile = '';
    imgProfile = '';
    userData = '';
    perfil = 98;

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
        localStorage.removeItem('nombre');
        localStorage.removeItem('apllPtrn');
        localStorage.removeItem('apllMtrn');
        localStorage.removeItem('perfil');
        localStorage.removeItem('usuario');
        localStorage.removeItem('imagenPerfil');
        localStorage.removeItem('nombrePerfil');

        this.router.navigateByUrl('');
    }

    /********* RELOJ */

    /**VARIABLES DEL FLUJO */
    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.clock();
        this.getLocalStorage();
    }

}
