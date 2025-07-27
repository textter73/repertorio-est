import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class LaminasServices {

    constructor(
        private firestore: AngularFirestore
    ) {}
    
    laminasbyLetras(letra: any) {
        return this.firestore.collection(`laminas/`).doc(letra).collection(letra+'/').snapshotChanges();
    }

    guardaLamina(letra: any, data: any, id: any) {
        return this.firestore.collection(`laminas/${letra}/${letra}`).doc(id).set(data);
    }

    obtenerLaminas() {
        return this.firestore.collectionGroup('laminas/');
    }



    ventasHoy(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).collection('ventas/', ref => ref.orderBy('order')).snapshotChanges();
    }

    creaVentasHoy(ventasHoy: any, data: any, number: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).collection('ventas/').doc(number).set(data);
    }

    abrirCaja(ventasHoy: any, data: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).set(data);
    }

    abrirCajaNuevamente(ventasHoy: any, data: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).update(data);
    }

    verificaCaja(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).snapshotChanges();
    }

    guardaPapeleriaHoy(fechaActual: any, data: any) {
        return this.firestore.collection('ventaspapeleria/').doc(fechaActual).set(data);
    }

    guardaRecargasHoy(fechaActual: any, data: any) {
        return this.firestore.collection('ventasrecargas/').doc(fechaActual).set(data);
    }

    guardaEngargoladosHoy(fechaActual: any, data: any) {
        return this.firestore.collection('ventasengargolados/').doc(fechaActual).set(data);
    }

   
}