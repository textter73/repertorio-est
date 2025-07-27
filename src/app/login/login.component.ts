import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, share, Subscription, timer } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { LoginServices } from '../services/login.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public itemForm: FormGroup;
  items: Observable<any[]> ;
  public users = [] as any;
  public usersFind = [] as any;
  
  date: Date = new Date();

  time: any = new Date();
  rxTime: any = new Date();
  intervalId: any;

  subscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private _loginServices: LoginServices,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.navigateByUrl('');
    this.crearFormulario();
    this.clock();
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

  crearFormulario() {
    this.itemForm = this.formBuilder.group({
      'usuario': [null, [Validators.required]],
      'password': [null, Validators.required]
    });
  }

  async validarUsuario() {
    Swal.showLoading();
    let usuario = this.itemForm.controls['usuario'].value;
    let password = this.itemForm.controls['password'].value;

    (await this._loginServices.login(usuario, password)).subscribe((listUsers: any) =>{ 
      this.usersFind = [];
      listUsers.forEach((users: any) =>{
        this.usersFind.push(users.payload.doc.data());
      });
      console.log('xxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxx');
      console.log(this.usersFind);
      console.log('xxxxxxxxxxxxx');
      console.log('xxxxxxxxxxxxx');
      
      let data = this.usersFind.find((x: any) => x.usuario === usuario);
      
      if (data && data.password === password && data.activo) {
        console.log(data);
        localStorage.setItem('id', data.id);
        localStorage.setItem('nivel', data.nivel);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('apllPtrn', data.apellidoPaterno);
        localStorage.setItem('apllMtrn', data.apellidoMaterno);
        localStorage.setItem('perfil', data.perfil);
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('imagenPerfil', data.imagenPerfil);
        localStorage.setItem('nombrePerfil', data.nombrePerfil);
        Swal.close();
        
        this.router.navigateByUrl('terminal-punto-venta');
        
      } else {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Usuario o contraseña incorrecta'
        })
      }

    });
  }

}
