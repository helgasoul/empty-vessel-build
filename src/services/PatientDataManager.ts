import { PatientProfile, LabResult, AIRecommendation, HealthAssessment, RiskFactors, EnvironmentalHealth, FamilyHistory, CalculatedIndex } from '../types/patient';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export class PatientDataManager {
  private patientData: PatientProfile | null = null;
  private userId: string | null = null;

  constructor(userId?: string) {
    this.userId = userId || null;
  }

  // Загрузка полного профиля пациента
  async loadPatientData(patientId: string): Promise<PatientProfile> {
    try {
      this.userId = patientId;
      
      // Параллельная загрузка всех данных
      const [
        personalInfo,
        healthAssessment,
        riskFactors,
        environmentalHealth,
        labResults,
        medicalHistory,
        familyHistory,
        aiRecommendations,
        doctorNotes,
        preferences
      ] = await Promise.all([
        this.loadPersonalInfo(patientId),
        this.loadHealthAssessment(patientId),
        this.loadRiskFactors(patientId),
        this.loadEnvironmentalHealth(patientId),
        this.loadLabResults(patientId),
        this.loadMedicalHistory(patientId),
        this.loadFamilyHistory(patientId),
        this.loadAIRecommendations(patientId),
        this.loadDoctorNotes(patientId),
        this.loadPreferences(patientId)
      ]);

      this.patientData = {
        id: patientId,
        personalInfo,
        healthAssessment,
        riskFactors,
        environmentalHealth,
        labResults,
        medicalHistory,
        familyHistory,
        aiRecommendations,
        doctorNotes,
        preferences,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return this.patientData;
    } catch (error) {
      console.error('Error loading patient data:', error);
      throw new Error('Не удалось загрузить данные пациента');
    }
  }

  // Загрузка персональной информации
  private async loadPersonalInfo(patientId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', patientId)
      .single();

    return {
      name: profile?.full_name || 'Пациент',
      dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date(),
      email: profile?.email || '',
      phone: profile?.phone || undefined,
      address: profile?.address ? {
        street: profile.address.street || '',
        city: profile.address.city || '',
        state: profile.address.state || '',
        zipCode: profile.address.zipCode || '',
        country: profile.address.country || ''
      } : undefined,
      emergencyContact: profile?.emergency_contact_name ? {
        name: profile.emergency_contact_name,
        relationship: 'Unknown',
        phone: profile.emergency_contact_phone || ''
      } : undefined,
      insurance: profile?.insurance_info ? {
        provider: profile.insurance_info.provider || '',
        policyNumber: profile.insurance_info.policyNumber || '',
        groupNumber: profile.insurance_info.groupNumber
      } : undefined
    };
  }

  // Загрузка данных о здоровье
  private async loadHealthAssessment(patientId: string): Promise<HealthAssessment> {
    const [symptoms, medications, menstrualData] = await Promise.all([
      this.loadSymptoms(patientId),
      this.loadMedications(patientId),
      this.loadMenstrualHealth(patientId)
    ]);

    return {
      currentSymptoms: symptoms,
      chronicConditions: [],
      allergies: [],
      medications,
      lifestyle: {
        smokingStatus: 'never',
        alcoholConsumption: 'none',
        exerciseFrequency: 'moderate',
        sleepHours: 8,
        stressLevel: 5,
        diet: 'standard'
      },
      menstrualHealth: menstrualData
    };
  }

  private async loadSymptoms(patientId: string) {
    const { data } = await supabase
      .from('symptom_mood_logs')
      .select('*')
      .eq('user_id', patientId)
      .order('log_date', { ascending: false })
      .limit(10);

    return (data || []).map(symptom => ({
      id: symptom.id,
      name: symptom.symptoms?.join(', ') || 'Без симптомов',
      severity: 'moderate' as const,
      duration: '1 день',
      frequency: 'daily' as const,
      firstNoticed: new Date(symptom.log_date)
    }));
  }

  private async loadMedications(patientId: string) {
    // В будущем можно добавить таблицу medications
    return [];
  }

  private async loadMenstrualHealth(patientId: string) {
    const { data } = await supabase
      .from('menstrual_cycles')
      .select('*')
      .eq('user_id', patientId)
      .order('cycle_start_date', { ascending: false })
      .limit(1);

    if (data && data[0]) {
      return {
        cycleLength: data[0].cycle_length || 28,
        periodLength: data[0].period_length || 5,
        lastPeriodDate: new Date(data[0].cycle_start_date),
        irregularities: [],
        symptoms: [],
        contraception: data[0].contraception || undefined
      };
    }

    return undefined;
  }

  // Загрузка факторов риска
  private async loadRiskFactors(patientId: string): Promise<RiskFactors> {
    const { data } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1);

    const defaultRisk = {
      score: 0,
      level: 'low' as const,
      factors: [],
      recommendations: []
    };

    return {
      cardiovascular: defaultRisk,
      cancer: {
        ...defaultRisk,
        types: [],
        geneticFactors: []
      },
      diabetes: {
        ...defaultRisk,
        type: 'type2' as const
      },
      osteoporosis: defaultRisk,
      mentalHealth: {
        ...defaultRisk,
        depressionScore: 0,
        anxietyScore: 0,
        stressScore: 0
      },
      calculatedScores: {
        framinghamScore: 0,
        reynoldsScore: 0
      },
      lastUpdated: new Date()
    };
  }

  // Загрузка данных окружающей среды
  private async loadEnvironmentalHealth(patientId: string): Promise<EnvironmentalHealth | undefined> {
    // В будущем можно добавить таблицу environmental_health
    return undefined;
  }

  // Загрузка результатов анализов
  private async loadLabResults(patientId: string): Promise<LabResult[]> {
    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', patientId)
      .eq('record_type', 'lab_result')
      .order('record_date', { ascending: false });

    return (data || []).map(record => {
      let metadata: any = {};
      try {
        metadata = typeof record.metadata === 'string' 
          ? JSON.parse(record.metadata) 
          : record.metadata || {};
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }

      return {
        id: record.id,
        testType: record.title,
        testDate: new Date(record.record_date),
        results: metadata.results || {},
        interpretation: record.description || '',
        referenceRanges: metadata.reference_ranges || {},
        status: 'completed' as const,
        uploadedBy: 'patient' as const,
        doctorNotes: metadata.doctor_notes,
        calculatedIndices: metadata.calculated_indices || []
      };
    });
  }

  // Загрузка медицинской истории
  private async loadMedicalHistory(patientId: string) {
    return {
      surgeries: [],
      hospitalizations: [],
      majorIllnesses: [],
      immunizations: [],
      screenings: []
    };
  }

  // Загрузка семейной истории
  private async loadFamilyHistory(patientId: string): Promise<FamilyHistory | undefined> {
    const { data } = await supabase
      .from('family_groups')
      .select(`
        *,
        family_members (*)
      `)
      .eq('created_by', patientId)
      .limit(1);

    if (data && data[0]) {
      return {
        maternalSide: [],
        paternalSide: [],
        geneticRisks: [],
        hereditaryConditions: []
      };
    }

    return undefined;
  }

  // Загрузка AI рекомендаций
  private async loadAIRecommendations(patientId: string): Promise<AIRecommendation[]> {
    // Генерация базовых рекомендаций на основе данных
    return [
      {
        id: '1',
        type: 'lifestyle',
        category: 'Физическая активность',
        title: 'Увеличьте физическую активность',
        description: 'Рекомендуется увеличить количество шагов до 10,000 в день',
        actionItems: [
          'Начните с 15-минутных прогулок',
          'Используйте лестницу вместо лифта',
          'Паркуйтесь дальше от места назначения'
        ],
        priority: 'medium',
        basedOn: ['health_assessment', 'activity_data'],
        confidence: 0.8,
        generatedAt: new Date(),
        status: 'new'
      }
    ];
  }

  // Загрузка заметок врачей
  private async loadDoctorNotes(patientId: string) {
    return [];
  }

  // Загрузка настроек
  private async loadPreferences(patientId: string) {
    return {
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        reminderFrequency: 'weekly' as const,
        criticalAlertsOnly: false
      },
      privacy: {
        shareWithFamily: false,
        shareWithDoctors: true,
        anonymousData: false,
        researchParticipation: false,
        dataRetention: 5
      },
      language: 'ru',
      timezone: 'Europe/Moscow',
      units: 'metric' as const,
      dashboardLayout: ['overview', 'health-assessment', 'risk-factors', 'lab-results']
    };
  }

  // Сохранение данных о здоровье
  async saveHealthAssessment(data: Partial<HealthAssessment>): Promise<void> {
    try {
      if (this.patientData) {
        this.patientData.healthAssessment = { 
          ...this.patientData.healthAssessment, 
          ...data 
        };
        await this.persistHealthData();
        await this.triggerAIAnalysis();
        toast.success('Данные о здоровье обновлены');
      }
    } catch (error) {
      console.error('Error saving health assessment:', error);
      toast.error('Ошибка сохранения данных о здоровье');
    }
  }

  // Сохранение результатов анализов
  async saveLabResults(labResult: LabResult): Promise<void> {
    try {
      if (this.patientData) {
        // Вычисляем медицинские индексы
        const calculatedIndices = await this.calculateMedicalIndices(labResult);
        labResult.calculatedIndices = calculatedIndices;

        this.patientData.labResults.unshift(labResult);
        await this.persistLabResult(labResult);
        await this.triggerAIAnalysis();
        toast.success('Результаты анализов добавлены');
      }
    } catch (error) {
      console.error('Error saving lab results:', error);
      toast.error('Ошибка сохранения результатов анализов');
    }
  }

  // Вычисление медицинских индексов
  private async calculateMedicalIndices(labResult: LabResult): Promise<CalculatedIndex[]> {
    const indices: CalculatedIndex[] = [];

    // HOMA-IR расчет
    if (this.hasRequiredParametersForHOMAIR(labResult)) {
      const homaIR = this.calculateHOMAIR(labResult);
      if (homaIR) indices.push(homaIR);
    }

    // FT3/FT4 соотношение
    if (this.hasRequiredParametersForFT3FT4(labResult)) {
      const ft3ft4 = this.calculateFT3FT4Ratio(labResult);
      if (ft3ft4) indices.push(ft3ft4);
    }

    // Добавить другие калькуляторы...

    return indices;
  }

  private hasRequiredParametersForHOMAIR(labResult: LabResult): boolean {
    return !!(labResult.results.glucose && labResult.results.insulin);
  }

  private calculateHOMAIR(labResult: LabResult): CalculatedIndex | null {
    const glucose = parseFloat(labResult.results.glucose?.value as string);
    const insulin = parseFloat(labResult.results.insulin?.value as string);

    if (glucose && insulin) {
      const homaIR = (glucose * insulin) / 22.5;
      return {
        name: 'HOMA-IR',
        value: homaIR,
        interpretation: homaIR < 2.5 ? 'Нормальная чувствительность к инсулину' : 
                      homaIR < 5 ? 'Умеренная инсулинорезистентность' : 'Выраженная инсулинорезистентность',
        normalRange: '< 2.5',
        calculatedAt: new Date(),
        basedOn: ['glucose', 'insulin']
      };
    }

    return null;
  }

  private hasRequiredParametersForFT3FT4(labResult: LabResult): boolean {
    return !!(labResult.results.ft3 && labResult.results.ft4);
  }

  private calculateFT3FT4Ratio(labResult: LabResult): CalculatedIndex | null {
    const ft3 = parseFloat(labResult.results.ft3?.value as string);
    const ft4 = parseFloat(labResult.results.ft4?.value as string);

    if (ft3 && ft4) {
      const ratio = ft3 / ft4;
      return {
        name: 'FT3/FT4 Ratio',
        value: ratio,
        interpretation: ratio >= 0.2 && ratio <= 0.4 ? 'Нормальное соотношение' : 'Нарушенное соотношение',
        normalRange: '0.2 - 0.4',
        calculatedAt: new Date(),
        basedOn: ['ft3', 'ft4']
      };
    }

    return null;
  }

  // Генерация AI рекомендаций
  private async triggerAIAnalysis(): Promise<void> {
    if (this.patientData) {
      const newRecommendations = await this.generateAIRecommendations(this.patientData);
      this.patientData.aiRecommendations.push(...newRecommendations);
    }
  }

  private async generateAIRecommendations(patientData: PatientProfile): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Анализ на основе результатов анализов
    if (patientData.labResults.length > 0) {
      const latestLab = patientData.labResults[0];
      
      // Проверка критических значений
      for (const [key, value] of Object.entries(latestLab.results)) {
        if (value.isAbnormal) {
          recommendations.push({
            id: `rec_${Date.now()}_${key}`,
            type: 'medical',
            category: 'Результаты анализов',
            title: `Обратите внимание на показатель ${key}`,
            description: `Значение ${key} выходит за пределы нормы`,
            actionItems: [
              'Обратитесь к врачу для консультации',
              'Повторите анализ через 2-4 недели',
              'Следуйте рекомендациям по образу жизни'
            ],
            priority: value.severity === 'severe' ? 'critical' : 'high',
            basedOn: ['lab_results'],
            confidence: 0.9,
            generatedAt: new Date(),
            status: 'new'
          });
        }
      }
    }

    return recommendations;
  }

  // Сохранение данных в базу
  private async persistHealthData(): Promise<void> {
    if (!this.userId) return;

    // Здесь можно реализовать сохранение в Supabase
    // Например, в таблицу health_assessments
  }

  private async persistLabResult(labResult: LabResult): Promise<void> {
    if (!this.userId) return;

    const { error } = await supabase
      .from('medical_records')
      .insert({
        user_id: this.userId,
        record_type: 'lab_result',
        title: labResult.testType,
        description: labResult.interpretation,
        record_date: labResult.testDate.toISOString().split('T')[0],
        metadata: {
          results: labResult.results,
          reference_ranges: labResult.referenceRanges,
          calculated_indices: labResult.calculatedIndices,
          status: labResult.status
        } as any
      });

    if (error) {
      throw new Error('Ошибка сохранения результатов анализов');
    }
  }

  // Получение данных для врача
  getPatientDataForDoctor(): PatientProfile | null {
    return this.patientData;
  }

  // Предоставление доступа врачу
  async shareDataWithDoctor(doctorId: string, permissions: string[]): Promise<void> {
    if (!this.userId) return;

    const { error } = await supabase
      .from('patient_data_permissions')
      .insert({
        patient_id: this.userId,
        granted_to_id: doctorId,
        granted_to_role: 'doctor',
        permission_type: 'read',
        data_types: permissions,
        is_active: true
      });

    if (error) {
      throw new Error('Ошибка предоставления доступа врачу');
    }

    toast.success('Доступ к данным предоставлен врачу');
  }

  // Обработка действий с рекомендациями
  async handleRecommendationAction(recommendationId: string, action: 'acknowledge' | 'implement' | 'dismiss'): Promise<void> {
    if (this.patientData) {
      const recommendation = this.patientData.aiRecommendations.find(r => r.id === recommendationId);
      if (recommendation) {
        recommendation.status = action === 'acknowledge' ? 'acknowledged' : 
                               action === 'implement' ? 'implemented' : 'dismissed';
        if (action === 'implement') {
          recommendation.implementationDate = new Date();
        }
        toast.success('Статус рекомендации обновлен');
      }
    }
  }
}
