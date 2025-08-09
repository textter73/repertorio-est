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
    login(usuario: string, password: number): Observable<any> {
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

    // Obtener todos los usuarios sin el campo 'password'
    getUsuariosSinPassword(): Observable<any[]> {
        return this.firestore.collection('usuarios').get().pipe(
        map(snapshot => {
            return snapshot.docs.map(doc => {
            const data = doc.data() as any;
            const id = doc.id;

            // Elimina el campo 'password' antes de devolver
            const { password, ...rest } = data;
            return {
                id,
                ...rest
            };
            });
        })
        );
    }
}