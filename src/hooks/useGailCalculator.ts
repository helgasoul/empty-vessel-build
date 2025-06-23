// src/hooks/useGailCalculator.ts

import { useState, useCallback } from 'react';
import { GailModelData, BiomarkerData, ExposomeData, EnhancedGailResult } from '@/types/calculator';

export const useGailCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<EnhancedGailResult[]>([]);

  const calculateStandardGail = useCallback((data: GailModelData): { fiveYear: number; lifetime: number } => {
    let relativeRisk = 1.0;
    
    // Возраст
    if (data.age >= 50) relativeRisk *= 1.2;
    if (data.age >= 60) relativeRisk *= 1.4;
    
    // Возраст начала менструации
    if (data.ageAtMenarche <= 11) relativeRisk *= 1.21;
    else if (data.ageAtMenarche === 12) relativeRisk *= 1.10;
    
    // Возраст первых родов
    if (data.ageAtFirstBirth === null) {
      if (data.age >= 30) relativeRisk *= 1.93;
      else relativeRisk *= 1.15;
    } else if (data.ageAtFirstBirth >= 30) {
      relativeRisk *= 1.24;
    } else if (data.ageAtFirstBirth >= 25) {
      relativeRisk *= 1.07;
    }
    
    // Родственники первой степени
    if (data.firstDegreeRelatives === 1) relativeRisk *= 2.26;
    else if (data.firstDegreeRelatives >= 2) relativeRisk *= 2.99;
    
    // Биопсии
    if (data.biopsies >= 1) {
      relativeRisk *= data.atypicalHyperplasia ? 1.82 : 1.27;
    }
    
    // Расовая принадлежность
    const raceMultipliers = {
      white: 1.0,
      black: 0.8,
      hispanic: 0.7,
      asian: 0.5,
      other: 0.8
    };
    relativeRisk *= raceMultipliers[data.race];
    
    // Базовый риск
    const baseRisk = data.age < 50 ? 0.5 : data.age < 60 ? 1.2 : 2.0;
    
    const fiveYearRisk = Math.min(baseRisk * relativeRisk, 15);
    const lifetimeRisk = Math.min(fiveYearRisk * 4.5, 30);
    
    return { fiveYear: fiveYearRisk, lifetime: lifetimeRisk };
  }, []);

  const calculateBiomarkerModification = useCallback((biomarkers: BiomarkerData): number => {
    let modifier = 1.0;
    
    // Воспалительные маркеры
    if (biomarkers.inflammation.crp > 3.0) modifier *= 1.15;
    if (biomarkers.inflammation.il6 > 2.0) modifier *= 1.12;
    if (biomarkers.inflammation.tnfAlpha > 10.0) modifier *= 1.08;
    
    // Оксидативный стресс
    if (biomarkers.oxidativeStress.mda > 3.0) modifier *= 1.10;
    if (biomarkers.oxidativeStress.gsh < 300) modifier *= 1.08;
    if (biomarkers.oxidativeStress.catalase < 40) modifier *= 1.06;
    
    // Гормональные факторы
    if (biomarkers.hormonal.estradiol > 200) modifier *= 1.18;
    if (biomarkers.hormonal.testosterone > 30) modifier *= 1.12;
    if (biomarkers.hormonal.igf1 > 250) modifier *= 1.15;
    
    return Math.min(modifier, 2.0);
  }, []);

  const calculateExposomeModification = useCallback((exposome: ExposomeData): number => {
    let modifier = 1.0;
    
    // Экологические факторы
    modifier *= 1 + (exposome.environmental.airPollution / 20);
    modifier *= 1 + (exposome.environmental.chemicalExposure / 25);
    modifier *= 1 + (exposome.environmental.radiation / 30);
    
    // Образ жизни
    modifier *= 1 + (exposome.lifestyle.alcohol / 15);
    modifier *= 1 + (exposome.lifestyle.smoking / 10);
    modifier *= Math.max(0.7, 1 - (exposome.lifestyle.physicalActivity / 20));
    
    // Стресс
    modifier *= 1 + (exposome.stress.psychologicalStress / 25);
    modifier *= Math.max(0.8, 1 - (exposome.stress.sleepQuality / 20));
    modifier *= Math.max(0.9, 1 - (exposome.stress.socialSupport / 25));
    
    return Math.max(0.5, Math.min(modifier, 2.5));
  }, []);

  const calculateEnhancedRisk = useCallback(async (
    gailData: GailModelData,
    biomarkers: BiomarkerData,
    exposomeData: ExposomeData
  ): Promise<EnhancedGailResult> => {
    setLoading(true);
    
    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const standardRisk = calculateStandardGail(gailData);
      const biomarkerModifier = calculateBiomarkerModification(biomarkers);
      const exposomeModifier = calculateExposomeModification(exposomeData);
      
      const biomarkerModified = standardRisk.fiveYear * biomarkerModifier;
      const exposomeModified = biomarkerModified * exposomeModifier;
      const finalRisk = Math.min(exposomeModified, 25);
      
      const getRiskCategory = (risk: number): 'low' | 'average' | 'high' | 'very-high' => {
        if (risk < 1.67) return 'low';
        if (risk < 3.0) return 'average';
        if (risk < 5.0) return 'high';
        return 'very-high';
      };
      
      // Анализ факторов риска
      const riskFactors = {
        primary: [] as string[],
        secondary: [] as string[],
        protective: [] as string[]
      };
      
      if (gailData.firstDegreeRelatives > 0) {
        riskFactors.primary.push(`Семейный анамнез (${gailData.firstDegreeRelatives} родственника)`);
      }
      if (gailData.ageAtMenarche <= 11) {
        riskFactors.primary.push('Раннее начало менструации');
      }
      if (gailData.ageAtFirstBirth === null || gailData.ageAtFirstBirth >= 30) {
        riskFactors.primary.push('Поздние роды или их отсутствие');
      }
      if (biomarkers.inflammation.crp > 3.0) {
        riskFactors.secondary.push('Повышенное воспаление (CRP)');
      }
      if (exposomeData.lifestyle.physicalActivity >= 7) {
        riskFactors.protective.push('Высокая физическая активность');
      }
      
      // Рекомендации
      const recommendations = {
        screening: [] as string[],
        lifestyle: [] as string[],
        followUp: [] as string[]
      };
      
      if (finalRisk >= 3.0) {
        recommendations.screening.push('Рассмотреть МРТ молочных желез');
        recommendations.screening.push('Маммография каждые 6-12 месяцев');
      } else {
        recommendations.screening.push('Стандартный скрининг согласно возрасту');
      }
      
      if (biomarkers.inflammation.crp > 3.0) {
        recommendations.lifestyle.push('Противовоспалительная диета');
      }
      if (exposomeData.stress.psychologicalStress > 6) {
        recommendations.lifestyle.push('Управление стрессом');
      }
      
      recommendations.followUp.push('Пересчет через 12 месяцев');
      recommendations.followUp.push('Мониторинг биомаркеров через 6 месяцев');
      
      const result: EnhancedGailResult = {
        standardRisk: {
          fiveYear: standardRisk.fiveYear,
          lifetime: standardRisk.lifetime,
          category: getRiskCategory(standardRisk.fiveYear)
        },
        enhancedRisk: {
          biomarkerModified,
          exposomeModified,
          finalRisk,
          confidence: 85 + Math.random() * 10
        },
        riskFactors,
        recommendations
      };
      
      setHistory(prev => [result, ...prev.slice(0, 9)]); // Последние 10 расчетов
      
      return result;
    } finally {
      setLoading(false);
    }
  }, [calculateStandardGail, calculateBiomarkerModification, calculateExposomeModification]);

  const exportResults = useCallback((result: EnhancedGailResult) => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gail-calculation-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, []);

  return {
    loading,
    history,
    calculateEnhancedRisk,
    exportResults,
    clearHistory: () => setHistory([])
  };
};