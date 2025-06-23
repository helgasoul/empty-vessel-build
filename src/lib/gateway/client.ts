
// Updated client to use the new API client
import { apiClient } from './api-client';

export class GatewayClient {
  private authToken: string | null = null;

  setAuthToken(token: string) {
    this.authToken = token;
    apiClient.setAuthToken(token);
  }

  // Auth methods
  async login(email: string, password: string) {
    return apiClient.login(email, password);
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return apiClient.register(email, password, firstName, lastName);
  }

  async logout() {
    return apiClient.logout();
  }

  async getProfile() {
    return apiClient.getProfile();
  }

  // Medical methods
  async getMedicalPartners() {
    return apiClient.getMedicalPartners();
  }

  async createGynecologyAppointment(appointmentData: any) {
    return apiClient.createGynecologyAppointment(appointmentData);
  }

  async getGynecologyAppointments() {
    return apiClient.getGynecologyAppointments();
  }

  async createLabTest(testData: any) {
    return apiClient.createLabTest(testData);
  }

  async getLabTests() {
    return apiClient.getLabTests();
  }

  // Risk assessment methods
  async calculateRisk(assessmentType: string, assessmentData: any) {
    return apiClient.calculateRisk(assessmentType, assessmentData);
  }

  async getRiskHistory() {
    return apiClient.getRiskHistory();
  }

  async getLatestRiskAssessment() {
    return apiClient.getLatestRiskAssessment();
  }

  // Health check
  async healthCheck() {
    return apiClient.healthCheck();
  }
}

// Export the singleton instance
export const gatewayClient = new GatewayClient();
