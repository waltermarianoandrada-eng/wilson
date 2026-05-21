/**
 * @file reportService.js
 * @description Generación de reportes PDF para la caja y socios.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APP_CONFIG } from '../config/constants';

export const reportService = {
  /**
   * Genera un reporte PDF de la caja actual.
   * @param {Array} jugadores - Lista de jugadores.
   * @param {Array} pagos - Lista de pagos.
   * @param {string} mes - Mes del reporte.
   * @param {string} categoria - Categoría del reporte.
   */
  generarReporteCaja: (jugadores, pagos, mes = "Mayo", anio = 2026, categoria = "A") => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setTextColor(211, 14, 20); // Rojo Flamengo
      doc.text(APP_CONFIG.NOMBRE_CLUB, 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`CONTROL DE PAGOS - CATEGORÍA ${categoria} - ${mes.toUpperCase()} ${anio}`, 14, 30);
      
      const tableData = jugadores
        .filter(j => j.categoria === categoria)
        .map(j => {
          const pago = pagos.find(p => p.jugadorId === j.id && p.mes === mes && Number(p.anio) === Number(anio));
          return [
            j.socioNr,
            j.fn,
            `${j.apellido} ${j.nombre}`,
            j.dni,
            pago ? 'PAGADO' : 'DEUDA',
            pago ? `$${pago.monto.toLocaleString()}` : `$0`,
            pago ? pago.fecha : '-',
            pago ? pago.recibo : '-',
            pago?.pendientes.join(', ') || '-'
          ];
        });

      const totalRecaudado = tableData.reduce((acc, curr) => {
        const val = curr[5].replace('$', '').replace(/\./g, '').replace(/,/g, '');
        return acc + (parseFloat(val) || 0);
      }, 0);

      autoTable(doc, {
        startY: 40,
        head: [['Socio N°', 'F.N.', 'Nombre completo', 'D.N.I.', 'Estado', 'Monto', 'Fecha', 'Recibo', 'Pendientes']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [211, 14, 20] },
        styles: { fontSize: 8 },
        columnStyles: {
          4: { halign: 'center' }
        },
        willDrawCell: (data) => {
          if (data.column.index === 4 && data.cell.section === 'body') {
            data.cell.rawStatus = data.cell.text[0];
            data.cell.text = [''];
          }
        },
        didDrawCell: (data) => {
          if (data.column.index === 4 && data.cell.section === 'body') {
            const status = data.cell.rawStatus;
            const cell = data.cell;
            const centerX = cell.x + cell.width / 2;
            const centerY = cell.y + cell.height / 2;
            
            if (status === 'PAGADO') {
              // Draw checkmark ✓
              data.doc.setDrawColor(46, 125, 50); // Green
              data.doc.setLineWidth(1.2);
              data.doc.line(centerX - 3, centerY + 0.5, centerX - 1, centerY + 2.5);
              data.doc.line(centerX - 1, centerY + 2.5, centerX + 3.5, centerY - 2);
            } else if (status === 'DEUDA') {
              // Draw cross ✗
              data.doc.setDrawColor(211, 47, 47); // Red
              data.doc.setLineWidth(1.2);
              data.doc.line(centerX - 2.5, centerY - 2.5, centerX + 2.5, centerY + 2.5);
              data.doc.line(centerX + 2.5, centerY - 2.5, centerX - 2.5, centerY + 2.5);
            }
          }
        }
      });

      const finalY = doc.lastAutoTable.finalY || 40;
      doc.setFontSize(10);
      doc.text(`Total Recaudado: $${totalRecaudado.toLocaleString()}`, 140, finalY + 10);
      doc.text(`Emitido: ${new Date().toLocaleString()}`, 14, finalY + 10);

      doc.save(`Reporte_${categoria}_${mes}_${anio}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("No se pudo generar el PDF. Verifica la consola.");
    }
  }
};
