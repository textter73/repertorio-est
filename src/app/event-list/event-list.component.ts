import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShowListComponent } from '../modals/show-list/show-list.component';
import { MatDialog } from '@angular/material/dialog';
import { EventosServices } from '../services/eventos.services';

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
        public dialog: MatDialog,
        private _eventosServices: EventosServices,
    ) { }

    async listadoEventos() {
        this._eventosServices.listadoEventos().subscribe(data => {
            for (const item of data) {
                item.fechaFormato = new Date(item.fechaEvento.seconds * 1000 + item.fechaEvento.nanoseconds / 1000000);
            }
            this.eventList = data;
        });
    }

    async ngOnInit(): Promise<void> {
        this.getLocalStorage();
        this.listadoEventos();
    }

    getLocalStorage(): void {
        this.cdr.detectChanges();
        this.personalInformation = {
            fullName: `${localStorage.getItem("name")} ${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`,
            profile: `${localStorage.getItem("profile")}`,
            imgProfile: `${localStorage.getItem("imgProfile")}`,
            id: `${localStorage.getItem("id")}`
        }
        this.cdr.detectChanges();
    }

    showList(item: any): any {
        this.dialog.open(ShowListComponent, {
            width: '80%',
            height: 'auto',
            data: item
        });

    }
}
