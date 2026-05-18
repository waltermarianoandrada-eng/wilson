import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const SocioForm = ({ isOpen, onClose }) => {
  const { agregarSocio, importarSocios, config } = useApp();
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    socioNr: '',
    apellido: '',
    nombre: '',
    dni: '',
    fn: '',
    categoria: config.categorias[0] || 'A'
  });

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const mappedData = data.map(row => {
          // Buscar en diferentes variantes de nombres de columnas (ignorando mayúsculas)
          const findCol = (keys) => {
            const foundKey = Object.keys(row).find(k => keys.includes(k.toUpperCase().trim()));
            return foundKey ? row[foundKey] : '';
          };

          const rawSocio = findCol(['SOCIO', 'SOCIO N°', 'SOCIO NO', 'SOCIONR']);
          const rawDni = findCol(['D.N.I.', 'D.N.I. N°', 'DNI', 'DOCUMENTO']);
          const rawFn = findCol(['FN', 'F.N.', 'F. NACIMIENTO', 'FECHA NACIMIENTO']);
          const rawCategoria = findCol(['CATEGORIA', 'CATEGORÍA']) || config.categorias[0] || 'A';
          
          let apellido = findCol(['APELLIDO']);
          let nombre = findCol(['NOMBRE']);
          const nombreCompleto = findCol(['APELLIDO Y NOMBRE', 'NOMBRE Y APELLIDO', 'NOMBRE COMPLETO']);

          if (nombreCompleto && !apellido && !nombre) {
            const partes = nombreCompleto.trim().split(' ');
            if (partes.length > 1) {
              apellido = partes[0]; 
              nombre = partes.slice(1).join(' '); 
            } else {
              apellido = nombreCompleto;
            }
          }

          return {
            socioNr: rawSocio,
            apellido: apellido,
            nombre: nombre,
            dni: rawDni,
            fn: rawFn,
            categoria: rawCategoria
          };
        });

        const agregados = importarSocios(mappedData);
        alert(`¡Se importaron ${agregados} socios exitosamente!`);
        onClose();
      } catch (error) {
        alert("Error procesando el archivo: " + error.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      agregarSocio(formData);
      alert("Socio agregado correctamente");
      setFormData({ socioNr: '', apellido: '', nombre: '', dni: '', fn: '', categoria: config.categorias[0] || 'A' });
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
              <UserPlus size={20} />
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Nuevo Socio</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Socio N°</label>
              <input
                required
                type="text"
                value={formData.socioNr}
                onChange={(e) => setFormData({...formData, socioNr: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
                placeholder="Ex: 1024"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">D.N.I.</label>
              <input
                required
                type="text"
                value={formData.dni}
                onChange={(e) => setFormData({...formData, dni: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
                placeholder="Sin puntos"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Apellido</label>
            <input
              required
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Nombre</label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">F. Nacimiento</label>
              <input
                required
                type="text"
                value={formData.fn}
                onChange={(e) => setFormData({...formData, fn: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
                placeholder="DD/MM/AAAA"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-zinc-900 dark:text-white"
              >
                {config.categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all active:scale-95"
            >
              Guardar Socio
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">¿Tienes una lista armada?</p>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <Upload size={18} className="text-blue-600 dark:text-blue-400" />
              Importar Excel (.xlsx)
            </button>
            <p className="text-[10px] text-zinc-400 mt-2">
              Columnas sugeridas: Socio N°, Apellido, Nombre, DNI, FN, Categoría
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocioForm;
