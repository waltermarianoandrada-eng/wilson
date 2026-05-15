import React from 'react';
import { useApp } from '../context/AppContext';

const Summary = () => {
  const { pagos, categoriaActual, jugadores } = useApp();

  const totalMayo = pagos
    .filter(p => {
      const jugador = jugadores.find(j => j.id === p.jugadorId);
      return p.mes === "Mayo" && jugador?.categoria === categoriaActual;
    })
    .reduce((acc, curr) => acc + curr.monto, 0);

  const countMayo = pagos
    .filter(p => {
      const jugador = jugadores.find(j => j.id === p.jugadorId);
      return p.mes === "Mayo" && jugador?.categoria === categoriaActual;
    }).length;

  const totalAbril = pagos
    .filter(p => p.pendientes.includes("Abril"))
    .length * 8000; // Simulación según planilla

  const totalGeneral = totalMayo + totalAbril;

  return (
    <div className="flex justify-end mt-6">
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl w-80 shadow-lg">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Pagan {countMayo} Jugadores Mayo ({categoriaActual}):</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white">
              ${totalMayo.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>+ 1 Cta Abril Contreras Samuel:</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white">
              $8,000
            </span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-end">
            <span className="text-zinc-400 text-[10px] font-bold uppercase">=</span>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Total Recaudado</p>
              <p className="text-2xl font-black text-red-600 font-mono">
                ${(totalGeneral + 8000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
