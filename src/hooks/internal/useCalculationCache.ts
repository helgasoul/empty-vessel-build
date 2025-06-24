
import { useState, useCallback } from 'react';
import type { GailCalculatorInput, GailCalculatorResult } from '../../types/gail-calculator';

interface CacheEntry {
  input: GailCalculatorInput;
  result: GailCalculatorResult;
  timestamp: number;
}

export const useCalculationCache = (enabled: boolean) => {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());

  const generateCacheKey = useCallback((input: GailCalculatorInput): string => {
    return btoa(JSON.stringify(input)).substring(0, 32);
  }, []);

  const getCachedResult = useCallback((input: GailCalculatorInput): GailCalculatorResult | null => {
    if (!enabled) return null;
    
    const key = generateCacheKey(input);
    const entry = cache.get(key);
    
    if (entry && Date.now() - entry.timestamp < 3600000) { // 1 hour cache
      return entry.result;
    }
    
    return null;
  }, [enabled, cache, generateCacheKey]);

  const setCachedResult = useCallback((input: GailCalculatorInput, result: GailCalculatorResult) => {
    if (!enabled) return;
    
    const key = generateCacheKey(input);
    setCache(prev => new Map(prev).set(key, {
      input,
      result,
      timestamp: Date.now(),
    }));
  }, [enabled, generateCacheKey]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    getCachedResult,
    setCachedResult,
    clearCache,
  };
};
