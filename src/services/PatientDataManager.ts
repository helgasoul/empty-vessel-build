
import { PatientProfile, LabResult, AIRecommendation, HealthAssessment, RiskFactors, EnvironmentalHealth, FamilyHistory } from '../types/patient';
import { toast } from 'sonner';

// Import services
import { PersonalInfoService } from './patient/PersonalInfoService';
import { HealthAssessmentService } from './patient/HealthAssessmentService';
import { RiskFactorsService } from './patient/RiskFactorsService';
import { LabResultsService } from './patient/LabResultsService';
import { MedicalIndexCalculator } from './patient/MedicalIndexCalculator';
import { AIRecommendationsService } from './patient/AIRecommendationsService';
import { PatientPermissionsService } from './patient/PatientPermissionsService';

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
        PersonalInfoService.loadPersonalInfo(patientId),
        HealthAssessmentService.loadHealthAssessment(patientId),
        RiskFactorsService.loadRiskFactors(patientId),
        this.loadEnvironmentalHealth(patientId),
        LabResultsService.loadLabResults(patientId),
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

  // Загрузка данных окружающей среды
  private async loadEnvironmentalHealth(patientId: string): Promise<EnvironmentalHealth | undefined> {
    // В будущем можно добавить таблицу environmental_health
    return undefined;
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
    // Здесь можно добавить загрузку из family_groups
    return undefined;
  }

  // Загрузка AI рекомендаций
  private async loadAIRecommendations(patientId: string): Promise<AIRecommendation[]> {
    return AIRecommendationsService.getDefaultRecommendations();
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
      if (this.patientData && this.userId) {
        // Вычисляем медицинские индексы
        const calculatedIndices = await MedicalIndexCalculator.calculateMedicalIndices(labResult);
        labResult.calculatedIndices = calculatedIndices;

        this.patientData.labResults.unshift(labResult);
        await LabResultsService.saveLabResult(labResult, this.userId);
        await this.triggerAIAnalysis();
        toast.success('Результаты анализов добавлены');
      }
    } catch (error) {
      console.error('Error saving lab results:', error);
      toast.error('Ошибка сохранения результатов анализов');
    }
  }

  // Генерация AI рекомендаций
  private async triggerAIAnalysis(): Promise<void> {
    if (this.patientData) {
      const newRecommendations = await AIRecommendationsService.generateAIRecommendations(this.patientData);
      this.patientData.aiRecommendations.push(...newRecommendations);
    }
  }

  // Сохранение данных в базу
  private async persistHealthData(): Promise<void> {
    if (!this.userId) return;
    // Здесь можно реализовать сохранение в Supabase
    // Например, в таблицу health_assessments
  }

  // Получение данных для врача
  getPatientDataForDoctor(): PatientProfile | null {
    return this.patientData;
  }

  // Предоставление доступа врачу
  async shareDataWithDoctor(doctorId: string, permissions: string[]): Promise<void> {
    if (!this.userId) return;
    await PatientPermissionsService.shareDataWithDoctor(this.userId, doctorId, permissions);
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
