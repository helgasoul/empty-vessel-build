
// Enhanced API client that works with the gateway system
import { GatewayRequest, GatewayResponse } from './types';
import { GatewayServer } from './server';
import { supabase } from '@/integrations/supabase/client';

export class ApiClient {
  private authToken: string | null = null;

  constructor() {
    // Initialize with current session if available
    this.initializeAuth();
  }

  private async initializeAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      this.authToken = session.access_token;
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async makeGatewayRequest(method: string, path: string, body?: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const gatewayReq: GatewayRequest = {
      method: method.toUpperCase(),
      url: `/api/${path}`,
      headers,
      body,
      query: {}
    };

    // Process through gateway server
    const response = await GatewayServer.handleRequest(gatewayReq);

    if (response.status >= 400) {
      throw new Error(response.error || 'Request failed');
    }

    return response.data;
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.makeGatewayRequest('POST', 'auth/login', { email, password });
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.makeGatewayRequest('POST', 'auth/register', { email, password, firstName, lastName });
  }

  async logout() {
    return this.makeGatewayRequest('POST', 'auth/logout');
  }

  async getProfile() {
    return this.makeGatewayRequest('GET', 'auth/me');
  }

  // Medical methods
  async getMedicalPartners() {
    return this.makeGatewayRequest('GET', 'medical/partners');
  }

  async createGynecologyAppointment(appointmentData: any) {
    return this.makeGatewayRequest('POST', 'medical/appointments/gynecology', appointmentData);
  }

  async getGynecologyAppointments() {
    return this.makeGatewayRequest('GET', 'medical/appointments/gynecology');
  }

  async createLabTest(testData: any) {
    return this.makeGatewayRequest('POST', 'medical/lab-tests', testData);
  }

  async getLabTests() {
    return this.makeGatewayRequest('GET', 'medical/lab-tests');
  }

  // Risk assessment methods
  async calculateRisk(assessmentType: string, assessmentData: any) {
    return this.makeGatewayRequest('POST', 'risk-assessment/calculate', { assessmentType, assessmentData });
  }

  async getRiskHistory() {
    return this.makeGatewayRequest('GET', 'risk-assessment/history');
  }

  async getLatestRiskAssessment() {
    return this.makeGatewayRequest('GET', 'risk-assessment/latest');
  }

  // Health check
  async healthCheck() {
    return GatewayServer.healthCheck();
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
