import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PaymentTable from './components/PaymentTable';
import Summary from './components/Summary';
import SocioForm from './components/SocioForm';
import { AppProvider, useApp } from './context/AppContext';
import { Bell, LogOut, Settings, BarChart3, Layers, Wallet, Trash2 } from 'lucide-react';

// Componentes de Vistas Simples

const CategoriesView = () => {
  const { config, updateConfig } = useApp();
  const [newCat, setNewCat] = React.useState('');

  const handleAdd = () => {
    if (!newCat.trim()) return;
    if (config.categorias.includes(newCat.trim())) {
      alert("La categoría ya existe");
      return;
    }
    const updatedCategorias = [...config.categorias, newCat.trim()];
    const updatedMontos = { ...config.montosCuota, [newCat.trim()]: config.montosCuota.DEFAULT || 8000 };
    updateConfig({ categorias: updatedCategorias, montosCuota: updatedMontos });
    setNewCat('');
  };

  const handleDelete = (cat) => {
    if (confirm(`¿Seguro que deseas eliminar la categoría "${cat}"?`)) {
      const updatedCategorias = config.categorias.filter(c => c !== cat);
      const updatedMontos = { ...config.montosCuota };
      delete updatedMontos[cat];
      updateConfig({ categorias: updatedCategorias, montosCuota: updatedMontos });
    }
  };

  return (
    <div className="card p-8 text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
        <Layers size={32} />
      </div>
      <h2 className="text-xl font-bold">Gestión de Categorías</h2>
      <p className="text-zinc-500">Administra las categorías disponibles en el club</p>
      
      <div className="max-w-md mx-auto space-y-4 text-left">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nueva categoría (ej. Veteranos)" 
            className="flex-1 p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-transform active:scale-95 shadow-lg">
            Agregar
          </button>
        </div>

        <div className="space-y-2 mt-4 max-h-64 overflow-y-auto pr-2">
          {config.categorias.map(cat => (
            <div key={cat} className="flex justify-between items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{cat}</span>
              <button onClick={() => handleDelete(cat)} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {config.categorias.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-4">No hay categorías. Agrega una arriba.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportsView = () => (
  <div className="card p-8 text-center space-y-4">
    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
      <BarChart3 size={32} />
    </div>
    <h2 className="text-xl font-bold">Reportes de Caja</h2>
    <p className="text-zinc-500">Historial de recaudación mensual</p>
    <div className="bg-zinc-50 p-4 rounded-lg text-left">
      <div className="flex justify-between border-b py-2"><span>Mayo 2026</span> <span className="font-bold text-green-600">$152,000</span></div>
      <div className="flex justify-between py-2 text-zinc-400"><span>Abril 2026</span> <span>-</span></div>
    </div>
  </div>
);

const ConfigView = () => {
  const { config, updateConfig } = useApp();
  const [montos, setMontos] = React.useState(config.montosCuota);

  const handleSave = () => {
    updateConfig({ montosCuota: montos });
  };

  return (
    <div className="card p-8 text-center space-y-4">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full flex items-center justify-center mx-auto">
        <Settings size={32} />
      </div>
      <h2 className="text-xl font-bold">Configuración</h2>
      <p className="text-zinc-500">Ajustes del sistema y montos de cuota</p>
      <div className="space-y-4 max-w-xs mx-auto mt-6">
        {Object.keys(montos).filter(k => k !== 'DEFAULT').map(categoria => (
          <div className="text-left" key={categoria}>
            <label className="text-xs font-bold text-zinc-400">VALOR CUOTA CATEGORÍA {categoria}</label>
            <input 
              type="number" 
              className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded mt-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" 
              value={montos[categoria]} 
              onChange={e => setMontos({...montos, [categoria]: Number(e.target.value)})}
            />
          </div>
        ))}
        <button onClick={handleSave} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded-lg font-bold mt-4 transition-transform active:scale-95">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isSocioFormOpen, setIsSocioFormOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'Categorías': return <CategoriesView />;
      case 'Reportes': return <ReportsView />;
      case 'Configuración': return <ConfigView />;
      default: return (
        <>
          <PaymentTable />
          <Summary />
        </>
      );
    }
  };

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onAddSocio={() => setIsSocioFormOpen(true)} 
        />
        
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-zinc-900 text-white">
            <h2 className="text-lg font-bold tracking-tight uppercase">
              {currentView === 'Dashboard' ? 'Gestión Interna - Flamengo F.C.' : currentView}
            </h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-zinc-900"></span>
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </header>

          <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderView()}
            </div>
          </div>
        </main>

        <SocioForm isOpen={isSocioFormOpen} onClose={() => setIsSocioFormOpen(false)} />
      </div>
    </AppProvider>
  );
}

export default App;
