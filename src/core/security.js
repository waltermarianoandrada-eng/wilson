/**
 * @file security.js
 * @description Funciones de seguridad y validación.
 */

/**
 * Sanitiza una cadena de texto para prevenir XSS básico.
 * @param {string} str - Texto a sanitizar.
 * @returns {string} Texto limpio.
 */
export const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
};

/**
 * Valida si un DNI tiene un formato numérico válido (Argentina: 7-8 dígitos).
 * @param {string|number} dni - DNI a validar.
 * @returns {boolean}
 */
export const isValidDNI = (dni) => {
  const regex = /^\d{7,8}$/;
  return regex.test(String(dni));
};

/**
 * Valida y formatea montos numéricos.
 * @param {any} value - Valor a procesar.
 * @returns {number}
 */
export const parseAmount = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
