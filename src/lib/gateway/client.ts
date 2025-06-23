
import { GatewayResponse } from './types';

export class GatewayClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl = '/api/gateway') {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      method,
      headers
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const result: GatewayResponse = await response.json();

    if (result.status >= 400) {
      throw new Error(result.error || 'Request failed');
    }

    return result.data;
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.makeRequest('POST', 'auth/login', { email, password });
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.makeRequest('POST', 'auth/register', { email, password, firstName, lastName });
  }

  async logout() {
    return this.makeRequest('POST', 'auth/logout');
  }

  async getProfile() {
    return this.makeRequest('GET', 'auth/me');
  }

  // Medical methods
  async getMedicalPartners() {
    return this.makeRequest('GET', 'medical/partners');
  }

  async createGynecologyAppointment(appointmentData: any) {
    return this.makeRequest('POST', 'medical/appointments/gynecology', appointmentData);
  }

  async getGynecologyAppointments() {
    return this.makeRequest('GET', 'medical/appointments/gynecology');
  }

  async createLabTest(testData: any) {
    return this.makeRequest('POST', 'medical/lab-tests', testData);
  }

  async getLabTests() {
    return this.makeRequest('GET', 'medical/lab-tests');
  }

  // Risk assessment methods
  async calculateRisk(assessmentType: string, assessmentData: any) {
    return this.makeRequest('POST', 'risk-assessment/calculate', { assessmentType, assessmentData });
  }

  async getRiskHistory() {
    return this.makeRequest('GET', 'risk-assessment/history');
  }

  async getLatestRiskAssessment() {
    return this.makeRequest('GET', 'risk-assessment/latest');
  }
}

// Создаем глобальный экземпляр клиента
export const gatewayClient = new GatewayClient();
