import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SHELF_LIFE } from '@/lib/constants';

export interface StorageBatch {
  id: string;
  crop: 'Cotton' | 'Groundnut';
  quantity: number;
  storedDate: string;
  freshnessRemaining: number;
}

interface StorageBatchesContextType {
  batches: StorageBatch[];
  addBatch: (crop: 'Cotton' | 'Groundnut', quantity: number, storedDate: string) => void;
  removeBatch: (id: string) => void;
}

const STORAGE_KEY = 'agri_storage_batches';

const calculateFreshness = (crop: string, storedDate: string): number => {
  const stored = new Date(storedDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - stored.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, (SHELF_LIFE[crop] || 60) - daysPassed);
};

const getDefaultBatches = (): StorageBatch[] => [
  { id: '1', crop: 'Cotton', quantity: 25, storedDate: '2026-01-15', freshnessRemaining: calculateFreshness('Cotton', '2026-01-15') },
  { id: '2', crop: 'Groundnut', quantity: 15, storedDate: '2026-01-28', freshnessRemaining: calculateFreshness('Groundnut', '2026-01-28') },
  { id: '3', crop: 'Cotton', quantity: 10, storedDate: '2026-02-01', freshnessRemaining: calculateFreshness('Cotton', '2026-02-01') },
];

const StorageBatchesContext = createContext<StorageBatchesContextType>({
  batches: [],
  addBatch: () => {},
  removeBatch: () => {},
});

export const StorageBatchesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<StorageBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StorageBatch[];
        return parsed.map(b => ({
          ...b,
          freshnessRemaining: calculateFreshness(b.crop, b.storedDate),
        }));
      }
    } catch {
      /* ignore */
    }
    return getDefaultBatches();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
  }, [batches]);

  const addBatch = useCallback((crop: 'Cotton' | 'Groundnut', quantity: number, storedDate: string) => {
    const newBatch: StorageBatch = {
      id: Date.now().toString(),
      crop,
      quantity,
      storedDate,
      freshnessRemaining: calculateFreshness(crop, storedDate),
    };
    setBatches(prev => [...prev, newBatch]);
  }, []);

  const removeBatch = useCallback((id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  }, []);

  return (
    <StorageBatchesContext.Provider value={{ batches, addBatch, removeBatch }}>
      {children}
    </StorageBatchesContext.Provider>
  );
};

export const useStorageBatches = () => useContext(StorageBatchesContext);
