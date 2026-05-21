/**
 * @file jugadorService.js
 * @description Lógica de negocio para la gestión de socios (jugadores).
 */

import { storage } from '../core/storage';
import { handleError } from '../core/errors';
import { sanitizeText, isValidDNI } from '../core/security';

const STORAGE_KEY = 'JUGADORES';

/**
 * Datos iniciales extraídos de las planillas físicas.
 */
const SEED_DATA = [
  { id: "363", socioNr: "363", fn: "12/5/1985", apellido: "FERREYRA", nombre: "DARIO EMANUEL", dni: "33277018", categoria: "A" },
  { id: "18", socioNr: "18", fn: "10/1/1989", apellido: "LUNA", nombre: "CRISTIAN DARIO", dni: "32741199", categoria: "A" },
  { id: "20", socioNr: "20", fn: "10/1/1986", apellido: "ARIAS", nombre: "JUAN CARLOS", dni: "34915127", categoria: "A" },
  { id: "3776", socioNr: "3776", fn: "13/7/1988", apellido: "AGUERO", nombre: "MARCOS JAVIER", dni: "34193857", categoria: "A" },
  { id: "3707", socioNr: "3707", fn: "21/7/1980", apellido: "HAYMAL", nombre: "NICOLAS FLORENCIO", dni: "30662088", categoria: "A" },
  { id: "34", socioNr: "34", fn: "16/7/1986", apellido: "AGERO", nombre: "SEBASTIAN", dni: "33261920", categoria: "A" },
  { id: "3657", socioNr: "3657", fn: "24/2/1991", apellido: "LEDISMA NIETO", nombre: "ALEJANDRO", dni: "33471996", categoria: "A" },
  { id: "3662", socioNr: "3662", fn: "27/7/1985", apellido: "DOMINGUEZ", nombre: "YAMIL NAHUEL", dni: "33363024", categoria: "A" },
  { id: "23", socioNr: "23", fn: "22/1/1980", apellido: "LOROSO BRITO", nombre: "MAXIMILIANO", dni: "34961274", categoria: "A" },
  { id: "999", socioNr: "999", fn: "01/01/1990", apellido: "CONTRERAS", nombre: "SAMUEL EDMUNDO", dni: "12345678", categoria: "A" },
  { id: "500", socioNr: "500", fn: "05/05/1995", apellido: "GOMEZ", nombre: "JUAN IGNACIO", dni: "38123456", categoria: "B" },
  { id: "501", socioNr: "501", fn: "10/10/1992", apellido: "PEREZ", nombre: "MATEO", dni: "36789012", categoria: "B" }
];

export const jugadorService = {
  /**
   * Obtiene la lista completa de jugadores.
   * @returns {Array}
   */
  getAll: () => {
    return handleError(() => {
      const data = storage.get(STORAGE_KEY);
      if (!data) {
        storage.save(STORAGE_KEY, SEED_DATA);
        return SEED_DATA;
      }
      return data;
    });
  },

  /**
   * Registra un nuevo socio.
   * @param {Object} data - Datos del socio.
   * @returns {Object} Socio creado.
   */
  create: (data) => {
    return handleError(() => {
      if (!isValidDNI(data.dni)) throw new Error('DNI inválido');
      
      const jugadores = jugadorService.getAll();
      const nuevo = {
        ...data,
        id: data.socioNr || Date.now().toString(),
        apellido: sanitizeText(data.apellido.toUpperCase()),
        nombre: sanitizeText(data.nombre.toUpperCase())
      };
      
      jugadores.push(nuevo);
      storage.save(STORAGE_KEY, jugadores);
      return nuevo;
    });
  },

  /**
   * Elimina un socio por ID.
   * @param {string} id 
   */
  remove: (id) => {
    return handleError(() => {
      const jugadores = jugadorService.getAll().filter(j => j.id !== id);
      storage.save(STORAGE_KEY, jugadores);
    });
  },

  /**
   * Actualiza los datos de un socio.
   * @param {string} id
   * @param {Object} updatedData
   * @returns {Object} Socio actualizado.
   */
  update: (id, updatedData) => {
    return handleError(() => {
      const jugadores = jugadorService.getAll();
      const index = jugadores.findIndex(j => j.id === id);
      if (index === -1) throw new Error('Socio no encontrado');
      
      const actualizado = {
        ...jugadores[index],
        ...updatedData,
        apellido: updatedData.apellido ? sanitizeText(updatedData.apellido.toUpperCase()) : jugadores[index].apellido,
        nombre: updatedData.nombre ? sanitizeText(updatedData.nombre.toUpperCase()) : jugadores[index].nombre,
        dni: updatedData.dni ? String(updatedData.dni) : jugadores[index].dni
      };
      
      if (updatedData.dni && !isValidDNI(updatedData.dni)) throw new Error('DNI inválido');
      
      jugadores[index] = actualizado;
      storage.save(STORAGE_KEY, jugadores);
      return actualizado;
    });
  },


  /**
   * Importa múltiples socios desde un array.
   * @param {Array} sociosData 
   * @returns {number} Cantidad de socios importados.
   */
  importarVarios: (sociosData) => {
    return handleError(() => {
      const jugadores = jugadorService.getAll();
      let agregados = 0;

      sociosData.forEach(data => {
        // Validación básica
        if (!data.apellido || !data.nombre) return;
        
        // Evitar duplicados por DNI (si lo provee) o Socio N°
        const existe = jugadores.find(j => 
          (data.dni && j.dni === String(data.dni)) || 
          (data.socioNr && j.socioNr === String(data.socioNr))
        );

        if (!existe) {
          jugadores.push({
            id: data.socioNr ? String(data.socioNr) : Date.now().toString() + Math.random().toString(36).substr(2, 9),
            socioNr: data.socioNr ? String(data.socioNr) : '',
            fn: data.fn || '',
            apellido: sanitizeText(String(data.apellido).toUpperCase()),
            nombre: sanitizeText(String(data.nombre).toUpperCase()),
            dni: data.dni ? String(data.dni) : '',
            categoria: data.categoria || 'A'
          });
          agregados++;
        }
      });

      storage.save(STORAGE_KEY, jugadores);
      return agregados;
    });
  }
};
