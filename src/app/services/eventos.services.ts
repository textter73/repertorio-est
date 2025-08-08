import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EventosServices {
    constructor(
        private firestore: AngularFirestore
    ) {}
    
    // Método login: busca un usuario con usuario y contraseña (lectura única)
    listadoEventos(): Observable<any> {
        return this.firestore.collection('eventos', ref =>
            ref.where('activo', '==', true)
        ).get().pipe(
            map(snapshot => {
                if (snapshot.empty) {
                    return null; // No se encontró el usuario
                }
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as any
                }));
                return docs; // Retorna el primer (y probablemente único) usuario
            })
        );
    }

    // Obtener un asistente específico
    obtenerAsistentes(eventoId: string): Observable<any[]> {
        const path = `eventos/${eventoId}/asistentes`;
        return this.firestore.collection(path).get().pipe(
            map(snapshot => {
                if (snapshot.empty) {
                    return []; // Retorna array vacío si no hay asistentes
                }
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as any
                }));
            })
        );
    }
}