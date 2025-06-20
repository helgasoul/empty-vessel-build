
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, ArrowRight, FileText, Download } from "lucide-react";
import { useReportExport } from "@/hooks/useReportExport";
import AIReportDemo from './AIReportDemo';

const DemoSection = () => {
  const [showReport, setShowReport] = useState(false);
  const { exporting, exportToPDF } = useReportExport();

  const generateSamplePDF = async () => {
    const sampleReportData = {
      patientName: "Анна К.",
      patientAge: 35,
      reportDate: "15 июня 2025",
      riskAssessment: {
        breastCancer: { risk: 8, status: "low" },
        diabetes: { risk: 12, status: "low" },
        cardiovascular: { risk: 18, status: "medium" },
        osteoporosis: { risk: 35, status: "attention" }
      },
      recommendations: [
        "Денситометрия костей в течение месяца",
        "Консультация эндокринолога",
        "Анализ витамина D",
        "Кардиотренировки 3 раза в неделю"
      ],
      lifestyle: {
        nutrition: "Хорошо, нужны улучшения",
        activity: "Требует внимания",
        sleep: "Отлично"
      },
      genetics: {
        brca: "Не обнаружено патогенных мутаций",
        apoe: "Тип E3/E4 - повышен риск Альцгеймера",
        fto: "Предрасположенность к набору веса"
      }
    };

    await exportToPDF(sampleReportData, "PREVENT_Sample_Report");
  };

  return (
    <section className="py-16 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Пример анализа</h2>
          <p className="text-lg text-gray-700 mb-8">Посмотрите, как работает наш ИИ</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Интерактивная демонстрация</h3>
              <p className="text-gray-700 mb-6">
                Посмотрите анонимизированный пример анализа рисков для женщины 35 лет
              </p>
              <Dialog open={showReport} onOpenChange={setShowReport}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Посмотреть демо
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span>Демо ИИ-отчета PREVENT</span>
                    </DialogTitle>
                  </DialogHeader>
                  <AIReportDemo />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Пример PDF-отчета</h3>
              <p className="text-gray-700 mb-6">
                Скачайте образец детального отчета в формате PDF
              </p>
              <Button 
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={generateSamplePDF}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Скачать образец PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
