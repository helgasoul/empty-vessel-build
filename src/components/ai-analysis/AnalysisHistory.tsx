
/**
 * Analysis History Component
 * Displays previous analysis sessions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/design-system/components';
import { 
  Clock,
  Brain,
  Activity,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react';

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
  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'full_analysis': return 'Полный анализ';
      case 'targeted_analysis': return 'Целевой анализ';
      case 'pattern_detection': return 'Поиск паттернов';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'info';
    }
  };

  if (sessions.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Brain className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-h4 text-text-primary font-semibold mb-2">
            История анализов пуста
          </h3>
          <p className="text-body text-text-secondary">
            Запустите ваш первый анализ ИИ, чтобы создать историю
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card 
          key={session.id} 
          className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer"
          onClick={() => onSelectSession(session)}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {session.confidence_score && (
                  <div className="text-center">
                    <p className="text-body-small text-text-secondary">Уверенность</p>
                    <p className="text-h4 font-bold text-text-primary">
                      {Math.round(session.confidence_score * 100)}%
                    </p>
                  </div>
                )}
                
                {session.data_completeness && (
                  <div className="text-center">
                    <p className="text-body-small text-text-secondary">Полнота данных</p>
                    <p className="text-h4 font-bold text-text-primary">
                      {Math.round(session.data_completeness * 100)}%
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-body-small text-text-secondary">Паттерны</p>
                  <p className="text-h4 font-bold text-text-primary">
                    {session.patterns_detected?.length || 0}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-body-small text-text-secondary">Корреляции</p>
                  <p className="text-h4 font-bold text-text-primary">
                    {session.correlations_found?.length || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Key Findings Preview */}
            {session.key_findings && session.key_findings.length > 0 && (
              <div className="border-t border-border-light pt-4">
                <p className="text-body-small text-text-secondary font-medium mb-2">
                  Ключевые выводы:
                </p>
                <div className="space-y-1">
                  {session.key_findings.slice(0, 2).map((finding, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-body-small text-text-primary line-clamp-2">
                        {finding}
                      </p>
                    </div>
                  ))}
                  {session.key_findings.length > 2 && (
                    <p className="text-body-small text-text-secondary pl-4">
                      +{session.key_findings.length - 2} дополнительных выводов
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
              <div className="flex items-center gap-4 text-body-small text-text-secondary">
                {session.patterns_detected && session.patterns_detected.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>{session.patterns_detected.length} паттернов</span>
                  </div>
                )}
                
                {session.correlations_found && session.correlations_found.length > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{session.correlations_found.length} корреляций</span>
                  </div>
                )}
                
                {session.anomalies_detected && session.anomalies_detected.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{session.anomalies_detected.length} аномалий</span>
                  </div>
                )}
              </div>
              
              <div className="text-body-small text-text-secondary">
                ID: {session.id.slice(0, 8)}...
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
