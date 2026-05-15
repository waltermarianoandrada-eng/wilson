import React, { createContext, useContext, useState, useEffect } from 'react';
import { jugadorService } from '../services/jugadorService';
import { pagoService } from '../services/pagoService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [jugadores, setJugadores] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState('A');
  const [loading, setLoading] = useState(true);

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

  const agregarSocio = (socio) => {
    jugadorService.create(socio);
    loadData();
  };

  const value = {
    jugadores,
    pagos,
    categoriaActual,
    setCategoriaActual,
    loading,
    registrarPago,
    agregarSocio,
    refresh: loadData
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
