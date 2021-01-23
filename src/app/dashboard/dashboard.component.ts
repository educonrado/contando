import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mes } from '../model/mes';
import { Movimiento } from '../model/movimiento';
import { ComunicacionService } from '../services/comunicacion.service';
import { MovimientoService } from '../services/movimiento.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['tipo', 'ruc', 'cliente', 'fecha', 'subtotal', 'iva', 'total', 'acciones'];
  public movimientos = new MatTableDataSource();
  public loading: boolean = true;
  public movimientosObj: Movimiento[] = [];
  public movimientoSeleccionado: Movimiento = new Movimiento();
  public totalIngresosRegistrados: number;
  public fecha: Date = new Date();
  inversion: number = 0;
  balance: number = 0;
  totalEgresos: number = 0;
  totalIngresos: number = 0;
  meses: Mes[] = [
    { valor: 1, viewValue: 'Enero' },
    { valor: 2, viewValue: 'Febrero' },
    { valor: 3, viewValue: 'Marzo' },
    { valor: 4, viewValue: 'Abril' },
    { valor: 5, viewValue: 'Mayo' },
    { valor: 6, viewValue: 'Junio' },
    { valor: 7, viewValue: 'Julio' },
    { valor: 8, viewValue: 'Agosto' },
    { valor: 9, viewValue: 'Septiembre' },
    { valor: 10, viewValue: 'Octubre' },
    { valor: 11, viewValue: 'Noviembre' },
    { valor: 12, viewValue: 'Diciembre' }
  ];
  mesSeleccionado = this.meses[this.fecha.getMonth()].valor;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private comunicacion: ComunicacionService,
    private _servicioMovimiento: MovimientoService) {
  }

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  ngAfterViewInit(): void {
    this.movimientos.paginator = this.paginator;
    this.movimientos.sort = this.sort;
  }

  crearIngreso() {
    this.comunicacion.ingreso = true;
    this.comunicacion.egreso = false;
  }

  crearEgreso() {
    this.comunicacion.egreso = true;
    this.comunicacion.ingreso = false;
  }

  comprobarResultados(): void {
    for (const iterator of this.movimientosObj) {
      this.totalIngresos += iterator.total;
    }
  }

  obtenerMovimientos() {
    this._servicioMovimiento.obtenerMovimientos().subscribe(
      result => {
        this.movimientosObj = result;
        this.movimientos.data = this.movimientosObj;
        if (!this.movimientos) {
          alert('No se pudo conectar con fuente de datos.')
        } else {
          this.loading = false;
          this.comprobarResultados();
        }
      }, err => {
        console.log("Error general" + err);
      }
    );
  }

  obtenerIngreso(): void {
    let start = new Date('2021-01-01 00:00:01');
    let end = new Date('2021-01-31 23:59:59');

    this._servicioMovimiento.obtenerIngresos(start, end).subscribe(
      result => {
        this.movimientosObj = result;
        this.movimientos.data = this.movimientosObj;
      });
  }

  eliminarMovimiento(movimiento: Movimiento): void {
    if (confirm("¿Desea eliminar el movimiento?")) {
      console.info("Se desea eliminar: " + movimiento);
    }
  }

}
