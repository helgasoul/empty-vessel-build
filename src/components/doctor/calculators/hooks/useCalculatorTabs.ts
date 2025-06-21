
import { useState, useEffect } from 'react';
import { getCalculatorTabs, CalculatorTab } from '../config/calculatorTabs';

export const useCalculatorTabs = () => {
  const [tabs, setTabs] = useState<CalculatorTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTabs = async () => {
      try {
        setLoading(true);
        const calculatorTabs = await getCalculatorTabs();
        setTabs(calculatorTabs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load calculator tabs');
      } finally {
        setLoading(false);
      }
    };

    loadTabs();
  }, []);

  return { tabs, loading, error };
};
