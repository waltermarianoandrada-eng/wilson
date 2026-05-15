import React from 'react';
import { Home, UserPlus, Layers, ClipboardList, Settings, Database } from 'lucide-react';
import { APP_CONFIG } from '../config/constants';

const Sidebar = ({ currentView, onViewChange, onAddSocio }) => {
  const menuItems = [
    { id: 'Dashboard', icon: <Home size={20} />, label: 'Panel Principal' },
    { id: 'Registro', icon: <UserPlus size={20} />, label: 'Registrar Socio', action: onAddSocio },
    { id: 'Categorías', icon: <Layers size={20} />, label: 'Categorías (A, B)' },
    { id: 'Reportes', icon: <ClipboardList size={20} />, label: 'Reporte Caja' },
    { id: 'Configuración', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  return (
    <div className="w-64 bg-zinc-100 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <img src={APP_CONFIG.LOGO_URL} alt="Logo" className="w-10 h-10" />
        <div>
          <h1 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">Flamengo F.C.</h1>
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">Gestión Financiera</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onViewChange(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id 
                  ? 'bg-white dark:bg-zinc-900 text-red-600 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className={currentView === item.id ? 'text-red-600' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-[10px] font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
          <Database size={12} />
          localStorage: CONECTADO
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
