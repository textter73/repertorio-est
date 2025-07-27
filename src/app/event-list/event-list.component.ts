import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

    personalInformation: any = {
        fullName: ''
    };

    constructor(
        private cdr: ChangeDetectorRef
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
        console.log(this.personalInformation);
        this.cdr.detectChanges();
    }
}
