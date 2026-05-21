import React, { useState } from 'react';
import { CheckCircle2, Trash2, Filter, FileText, Edit2, UserMinus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reportService } from '../services/reportService';

const PaymentTable = ({ onEditSocio }) => {
  const { 
    jugadores, 
    pagos, 
    registrarPago, 
    eliminarPago, 
    eliminarSocio, 
    categoriaActual, 
    setCategoriaActual, 
    config, 
    mesActual, 
    anioActual 
  } = useApp();

  const MONTOS_CUOTA = config.montosCuota;
  const [filtro, setFiltro] = useState('Todos');

  const getEstadoJugador = (jugadorId) => {
    return pagos.find(p => p.jugadorId === jugadorId && p.mes === mesActual && Number(p.anio) === Number(anioActual));
  };

  const handlePagar = (jugador) => {
    const randomRecibo = `REC ${Math.floor(8000 + Math.random() * 500)}`;
    const montoCuota = MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT;
    
    if (confirm(`¿Confirmar pago de ${jugador.apellido} por $${montoCuota.toLocaleString()}? (Periodo: ${mesActual} ${anioActual}, Recibo: ${randomRecibo})`)) {
      registrarPago({
        jugadorId: jugador.id,
        mes: mesActual,
        anio: anioActual,
        monto: montoCuota,
        recibo: randomRecibo,
        pendientes: []
      });
    }
  };

  const handleEliminarPago = (pagoId, jugador) => {
    if (confirm(`¿Seguro que deseas anular el pago de ${jugador.apellido} para ${mesActual} ${anioActual}?`)) {
      eliminarPago(pagoId);
    }
  };

  const handleEliminarSocio = (jugador) => {
    if (confirm(`¿Seguro que deseas eliminar al socio ${jugador.apellido} ${jugador.nombre}? Esta acción no se puede deshacer.`)) {
      eliminarSocio(jugador.id);
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
    reportService.generarReporteCaja(jugadores, pagos, mesActual, anioActual, categoriaActual);
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
            {config.categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <span className="text-zinc-400 text-xs">({mesActual} {anioActual})</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 text-xs font-bold transition-colors border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-lg bg-white dark:bg-zinc-950 shadow-sm cursor-pointer"
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
              <th className="px-4 py-3 text-center">Estado</th>
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
                    <div className="flex justify-between items-center group">
                      <span>{jugador.apellido} {jugador.nombre}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        <button 
                          onClick={() => onEditSocio(jugador)} 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 cursor-pointer" 
                          title="Editar Socio"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleEliminarSocio(jugador)} 
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 cursor-pointer" 
                          title="Eliminar Socio"
                        >
                          <UserMinus size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">{jugador.dni}</td>
                  <td className="px-4 py-3 text-center">
                    {pago ? (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        Al día
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        Deudor
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {(MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {pago ? pago.fecha : '-'}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {pago ? pago.recibo : '-'}
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
                      <button 
                        onClick={() => handleEliminarPago(pago.id, jugador)}
                        className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                        title="Anular Pago"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePagar(jugador)}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all transform active:scale-95 cursor-pointer"
                      >
                        Marcar Pago
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredJugadores.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-zinc-500 py-8 text-sm">
                  No se encontraron socios en esta categoría con el filtro seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista para Móvil (Tarjetas) */}
      <div className="md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {filteredJugadores.map((jugador) => {
          const pago = getEstadoJugador(jugador.id);
          return (
            <div key={jugador.id} className={`p-4 ${pago ? 'bg-green-50/20 dark:bg-green-900/5' : 'bg-white dark:bg-zinc-900'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${pago ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                    {jugador.socioNr}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-zinc-900 dark:text-white uppercase">{jugador.apellido} {jugador.nombre}</p>
                      <button 
                        onClick={() => onEditSocio(jugador)} 
                        className="text-blue-600 dark:text-blue-400 p-0.5 cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleEliminarSocio(jugador)} 
                        className="text-red-600 dark:text-red-400 p-0.5 cursor-pointer"
                      >
                        <UserMinus size={12} />
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono">DNI: {jugador.dni} | FN: {jugador.fn}</p>
                  </div>
                </div>
                <div>
                  {pago ? (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                      Al día
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                      Deudor
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg mt-2">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Cuota {mesActual}</p>
                  <p className="font-black text-sm text-red-600">${(MONTOS_CUOTA[jugador.categoria] || MONTOS_CUOTA.DEFAULT).toLocaleString()}</p>
                </div>
                {pago ? (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase">Recibo</p>
                      <p className="font-bold text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">{pago.recibo}</p>
                    </div>
                    <button 
                      onClick={() => handleEliminarPago(pago.id, jugador)}
                      className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1 cursor-pointer"
                      title="Anular Pago"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePagar(jugador)}
                    className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg active:scale-95 cursor-pointer"
                  >
                    Pagar Ahora
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filteredJugadores.length === 0 && (
          <p className="text-center text-zinc-500 py-8 text-sm">
            No se encontraron socios en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;
