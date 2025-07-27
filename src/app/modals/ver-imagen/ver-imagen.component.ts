import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-ver-imagen',
  templateUrl: './ver-imagen.component.html',
  styleUrls: ['./ver-imagen.component.scss']
})
export class VerImagenComponent  implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VerImagenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    console.log(this.data.items.imagen);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
