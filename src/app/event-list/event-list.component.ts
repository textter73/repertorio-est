import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import eventList from '../services/eventos.json'
import { ShowListComponent } from '../modals/show-list/show-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

    personalInformation: any = {
        fullName: ''
    };

    eventList: any = [];
    constructor(
        private cdr: ChangeDetectorRef,
        public dialog: MatDialog
    ) { }

    async ngOnInit(): Promise<void> {
        this.getLocalStorage();
    }

    getLocalStorage(): void {
        this.cdr.detectChanges();
        this.personalInformation = {
            fullName: `${localStorage.getItem("name")} ${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`,
            profile: `${localStorage.getItem("profile")}`,
            imgProfile: `${localStorage.getItem("imgProfile")}`,
            id: `${localStorage.getItem("id")}`
        } 
        

        this.eventList = eventList;

        this.cdr.detectChanges();
    }

    showList(item: any): any {
        this.dialog.open(ShowListComponent, {
            panelClass: 'full-width-dialog',
            width: '100%',
            data: item
        });

    }
}
