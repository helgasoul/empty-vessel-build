
/**
 * Analysis History Component
 * Displays previous analysis sessions
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnalysisHistoryHeader } from './components/AnalysisHistoryHeader';
import { SessionCard } from './components/SessionCard';

interface AnalysisSession {
  id: string;
  session_type: string;
  analysis_date: string;
  processing_status: string;
  confidence_score?: number;
  data_completeness?: number;
  patterns_detected?: any[];
  correlations_found?: any[];
  anomalies_detected?: any[];
  key_findings?: string[];
  created_at: string;
}

interface AnalysisHistoryProps {
  sessions: AnalysisSession[];
  onSelectSession: (session: AnalysisSession) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  sessions,
  onSelectSession
}) => {
  if (sessions.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent>
          <AnalysisHistoryHeader isEmpty={true} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard 
          key={session.id}
          session={session}
          onSelect={onSelectSession}
        />
      ))}
    </div>
  );
};
