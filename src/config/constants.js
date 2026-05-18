/**
 * @file constants.js
 * @description Configuración centralizada de constantes del negocio.
 */

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const CATEGORIAS = ["A", "B", "Infantil"];

export const MONTOS_CUOTA = {
  "A": 8000,
  "B": 10000,
  "DEFAULT": 8000
};

export const ESTADO_PAGO = {
  PAGADO: "PAGADO",
  PENDIENTE: "PENDIENTE",
  DEUDA: "DEUDA"
};

export const APP_CONFIG = {
  NOMBRE_CLUB: "Flamengo F.C.",
  LOGO_URL: "/icon-512.png",
  MONEDA: "$",
  MES_ACTUAL: "Mayo"
};
