import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PaymentTable from './components/PaymentTable';
import Summary from './components/Summary';
import SocioForm from './components/SocioForm';
import { AppProvider } from './context/AppContext';
import { Bell, LogOut, Settings, BarChart3, Layers, Wallet } from 'lucide-react';

// Componentes de Vistas Simples
const CategoriesView = () => (
  <div className="card p-8 text-center space-y-4">
    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
      <Layers size={32} />
    </div>
    <h2 className="text-xl font-bold">Gestión de Categorías</h2>
    <p className="text-zinc-500">Aquí podrás gestionar las categorías (A, B, Infantil, etc.)</p>
    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
      <div className="p-4 border rounded-xl font-bold">Categoría A</div>
      <div className="p-4 border rounded-xl font-bold">Categoría B</div>
    </div>
  </div>
);

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

const ConfigView = () => (
  <div className="card p-8 text-center space-y-4">
    <div className="w-16 h-16 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center mx-auto">
      <Settings size={32} />
    </div>
    <h2 className="text-xl font-bold">Configuración</h2>
    <p className="text-zinc-500">Ajustes del sistema y montos de cuota</p>
    <div className="space-y-4 max-w-xs mx-auto">
      <div className="text-left">
        <label className="text-xs font-bold text-zinc-400">VALOR CUOTA CATEGORÍA A</label>
        <input type="text" className="w-full p-2 border rounded mt-1" defaultValue="$8,000" />
      </div>
      <button className="w-full bg-zinc-900 text-white p-2 rounded-lg font-bold">Guardar Cambios</button>
    </div>
  </div>
);

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
