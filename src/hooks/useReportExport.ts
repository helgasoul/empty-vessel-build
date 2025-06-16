
import { useState } from 'react';
import { toast } from 'sonner';

export const useReportExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async (data: any, filename: string) => {
    setExporting(true);
    try {
      // В реальном приложении здесь будет использоваться библиотека типа jsPDF
      const reportData = {
        exportDate: new Date().toISOString(),
        reportType: 'Health Analytics Report',
        ...data
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Отчет экспортирован');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте отчета');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async (data: any[], filename: string) => {
    setExporting(true);
    try {
      // Конвертируем данные в CSV формат
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Данные экспортированы в CSV');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте данных');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = async (data: any, filename: string) => {
    setExporting(true);
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Данные экспортированы в JSON');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Ошибка при экспорте данных');
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
