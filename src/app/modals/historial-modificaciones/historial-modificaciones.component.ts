import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { VerImagenComponent } from "../ver-imagen/ver-imagen.component";


@Component({
  selector: 'app-historial-modificaciones',
  templateUrl: './historial-modificaciones.component.html',
  styleUrls: ['./historial-modificaciones.component.scss']
})
export class HistorialModificacionesComponent  implements OnInit {

  displayedColumns: string[] = ['np', 'clave', 'nombre', 'marca', 'costo', 'costoPublico', 'caja','cantidad', 'modificacion', 'usuario'];
    dataSource: MatTableDataSource<any>;

  constructor(
    public dialogRef: MatDialogRef<HistorialModificacionesComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data.listItems);
    console.log(this.dataSource.data);
  }

  showImg(element: any): any {
    const dialogRef = this.dialog.open(VerImagenComponent, {
      width: '500px',
      data: {
        items: element
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
