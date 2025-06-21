
/**
 * Hook for AI Health Analysis
 * Manages analysis requests and results
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { aiAnalysisService, AnalysisRequest, AnalysisResults } from '@/services/aiAnalysisService';

export const useAIAnalysis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResults | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (request: Omit<AnalysisRequest, 'userId'>) => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const sessionId = await aiAnalysisService.startAnalysis({
        ...request,
        userId: user.id
      });

      // Poll for results
      pollForResults(sessionId);
      return sessionId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
      return null;
    }
  };

  const pollForResults = async (sessionId: string) => {
    const maxAttempts = 30; // 5 minutes with 10 second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const results = await aiAnalysisService.getAnalysisResults(sessionId);
        
        if (results) {
          setCurrentAnalysis(results);
          setIsAnalyzing(false);
          loadAnalysisHistory(); // Refresh history
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setError('Analysis timeout - please try again');
          setIsAnalyzing(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get results');
        setIsAnalyzing(false);
      }
    };

    poll();
  };

  const loadAnalysisHistory = async () => {
    if (!user?.id) return;

    try {
      const sessions = await aiAnalysisService.getUserAnalysisSessions(user.id);
      setAnalysisHistory(sessions);
    } catch (err) {
      console.error('Failed to load analysis history:', err);
    }
  };

  const getAnalysisResults = async (sessionId: string) => {
    try {
      const results = await aiAnalysisService.getAnalysisResults(sessionId);
      if (results) {
        setCurrentAnalysis(results);
      }
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get results');
      return null;
    }
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  useEffect(() => {
    if (user?.id) {
      loadAnalysisHistory();
    }
  }, [user?.id]);

  return {
    isAnalyzing,
    currentAnalysis,
    analysisHistory,
    error,
    startAnalysis,
    getAnalysisResults,
    clearCurrentAnalysis,
    loadAnalysisHistory
  };
};
