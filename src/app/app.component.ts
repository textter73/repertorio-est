import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, map, share, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showFiller = false;
  rxTime: any = new Date();
  time: any = new Date();
  intervalId: any;
  subscription: Subscription | undefined;

  userName = '';
  nameProfile = '';
  imgProfile = '';
  userData = '';
  profile = 0;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { 
    this.cdr.detectChanges();
    this.clock();
    this.getLocalStorage();

    if (!this.profile) {
      this.router.navigateByUrl('');
      this.cdr.detectChanges();
    }
  }

  clock(): any {
    this.cdr.detectChanges();
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

  getLocalStorage(): void {
    this.cdr.detectChanges();
    this.userName = `${localStorage.getItem("nombre")} ${localStorage.getItem("apllPtrn")} ${localStorage.getItem("apllMtrn")}`;
    this.nameProfile = `${localStorage.getItem("nombrePerfil")}`;
    this.imgProfile = `${localStorage.getItem("imagenPerfil")}`;
    this.userData = `${localStorage.getItem("usuario")}`;
    this.profile = parseInt(`${localStorage.getItem("perfil")}`);

    this.cdr.detectChanges();
  }

  exit(): void {
    localStorage.removeItem('nombre');
    localStorage.removeItem('apllPtrn');
    localStorage.removeItem('apllMtrn');
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuario');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('nombrePerfil');
    this.profile = 0;
    location.reload();
    this.router.navigateByUrl('');
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
 }
}
