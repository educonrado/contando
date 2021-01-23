import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movimiento } from '../model/movimiento';
import { FirebaseService } from './firebase.service';
const listadoMovimiento = "Movimiento";
@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  movimientos: MovimientoService[];
  totalIngresos: number;
  totalEgresos: number;

  constructor(private _firestoreService: FirebaseService) { }

  crearMovimiento(movimiento: Movimiento) {
    return this._firestoreService.add(listadoMovimiento, movimiento);
  }

  obtenerMovimientos(): Observable<Movimiento[]> {
    return this._firestoreService.col$(listadoMovimiento);
   
  }

  obtenerIngresos(start: Date, end: Date): Observable<Movimiento[]> {
    return this._firestoreService.col$(listadoMovimiento, queryFn => 
      queryFn.where("tipo", "==", "Ingreso").orderBy('fecha').startAt(start).endAt(end));
  }

  obtenerEgresos(start: Date, end: Date): Observable<Movimiento[]> {
    return this._firestoreService.col$(listadoMovimiento, queryFn => 
      queryFn.where("tipo", "==", "Egreso").orderBy('fecha').startAt(start).endAt(end));
  }

  eliminarMovimiento($key: string) {
    console.log("Eliminando $key...");
  }

}
