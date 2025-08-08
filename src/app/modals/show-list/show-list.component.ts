import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { EventosServices } from "src/app/services/eventos.services";


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

  constructor(
    public dialogRef: MatDialogRef<ShowListComponent>,
    private _eventosServices: EventosServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    
    this._eventosServices.obtenerAsistentes(this.data.id).subscribe(asistente => {
        for (const item of asistente) {
          if (+item.estatusAsistenciaId === 1) {
            this.confirmanAsistencia.push(item);
          } else if (+item.estatusAsistenciaId === 2) {
            this.noAsistiran.push(item);
          } else if (+item.estatusAsistenciaId === 3) {
            this.talVezAsistan.push(item);
          } else {
            this.pendienteConfirmar.push(item);
          }
        }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
