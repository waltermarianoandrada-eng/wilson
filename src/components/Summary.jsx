import React from 'react';
import { useApp } from '../context/AppContext';

const Summary = () => {
  const { pagos, categoriaActual, jugadores } = useApp();

  const pagosCategoria = pagos.filter(p => {
    const jugador = jugadores.find(j => j.id === p.jugadorId);
    return jugador?.categoria === categoriaActual && p.mes === "Mayo";
  });

  const totalRecaudado = pagosCategoria.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="flex justify-end mt-6">
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl w-80 shadow-lg">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Pagaron {pagosCategoria.length} Jugadores ({categoriaActual}):</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white">
              ${totalRecaudado.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-end">
            <span className="text-zinc-400 text-[10px] font-bold uppercase">=</span>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Total Recaudado</p>
              <p className="text-2xl font-black text-red-600 font-mono">
                ${totalRecaudado.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
