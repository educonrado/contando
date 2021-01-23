import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Movimiento } from '../model/movimiento';
import { ComunicacionService } from '../services/comunicacion.service';
import { MovimientoService } from '../services/movimiento.service';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.css']
})
export class MovimientoComponent implements OnInit {

  iva: number = 12;
  ingreso: boolean;
  egreso: boolean;
  formularioRegistro: FormGroup;
  movimiento: Movimiento = new Movimiento();
  ivaCalculado: number;
  totalCalculado: number;

  constructor(private formBuilder: FormBuilder,
    private comunicacion: ComunicacionService,
    private _servicioMovimiento: MovimientoService,
    private _router: Router) {
    this.ingreso = this.comunicacion.ingreso;
    this.egreso = this.comunicacion.egreso;
  }

  ngOnInit(): void {
    this.formularioRegistro = this.formBuilder.group({
      tipo: [''],
      fecha: new FormControl(new Date()),
      nroComprobante: ['', Validators.required],
      ruc: ['', Validators.required],
      clienteProveedor: ['', Validators.required],
      concepto: ['', Validators.required],
      subtotal: ['', Validators.required],
      iva: [''],
      total: [''],
      retencionIVA: ['0'],
      retencionIR: ['0']
    });

    
  }

  onSubmit() {
    if (this.formularioRegistro.valid) {
      this.formularioRegistro.value.tipo = this.ingreso ? 'Ingreso' : 'Egreso';
      this.movimiento = this.formularioRegistro.value;
      let response = this._servicioMovimiento.crearMovimiento(this.movimiento);
      response.then(e => {
        console.log("Redirigiendo");
        this._router.navigate(['/dashboard']);
      }).catch(c => {
        console.log("No se pudo guardar la información");
      });

    } else {
      console.log('Algo va mal');
      return;
    }
  }

  calcularValores($event) {
    this.ivaCalculado = this.formularioRegistro.get('subtotal').value * this.iva / 100;
    this.totalCalculado = this.formularioRegistro.get('subtotal').value + this.ivaCalculado;
    this.formularioRegistro.patchValue({
      total: this.roundTo(this.totalCalculado, 2),
      iva: this.roundTo(this.ivaCalculado, 2)
    });
  }

  roundTo(value: number, places: number) {
    var power = Math.pow(10, places);
    return Math.round(value * power) / power;
  }

  recalcularTotal($event) {
    this.totalCalculado = this.formularioRegistro.get('subtotal').value + this.formularioRegistro.get('iva').value;
    this.formularioRegistro.patchValue({
      total: this.roundTo(this.totalCalculado, 2)
    });
  }


}
