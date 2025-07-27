import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginServices {
    constructor(
        private firestore: AngularFirestore
    ) {}
    
    async login(usuario: any, password: any) {
        return await this.firestore.collection('usuarios').snapshotChanges();
    }

    getEvaluations(id: any,) {
        return this.firestore.collection(`usuarios/`).doc(id).collection('evaluaciones/').valueChanges();
    }
}