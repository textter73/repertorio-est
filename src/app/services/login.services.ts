import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginServices {
    constructor(
        private firestore: AngularFirestore
    ) {}
    
    // Método login: busca un usuario con usuario y contraseña (lectura única)
    login(usuario: string, password: string): Observable<any> {
        return this.firestore.collection('usuarios', ref =>
            ref.where('usuario', '==', usuario).where('password', '==', password)
        ).get().pipe(
            map(snapshot => {
                if (snapshot.empty) {
                    return null; // No se encontró el usuario
                }
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as any
                }));
                return docs[0]; // Retorna el primer (y probablemente único) usuario
            })
        );
    }

    getEvaluations(id: any,) {
        return this.firestore.collection(`usuarios/`).doc(id).collection('evaluaciones/').valueChanges();
    }
}