
/**
 * Session Card Component
 * Individual analysis session card
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { Brain, Clock, Eye } from 'lucide-react';
import { getSessionTypeLabel, getStatusColor } from './SessionTypeUtils';
import { QualityMetrics } from './QualityMetrics';
import { KeyFindings } from './KeyFindings';
import { QuickStats } from './QuickStats';

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

interface SessionCardProps {
  session: AnalysisSession;
  onSelect: (session: AnalysisSession) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSelect }) => {
  return (
    <Card 
      className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer"
      onClick={() => onSelect(session)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-h4 text-text-primary flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              {getSessionTypeLabel(session.session_type)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              {new Date(session.analysis_date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(session.processing_status)} size="sm">
              {session.processing_status === 'completed' ? 'Завершен' :
               session.processing_status === 'processing' ? 'Обработка' :
               session.processing_status === 'failed' ? 'Ошибка' : session.processing_status}
            </Badge>
            <Eye className="h-4 w-4 text-text-secondary" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Quality Metrics */}
        {session.processing_status === 'completed' && (
          <QualityMetrics
            confidenceScore={session.confidence_score}
            dataCompleteness={session.data_completeness}
            patternsCount={session.patterns_detected?.length || 0}
            correlationsCount={session.correlations_found?.length || 0}
          />
        )}

        {/* Key Findings Preview */}
        <KeyFindings keyFindings={session.key_findings || []} />

        {/* Quick Stats */}
        <QuickStats
          patternsCount={session.patterns_detected?.length || 0}
          correlationsCount={session.correlations_found?.length || 0}
          anomaliesCount={session.anomalies_detected?.length || 0}
          sessionId={session.id}
        />
      </CardContent>
    </Card>
  );
};
