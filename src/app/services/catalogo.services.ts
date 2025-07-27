import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServices {

  constructor(
    private firestore: AngularFirestore
  ) {}

  getCatalog() {
    return this.firestore.collection('articulos/').get();
  }

  getCatalogV2() {
    return this.firestore.collection('articulos/').valueChanges();
  }

  getMarcas() {
    return this.firestore.collection( 'catalogoMarcas/').snapshotChanges();
  }

  getCategorias() {
    return this.firestore.collection( 'catalogoCategorias/').snapshotChanges();
  }

  guardaArticulo(id: any, data: any) {
    return this.firestore.collection('articulos/').doc(id).set(data);
  }

  guardaPrecios(url: any, id: any, data: any) {
    return this.firestore.collection(url).doc(id).set(data);
  }

  actualizaArticulo(id: any, data: any) {
    return this.firestore.collection('articulos/').doc(id).update(data);
  }

  guardaHistorial(id: any, data: any, fecha: any) {
    return this.firestore.collection(`articulos/${id}/historial`).doc(fecha).set(data);
  }

  guardaNuevaMarca(id: any, data: any) {
    return this.firestore.collection('catalogoMarcas/').doc(id).set(data);
  }

  guardaNuevaCategoria(id: any, data: any) {
    return this.firestore.collection('catalogoCategorias/').doc(id).set(data);
  }

  getPrecios(url: any) {
    return this.firestore.collection(url).snapshotChanges();
  }

  getCatalogHistorial(id: any) {
    return this.firestore.collection(`articulos/${id}/historial`).snapshotChanges();
  }

  getCatalogHistorialV2(id: any) {
    return this.firestore.collection(`articulos/${id}/historial`).valueChanges();
  }

  actualizarTipoPago(id: any, data: any, fecha: any) {
    return this.firestore.collection(`finanzas/${fecha}`).doc(id).update(data);
  }
}
