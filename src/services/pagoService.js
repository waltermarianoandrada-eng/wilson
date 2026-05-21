/**
 * @file pagoService.js
 * @description Lógica de negocio para imputación de pagos y deudas.
 */

import { storage } from '../core/storage';
import { handleError } from '../core/errors';
import { MONTOS_CUOTA } from '../config/constants';

const STORAGE_KEY = 'PAGOS';

/**
 * Pagos iniciales para coincidir con la planilla (Mayo 2026).
 */
const SEED_PAGOS = [
  { id: "p1", jugadorId: "363", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8380", pendientes: [] },
  { id: "p2", jugadorId: "18", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8380", pendientes: [] },
  { id: "p3", jugadorId: "20", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8381", pendientes: [] },
  { id: "p4", jugadorId: "3776", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8382", pendientes: [] },
  { id: "p5", jugadorId: "3707", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8383", pendientes: [] },
  { id: "p6", jugadorId: "34", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8354", pendientes: [] },
  { id: "p7", jugadorId: "3657", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8338", pendientes: ["ABRIL"] },
  { id: "p8", jugadorId: "3662", mes: "Mayo", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8389", pendientes: ["ABRIL"] },
  { id: "p9", jugadorId: "999", mes: "Abril", anio: 2026, monto: 8000, fecha: "14/05/2026", recibo: "REC 8300", pendientes: [] }
];

export const pagoService = {
  /**
   * Obtiene todos los pagos registrados.
   * @returns {Array}
   */
  getAll: () => {
    return handleError(() => {
      const data = storage.get(STORAGE_KEY);
      if (!data) {
        storage.save(STORAGE_KEY, SEED_PAGOS);
        return SEED_PAGOS;
      }
      return data;
    });
  },

  /**
   * Registra un nuevo pago.
   * @param {Object} pagoData 
   * @returns {Object}
   */
  registrarPago: (pagoData) => {
    return handleError(() => {
      const pagos = pagoService.getAll();
      const nuevoPago = {
        ...pagoData,
        id: Date.now().toString(),
        fecha: pagoData.fecha || new Date().toLocaleDateString('es-AR')
      };
      
      pagos.push(nuevoPago);
      storage.save(STORAGE_KEY, pagos);
      return nuevoPago;
    });
  },

  /**
   * Calcula el total recaudado para un mes específico.
   * @param {string} mes 
   * @returns {number}
   */
  getMontoTotalMes: (mes) => {
    const pagos = pagoService.getAll();
    return pagos
      .filter(p => p.mes === mes)
      .reduce((acc, curr) => acc + curr.monto, 0);
  },

  /**
   * Obtiene el estado financiero resumido para un jugador.
   * @param {string} jugadorId 
   * @returns {Object}
   */
  getEstadoJugador: (jugadorId, mesActual = "Mayo") => {
    const pagos = pagoService.getAll();
    const pagoMes = pagos.find(p => p.jugadorId === jugadorId && p.mes === mesActual);
    
    return {
      pagado: !!pagoMes,
      pago: pagoMes || null,
      pendientes: pagoMes?.pendientes || []
    };
  },

  /**
   * Elimina un pago por ID.
   * @param {string} id 
   */
  eliminarPago: (id) => {
    return handleError(() => {
      const pagos = pagoService.getAll().filter(p => p.id !== id);
      storage.save(STORAGE_KEY, pagos);
    });
  }
};

