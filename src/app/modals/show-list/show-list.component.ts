import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent  implements OnInit {

    lackList: any[] = [];
    pendingConfirm: any[] = [];
    confirmAttendance: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.confirmAttendance = this.data.confirmAttendance;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
