import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { EventosServices } from "src/app/services/eventos.services";
import { LoginServices } from "src/app/services/login.services";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent  implements OnInit {

    noAsistiran: any[] = [];
    pendienteConfirmar: any[] = [];
    confirmanAsistencia: any[] = [];
    talVezAsistan: any[] = [];
    contestoEvento: any = false;
    personalInformation: any = {
        name: ''
    };
    totalUsuarios: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowListComponent>,
    private _eventosServices: EventosServices,
    private _loginService: LoginServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.personalInformation = {
        id: `${localStorage.getItem("id")}`,
        nombreCompleto: `${localStorage.getItem("nombreCompleto")}`
    };

    this._loginService.getUsuariosSinPassword().subscribe(usuarios => {
      this.totalUsuarios = usuarios;
      this.obtenerListado();
    });
    
  }

  async obtenerListado(): Promise<any> {
    this.contestoEvento = false;
    this.confirmanAsistencia = [];
    this.noAsistiran = [];
    this.talVezAsistan = [];
    this.pendienteConfirmar = [];

    await this._eventosServices.obtenerAsistentes(this.data.id).subscribe(asistente => {
        for (const item of asistente) {
          if (!this.contestoEvento) {
            this.contestoEvento = +item.usuarioId === +this.personalInformation.id;
          }
        
          if (+item.estatusAsistenciaId === 1) {
            this.confirmanAsistencia.push(item);
          } else if (+item.estatusAsistenciaId === 2) {
            this.noAsistiran.push(item);
          } else if (+item.estatusAsistenciaId === 3) {
            this.talVezAsistan.push(item);
          } else {
            this.pendienteConfirmar.push(item);
          }

          //Eliminamos los que la confirmaron
          const index = this.totalUsuarios.findIndex(u => +u.id === +item.usuarioId);
          if (index > -1) {
            this.totalUsuarios.splice(index, 1); // elimina 1 elemento en index
          }
        }
        this.pendienteConfirmar = this.totalUsuarios;
    });
  }

  async confirmarAsistencia(accion: any): Promise<any> {
    Swal.showLoading();
    
    let body = {
      usuarioId: +this.personalInformation.id,
      nombre: this.personalInformation.nombreCompleto,
      estatusAsistenciaId: +accion
    };
  
    await this._eventosServices.agregarAsistente(this.data.id, body)
    .then(async asistente => {
      await this.obtenerListado();
      Swal.close();
    })
    .catch(error => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo guardar la información.'
      })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
