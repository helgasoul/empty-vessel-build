
import { useState, useEffect } from 'react';
import { CalculatorTab, getCalculatorTabs } from '../config/calculatorTabs';

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
        setError('Failed to load calculator tabs');
        console.error('Error loading calculator tabs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTabs();
  }, []);

  return { tabs, loading, error };
};
