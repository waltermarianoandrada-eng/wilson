import React, { createContext, useContext, useState, useEffect } from 'react';
import { jugadorService } from '../services/jugadorService';
import { pagoService } from '../services/pagoService';
import { MONTOS_CUOTA, CATEGORIAS } from '../config/constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [jugadores, setJugadores] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState('A');
  const [mesActual, setMesActual] = useState('Mayo');
  const [anioActual, setAnioActual] = useState(2026);
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('APP_CONFIG_USER');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return { 
        montosCuota: parsed.montosCuota || MONTOS_CUOTA,
        categorias: parsed.categorias || CATEGORIAS
      };
    }
    return { montosCuota: MONTOS_CUOTA, categorias: CATEGORIAS };
  });

  const loadData = () => {
    setLoading(true);
    const j = jugadorService.getAll();
    const p = pagoService.getAll();
    setJugadores(j);
    setPagos(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const registrarPago = (pago) => {
    pagoService.registrarPago(pago);
    loadData();
    alert("¡Pago registrado con éxito!");
  };

  const eliminarPago = (id) => {
    pagoService.eliminarPago(id);
    loadData();
    alert("¡Pago anulado con éxito!");
  };

  const agregarSocio = (socio) => {
    jugadorService.create(socio);
    loadData();
  };

  const editarSocio = (id, socioData) => {
    jugadorService.update(id, socioData);
    loadData();
  };

  const eliminarSocio = (id) => {
    jugadorService.remove(id);
    loadData();
  };

  const importarSocios = (sociosData) => {
    const agregados = jugadorService.importarVarios(sociosData);
    loadData();
    return agregados;
  };

  const updateConfig = (newConfig) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('APP_CONFIG_USER', JSON.stringify(updated));
    alert("¡Configuración guardada correctamente!");
  };

  const value = {
    jugadores,
    pagos,
    categoriaActual,
    setCategoriaActual,
    mesActual,
    setMesActual,
    anioActual,
    setAnioActual,
    loading,
    registrarPago,
    eliminarPago,
    agregarSocio,
    editarSocio,
    eliminarSocio,
    importarSocios,
    refresh: loadData,
    config,
    updateConfig
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
};
