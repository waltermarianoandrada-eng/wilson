/**
 * @file errors.js
 * @description Gestión centralizada de excepciones.
 */

/**
 * Clase base para errores personalizados de la aplicación.
 */
export class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Manejador global de excepciones para envolver funciones asíncronas o de lógica.
 * @param {Function} fn - Función a ejecutar.
 * @returns {any} Resultado de la función o lanza AppError.
 */
export const handleError = (fn) => {
  try {
    return fn();
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`[${error.code}]: ${error.message}`);
      throw error;
    }
    console.error('[UNEXPECTED_ERROR]:', error);
    throw new AppError('Ocurrió un error inesperado en el sistema.', 'UNKNOWN', 500);
  }
};
