
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const useReportExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async (data: any, reportType: string) => {
    setExporting(true);
    try {
      // Создаем HTML-контент для PDF
      const htmlContent = generateHTMLReport(data, reportType);
      
      // Используем браузерный API для печати в PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Небольшая задержка перед печатью
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
      
      toast.success('PDF отчет готов к скачиванию');
    } catch (error) {
      console.error('Ошибка экспорта в PDF:', error);
      toast.error('Не удалось экспортировать в PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async (data: any[], reportType: string) => {
    setExporting(true);
    try {
      // Конвертируем данные в CSV формат
      const csvContent = generateCSV(data, reportType);
      
      // Создаем и скачиваем файл
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${reportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Excel отчет скачан');
    } catch (error) {
      console.error('Ошибка экспорта в Excel:', error);
      toast.error('Не удалось экспортировать в Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = async (data: any, reportType: string) => {
    setExporting(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${reportType}_${format(new Date(), 'yyyy-MM-dd')}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('JSON отчет скачан');
    } catch (error) {
      console.error('Ошибка экспорта в JSON:', error);
      toast.error('Не удалось экспортировать в JSON');
    } finally {
      setExporting(false);
    }
  };

  return {
    exporting,
    exportToPDF,
    exportToExcel,
    exportToJSON
  };
};

const generateHTMLReport = (data: any, reportType: string): string => {
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: ru });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Отчет YTime - ${reportType}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4A90E2; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #4A90E2; margin-bottom: 10px; }
        .date { font-size: 14px; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #4A90E2; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .metric-label { font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">YTime Health Analytics</div>
        <div class="date">Отчет сгенерирован: ${currentDate}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Основные показатели</div>
        <div class="metrics-grid">
          ${generateMetricsHTML(data)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Детальные данные</div>
        ${generateTableHTML(data)}
      </div>
      
      <div class="footer">
        <p>Отчет создан платформой YTime - Персонализированное здоровье для женщин</p>
      </div>
    </body>
    </html>
  `;
};

const generateMetricsHTML = (data: any): string => {
  if (data.metrics) {
    return `
      <div class="metric-card">
        <div class="metric-value">${data.metrics.avgSteps?.toLocaleString() || 0}</div>
        <div class="metric-label">Средние шаги/день</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${data.metrics.avgHeartRate || 0}</div>
        <div class="metric-label">Средний пульс</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${data.metrics.avgSleepHours || 0}ч</div>
        <div class="metric-label">Средний сон</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${data.metrics.consistencyScore || 0}%</div>
        <div class="metric-label">Постоянство</div>
      </div>
    `;
  }
  return '<p>Нет данных для отображения</p>';
};

const generateTableHTML = (data: any): string => {
  if (data.data && Array.isArray(data.data)) {
    const headers = Object.keys(data.data[0] || {});
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = data.data.map(row => 
      `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
    ).join('');
    
    return `
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table>
    `;
  }
  return '<p>Нет данных для отображения</p>';
};

const generateCSV = (data: any[], reportType: string): string => {
  if (!Array.isArray(data) || data.length === 0) {
    return 'Нет данных для экспорта';
  }

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Экранируем запятые и кавычки
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};
