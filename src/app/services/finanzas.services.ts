import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class FinanzasServices {

    constructor(
        private firestore: AngularFirestore
    ) {}

    getFinanzas() {
        return this.firestore.collection(`finanzas/`).snapshotChanges();
    }

    getFinanzasV2() {
        return this.firestore.collection(`finanzas/`).valueChanges();
    }

    guardaFinanzas(id: any, data: any) {
        return this.firestore.collection('finanzas/').doc(id).set(data);
    }

    actualizaPendiente(id: any, data: any) {
        return this.firestore.collection('finanzas/').doc(id).update(data);
    }

}