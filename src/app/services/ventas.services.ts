import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class VentasServices {

    constructor(
        private firestore: AngularFirestore
    ) {}

    ventasHoy(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).collection('ventas/', ref => ref.orderBy('order')).valueChanges();
    }

    getVentasHoy(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).collection('ventas/').valueChanges();
    }

    getVentasHoyV2(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).collection('ventas/').valueChanges();
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
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).valueChanges();
    }

    verificaCajaV2(ventasHoy: any) {
        return this.firestore.collection(`ventashoy/`).doc(ventasHoy).get();
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

    obtenerVentasPapeleria(ventasHoy: any) {
        return this.firestore.collection('ventaspapeleria/').snapshotChanges();
    }
}