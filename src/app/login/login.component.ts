import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, share, Subscription, timer } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';

import usuarios from '../services/usuarios.json'

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.navigateByUrl('');
    this.crearFormulario();
    this.clock();
    this.usersFind = usuarios;
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
    let userName = this.itemForm.controls['usuario'].value;
    let password = this.itemForm.controls['password'].value;
    
    let data = this.usersFind.find((x: any) => x.userName === userName && +password === +x.password && x.active);
    console.log(data);
    
    if (data) {
      
      localStorage.setItem('id', data.id);
      localStorage.setItem('level', data.level);
      localStorage.setItem('name', data.name);
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('profile', data.profile);
      localStorage.setItem('profileId', data.profileId);
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('imgProfile', data.imgProfile);
      Swal.close();
      
      this.router.navigateByUrl('inicio');
      
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario o contraseña incorrecta'
      })
    }
  }

}
