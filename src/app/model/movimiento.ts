export class Movimiento {
    $key?: string;
    tipo: string;
    fecha: Date;
    nroComprobante: string;
    ruc: string;
    clienteProveedor: string;
    concepto: string;
    subtotal: number;
    iva: number;
    total: number;
    retencionIVA: number;
    retencionIR: number;
}
