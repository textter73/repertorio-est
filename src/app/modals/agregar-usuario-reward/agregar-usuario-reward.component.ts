import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";
import { AgregarCategoriaComponent } from "../agregar-categoria/agregar-categoria.component";
import { AgregarMarcaComponent } from "../agregar-marca/agregar-marca.component";
import { RewardsServices } from "src/app/services/rewards.services";

@Component({
  selector: 'app-agregar-usuario-reward',
  templateUrl: './agregar-usuario-reward.component.html',
  styleUrls: ['./agregar-usuario-reward.component.scss']
})
export class AgregarUsuarioRewardComponent implements OnInit {

  checkoutForm: any;
  registrarImpresionesForm: any;
  descuentoImpresionesForm: any;
  existe: Boolean = false;
  existePaginas: Boolean = false;
  existeDescuento: Boolean = false;
  userData = '';

  usersRewardList: any = [];
  userSelected: any = [];

  getLocalStorage(): void {
    this.userData = `${localStorage.getItem("usuario")}`;
  }

  constructor(
    public dialogRef: MatDialogRef<AgregarUsuarioRewardComponent>,
    private _catalogoServices: CatalogoServices,
    private _rewardServices: RewardsServices,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.checkoutForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.registrarImpresionesForm = this.formBuilder.group({
      telefono: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required])
    });

    this.descuentoImpresionesForm = this.formBuilder.group({
      telefono: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required])
    });
  }

  validarDatos(): void {
    Swal.showLoading();
    let mensajes = '';
    let errores = false;

    if (this.checkoutForm.get('nombre').status === 'INVALID') {
      mensajes += `<p>-Campo nombre del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('apellidoPaterno').status === 'INVALID') {
      mensajes += `<p>-Campo Apellido Paterno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('apellidoMaterno').status === 'INVALID') {
      mensajes += `<p>-Campo Apellido Materno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('telefono').status === 'INVALID') {
      mensajes += `<p>-Campo Telefóno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('password').status === 'INVALID') {
      mensajes += `<p>-Campo Contraseña obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('password').value.length !== 4) {
      mensajes += `<p>-La contraseña debe estar conformada por 4 digitos</p>`
      errores = true;
    }

    if (errores) {
      Swal.close();
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardarUsuario();
    }
  }

  guardarUsuario(): void {
      let alta = new Date();
      let data = {
        id: 1,
        nombre: this.checkoutForm.get('nombre').value,
        apllPtrn: this.checkoutForm.get('apellidoPaterno').value,
        apllMtrn: this.checkoutForm.get('apellidoMaterno').value,
        activo: true,
        fechaAlta: alta,
        fechaModificacion: alta,
        usuarioCrea: this.userData,
        perfil: 1,
        telefono: this.checkoutForm.get('telefono').value,
        password: this.checkoutForm.get('password').value
      };

      this._rewardServices.saveUser(this.checkoutForm.get('telefono').value + '', data)
        .then(() => {
          Swal.close();
          Swal.fire({
            title: '!Éxito!',
            icon: 'success',
            text: 'Usuario guardado',
            confirmButtonText: 'Ok',
          })
            .then(result => {
              this.onNoClick();
            });
        }, (error) => {
          Swal.close();
          Swal.fire({
            title: '!Error!',
            icon: 'error',
            text: 'Ocurrió un error al guardar el artículo',
          });
        });
  }

  ngOnInit() {
    this.getLocalStorage();
    this.getUsuarios();
  }

  getUsuarios(): void {
    
    /*this.usersRewardList = [{
      activo: true,
      apllMtrn: "Contreras",
      apllPtrn: "Ortiz",
      fechaAlta: '',
      fechaModificacion: '',
      id: 1,
      nombre: "Juan Angel",
      password: "0172",
      perfil: 1,
      telefono: "7224250172",
      usuarioCrea: "aortiz"
    }, {  
      activo: true,
      apllMtrn: "Pérez",
      apllPtrn: "Camacho",
      fechaAlta: '',
      fechaModificacion: '', 
      id: 1,
      nombre: "Daniela",
      password: "0730",
      perfil:1,
      telefono: "7223980730",
      usuarioCrea: "aortiz",
    }];*/
    
    this._rewardServices.getUsers().subscribe((findUser: any) => {
      this.usersRewardList = findUser;
    });
  }

  RemoveAccents(str: string): string {
    const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    const str1 = str.split('');
    const strLen = str.length;
    let i, x;
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str1[i])) !== -1) {
        str1[i] = accentsOut[x];
      }
    }
    return str1.join('');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onTelefono(codigo: any): void {
    let telefono = codigo.target.value;
    this.existe = false;
    const find = this.usersRewardList.find((item: { telefono: any; }) => item.telefono === telefono);
    if (find) {
      this.existe = true;
      Swal.fire({
        title: 'Oops...',
        icon: 'warning',
        html: `<b>${telefono}</b> <br> !Este número telefónico ya se encuentra registrado! <br>`,
        confirmButtonText: 'Ok'
      })
    }
  }

  onTelefonoPaginas(codigo: any): void {
    let telefono = codigo.target.value;
    this.existePaginas = false;
    const find = this.usersRewardList.find((item: { telefono: any; }) => item.telefono === telefono);
    if (find) {
      this.existePaginas = true;
      /*
      this.userSelected = {
        historial: [{
          activo: true,
          name: 'Impresiones',
          amount: 0.05,
          id: 1,
          quantity: 5,
          type: 1,
          usuarioCrea: "aortiz"
        }, {
          activo: true,
          amount: 0,
          id: 2,
          name: "Impresiones",
          quantity: 0,
          type: 2,
          usuarioCrea: "aortiz"
        }],
        ...find
      };
      let totalAmount = 0;
      for (const item of this.userSelected.historial) {
        if (+item.type === 1) {
          totalAmount = totalAmount + item.amount;
        } else {
          totalAmount = totalAmount - item.amount;
        }
      }
      this.userSelected.totalAmount = totalAmount;
      */

      this._rewardServices.getMovimientos(find.telefono + '').subscribe((historial: any) => {
        this.userSelected = {
          historial: historial,
          ...find
        };

        let totalAmount = 0;
        for (const item of this.userSelected.historial) {
          if (+item.type === 1) {
            totalAmount = totalAmount + item.amount;
          } else {
            totalAmount = totalAmount - item.amount;
          }
        }
        this.userSelected.totalAmount = totalAmount;
      });
      
    }
  }

  onTelefonoDescuento(codigo: any): void {
    let telefono = codigo.target.value;
    this.existeDescuento = false;
    const find = this.usersRewardList.find((item: { telefono: any; }) => item.telefono === telefono);
    if (find) {
      this.existeDescuento = true;
      /*
      this.userSelected = {
        historial: [{
          activo: true,
          name: 'Impresiones',
          amount: 0.05,
          dateSales: 'ut {seconds: 1725764685, nanoseconds: 492000000}',
          id: 1,
          quantity: 5,
          type: 1,
          usuarioCrea: "aortiz"
        }, {
          activo: true,
          amount: 0,
          dateSales: 'ut {seconds: 1725808669, nanoseconds: 75000000}',
          id: 2,
          name: "Impresiones",
          quantity: 0,
          type: 2,
          usuarioCrea: "aortiz"
        }],
        ...find
      };
      let totalAmount = 0;
      for (const item of this.userSelected.historial) {
        if (+item.type === 1) {
          totalAmount = totalAmount + item.amount;
        } else {
          totalAmount = totalAmount - item.amount;
        }
        
      }
      this.userSelected.totalAmount = totalAmount;
      */
    
      this._rewardServices.getMovimientos(find.telefono + '').subscribe((historial: any) => {

        let totalAmount = 0;
        let historialAux = [];
        for (const item of this.userSelected.historial) {
          const timestamp = item.dateSales;
          const date: Date = timestamp.toDate();
          const today: Date = new Date();
          
          if (date > today) {
            historialAux.push(item);
            if (+item.type === 1) {
              totalAmount = totalAmount + item.amount;
            } else {
              totalAmount = totalAmount - item.amount;
            }
          } else {
            if (+item.type !== 1) {
              historialAux.push(item);
              if (+item.type === 1) {
                totalAmount = totalAmount + item.amount;
              } else {
                totalAmount = totalAmount - item.amount;
              }
            }
          }
          
        }
        this.userSelected = {
          historial: historialAux,
          ...find
        };
        this.userSelected.totalAmount = totalAmount;
      });

      
    
    }
  }

  validarDescuento(): void {
    Swal.showLoading();
    let mensajes = '';
    let errores = false;
    
    if (this.descuentoImpresionesForm.get('telefono').status === 'INVALID') {
      mensajes += `<p>-Campo telefono obligatorio</p>`
      errores = true;
    }

    if (this.descuentoImpresionesForm.get('cantidad').status === 'INVALID') {
      mensajes += `<p>-Campo cantidad obligatorio</p>`
      errores = true;
    }
   
    if (+this.descuentoImpresionesForm.get('cantidad').value > +this.userSelected.totalAmount) {
      mensajes += `<p>-El saldo es insuficiente</p>`
      errores = true;
    }

    if (+this.descuentoImpresionesForm.get('cantidad').value === 0) {
      mensajes += `<p>-El saldo a descontar debe ser mayor a 0</p>`
      errores = true;
    }

    if (errores) {
      Swal.close();
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardarDescuento();
    }
  }

  guardarDescuento(): void {
    let alta = new Date();
    let body = {
      id: (this.userSelected.historial.length + 1),
      activo: true,
      dateSales: alta,
      usuarioCrea: this.userData,
      type: 2,
      name: 'Impresiones',
      quantity: 0,
      amount: +this.descuentoImpresionesForm.get('cantidad').value
    };
    
    this._rewardServices.creaMovimiento(this.userSelected.telefono + '', (this.userSelected.historial.length + 1) + '', body)
      .then(() => {
        Swal.close();
        Swal.fire({
          title: '!Éxito!',
          icon: 'success',
          text: 'Movimiento registrado',
          confirmButtonText: 'Ok',
        })
          .then(result => {
            this.onNoClick();
          });
      }, (error) => {
        Swal.close();
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar el artículo',
        });
      });
  
  }

  validarPaginas(): void {
    Swal.showLoading();
    let mensajes = '';
    let errores = false;
    
    if (this.registrarImpresionesForm.get('telefono').status === 'INVALID') {
      mensajes += `<p>-Campo telefono obligatorio</p>`
      errores = true;
    }

    if (this.registrarImpresionesForm.get('cantidad').status === 'INVALID') {
      mensajes += `<p>-Campo cantidad obligatorio</p>`
      errores = true;
    }

    if (this.registrarImpresionesForm.get('cantidad').value > 33) {
      mensajes += `<p>-La cantidad máxima de páginas por día es de 33</p>`
      errores = true;
    }

    if (errores) {
      Swal.close();
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardarImpresiones();
    }
  }

  guardarImpresiones(): void {
    let alta = new Date();
    let body = {
      id: (this.userSelected.historial.length + 1),
      activo: true,
      dateSales: alta,
      usuarioCrea: this.userData,
      type: 1,
      name: 'Impresiones',
      quantity: +this.registrarImpresionesForm.get('cantidad').value,
      amount: ((+this.registrarImpresionesForm.get('cantidad').value) * 0.03),
    };

    this._rewardServices.creaMovimiento(this.userSelected.telefono + '', (this.userSelected.historial.length + 1) + '', body)
      .then(() => {
        Swal.close();
        Swal.fire({
          title: '!Éxito!',
          icon: 'success',
          text: 'Movimiento registrado',
          confirmButtonText: 'Ok',
        })
          .then(result => {
            this.onNoClick();
          });
      }, (error) => {
        Swal.close();
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ocurrió un error al guardar el artículo',
        });
      });

  }

}
