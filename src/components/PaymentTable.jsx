import React, { useState } from 'react';
import { CheckCircle2, Trash2, Filter, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIAS } from '../config/constants';
import { reportService } from '../services/reportService';

const PaymentTable = () => {
  const { jugadores, pagos, registrarPago, categoriaActual, setCategoriaActual, config } = useApp();
  const MONTOS_CUOTA = config.montosCuota;
  const [filtro, setFiltro] = useState('Todos');

  const getEstadoJugador = (jugadorId) => {
    return pagos.find(p => p.jugadorId === jugadorId && p.mes === "Mayo");
  };

  const handlePagar = (jugador) => {
    const randomRecibo = `REC ${Math.floor(8000 + Math.random() * 500)}`;
    
    if (confirm(`¿Confirmar pago de ${jugador.apellido} por $${(MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT).toLocaleString()}? (Recibo: ${randomRecibo})`)) {
      registrarPago({
        jugadorId: jugador.id,
        mes: "Mayo",
        anio: 2026,
        monto: MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT,
        recibo: randomRecibo,
        pendientes: []
      });
    }
  };

  const filteredJugadores = jugadores.filter(j => {
    if (j.categoria !== categoriaActual) return false;
    const pago = getEstadoJugador(j.id);
    if (filtro === 'Al día') return !!pago;
    if (filtro === 'Morosos') return !pago;
    return true;
  });

  const handleExportPDF = () => {
    reportService.generarReporteCaja(jugadores, pagos, "Mayo", categoriaActual);
  };

  return (
    <div className="card w-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-sm">
            Control de Pagos - Categoría
          </h2>
          <select 
            value={categoriaActual}
            onChange={(e) => setCategoriaActual(e.target.value)}
            className="bg-red-600 text-white text-xs font-bold focus:outline-none border-none rounded px-3 py-1 shadow-sm"
          >
            {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <span className="text-zinc-400 text-xs">(Mayo 2026)</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 text-xs font-bold transition-colors border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg bg-white dark:bg-zinc-950 shadow-sm"
          >
            <FileText size={14} />
            Exportar PDF
          </button>
          <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-400" />
            <select 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1"
            >
              <option>Todos</option>
              <option>Al día</option>
              <option>Morosos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vista para Escritorio (Tabla) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase text-zinc-500 font-bold border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-center">Socio N°</th>
              <th className="px-4 py-3">F.N.</th>
              <th className="px-4 py-3">Apellido y Nombre</th>
              <th className="px-4 py-3">D.N.I.</th>
              <th className="px-4 py-3">Importe ($)</th>
              <th className="px-4 py-3">Fecha Pago</th>
              <th className="px-4 py-3">N° Recibo</th>
              <th className="px-4 py-3">Pendientes</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredJugadores.map((jugador) => {
              const pago = getEstadoJugador(jugador.id);
              return (
                <tr key={jugador.id} className={`text-sm ${pago ? 'bg-green-50/30 dark:bg-green-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                  <td className="px-4 py-3 text-center font-medium">
                    <div className="flex items-center gap-2 justify-center">
                      {pago ? <CheckCircle2 size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 border border-zinc-300 rounded" />}
                      {jugador.socioNr}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{jugador.fn}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                    {jugador.apellido} {jugador.nombre}
                  </td>
                  <td className="px-4 py-3 font-mono">{jugador.dni}</td>
                  <td className="px-4 py-3 font-bold">
                    {(MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {pago ? pago.fecha : <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700" />}
                  </td>
                  <td className="px-4 py-3">
                    {pago ? (
                      <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {pago.recibo}
                      </span>
                    ) : (
                      <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {pago?.pendientes.map((p, i) => (
                        <span key={i} className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {pago ? (
                      <button className="text-zinc-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePagar(jugador)}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all transform active:scale-95"
                      >
                        Marcar Pago
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista para Móvil (Tarjetas) */}
      <div className="md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {filteredJugadores.map((jugador) => {
          const pago = getEstadoJugador(jugador.id);
          return (
            <div key={jugador.id} className={`p-4 ${pago ? 'bg-green-50/20' : 'bg-white dark:bg-zinc-900'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${pago ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {jugador.socioNr}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white uppercase">{jugador.apellido} {jugador.nombre}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">DNI: {jugador.dni} | FN: {jugador.fn}</p>
                  </div>
                </div>
                {pago && <CheckCircle2 size={18} className="text-green-600" />}
              </div>
              
              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Cuota Mayo</p>
                  <p className="font-black text-sm text-red-600">${(MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT).toLocaleString()}</p>
                </div>
                {pago ? (
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Recibo</p>
                    <p className="font-bold text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">{pago.recibo}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePagar(jugador)}
                    className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg active:scale-95"
                  >
                    Pagar Ahora
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentTable;
