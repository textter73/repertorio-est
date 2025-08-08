import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

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
            fullName: `${localStorage.getItem("nombre")} ${localStorage.getItem("apellidoPaterno")} ${localStorage.getItem("apellidoMaterno")}`,
            profile: `${localStorage.getItem("nombrePerfil")}`,
            imgProfile: `${localStorage.getItem("imagenPerfil")}`
        } 

        this.cdr.detectChanges();
    }
}
