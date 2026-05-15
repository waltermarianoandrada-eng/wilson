/**
 * @file storage.js
 * @description Wrapper para interactuar con LocalStorage.
 */

import { AppError } from './errors';

const PREFIX = 'FLAMENGO_FC_';

export const storage = {
  /**
   * Guarda datos en localStorage.
   * @param {string} key - Clave del storage.
   * @param {any} value - Valor a guardar.
   */
  save: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${PREFIX}${key}`, serializedValue);
    } catch (e) {
      throw new AppError('No se pudo guardar en el almacenamiento local.', 'STORAGE_WRITE_ERROR');
    }
  },

  /**
   * Lee datos de localStorage.
   * @param {string} key - Clave del storage.
   * @param {any} defaultValue - Valor por defecto si no existe.
   * @returns {any}
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from storage', e);
      return defaultValue;
    }
  },

  /**
   * Elimina una clave de localStorage.
   * @param {string} key 
   */
  remove: (key) => {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  /**
   * Limpia todo el storage del club.
   */
  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
