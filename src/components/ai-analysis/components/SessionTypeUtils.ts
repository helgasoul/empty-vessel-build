
/**
 * Session Type Utilities
 * Helper functions for session type handling
 */

export const getSessionTypeLabel = (type: string): string => {
  switch (type) {
    case 'full_analysis': return 'Полный анализ';
    case 'targeted_analysis': return 'Целевой анализ';
    case 'pattern_detection': return 'Поиск паттернов';
    default: return type;
  }
};

export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'warning';
    case 'failed': return 'error';
    default: return 'info';
  }
};
