
/**
 * AI Analysis Service
 * Main service class that orchestrates AI health analysis operations
 */

import { AnalysisRequest, AnalysisResults } from './aiAnalysis/types';
import { DatabaseService } from './aiAnalysis/databaseService';
import { DataTransformService } from './aiAnalysis/dataTransformService';
import { MockDataService } from './aiAnalysis/mockDataService';

class AIAnalysisService {
  private databaseService: DatabaseService;
  private dataTransformService: DataTransformService;
  private mockDataService: MockDataService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.dataTransformService = new DataTransformService();
    this.mockDataService = new MockDataService();
  }

  /**
   * Start a new AI analysis session
   */
  async startAnalysis(request: AnalysisRequest): Promise<string> {
    try {
      const sessionId = await this.databaseService.createAnalysisSession(request);

      // Start background processing
      this.processAnalysis(sessionId, request);

      return sessionId;
    } catch (error) {
      console.error('Error starting analysis:', error);
      throw error;
    }
  }

  /**
   * Get analysis results by session ID
   */
  async getAnalysisResults(sessionId: string): Promise<AnalysisResults | null> {
    try {
      // Get session data
      const session = await this.databaseService.getAnalysisSession(sessionId);
      if (!session) {
        return null;
      }

      if (session.processing_status !== 'completed') {
        return null; // Still processing
      }

      // Get related data
      const { patterns: patternsData, correlations: correlationsData, anomalies: anomaliesData } = 
        await this.databaseService.getAnalysisData(sessionId);

      // Transform database results to interface format
      const patterns = this.dataTransformService.transformPatterns(patternsData);
      const correlations = this.dataTransformService.transformCorrelations(correlationsData);
      const anomalies = this.dataTransformService.transformAnomalies(anomaliesData);

      return this.dataTransformService.buildAnalysisResults(session, patterns, correlations, anomalies);

    } catch (error) {
      console.error('Error getting analysis results:', error);
      return null;
    }
  }

  /**
   * Get user's analysis sessions
   */
  async getUserAnalysisSessions(userId: string): Promise<any[]> {
    return this.databaseService.getUserAnalysisSessions(userId);
  }

  /**
   * Process analysis in the background
   */
  private async processAnalysis(sessionId: string, request: AnalysisRequest): Promise<void> {
    try {
      const startTime = Date.now();

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock results for demo
      const mockResults = await this.mockDataService.generateMockResults(request);

      // Update session with results
      const processingTime = Date.now() - startTime;
      
      await this.databaseService.updateAnalysisSession(sessionId, mockResults, processingTime);

      // Save detailed results
      await this.databaseService.saveDetailedResults(sessionId, request.userId, mockResults);

    } catch (error) {
      console.error('Error processing analysis:', error);
      
      // Mark as failed
      await this.databaseService.markSessionAsFailed(sessionId, error as Error);
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();

// Re-export types for backward compatibility
export * from './aiAnalysis/types';
