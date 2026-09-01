'use client';

import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './auth-context';
import { UserInventoryItem, ActiveItemEffect, ItemCatalogItem } from './types';
import { fetchUserInventory, consumeInventoryItem } from './inventory-service';

export interface InventoryContextType {
  inventoryItems: UserInventoryItem[];
  activeEffects: ActiveItemEffect[];
  isInventoryOpen: boolean;
  setIsInventoryOpen: (open: boolean) => void;
  isLoading: boolean;
  error: string | null;
  inventoryCount: number;
  availableFreezeTokens: number;
  availableRestoreShields: number;
  fetchInventory: () => Promise<void>;
  useItem: (itemId: string, payload?: Record<string, unknown>) => Promise<void>;
  executeUseItem: (itemId: string, payload?: Record<string, unknown>) => Promise<void>;
  grantItem: (itemId: string, quantity: number, details?: Partial<ItemCatalogItem>) => void;
  consumeItem: (itemId: string, quantity?: number) => void;
  setInventoryState: (items: UserInventoryItem[], effects: ActiveItemEffect[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const ITEM_DEFAULTS: Record<string, Partial<ItemCatalogItem>> = {
  STREAK_FREEZE_TOKEN: {
    name: 'Streak Freeze Token',
    description: 'Pause streak decay during sickness, injury, or travel.',
    effect_type: 'INSTANT_USE',
    duration_seconds: 0,
    rarity: 'rare',
    icon: 'snowflake',
  },
  RESTORE_SHIELD: {
    name: 'Streak Restore Shield',
    description: 'Restore a broken streak within the lookback window.',
    effect_type: 'INSTANT_USE',
    duration_seconds: 0,
    rarity: 'epic',
    icon: 'shield',
  },
  XP_BOOST: {
    name: 'XP Surge Booster',
    description: 'Doubles power point accumulation for 24 hours.',
    effect_type: 'TIME_BASED',
    duration_seconds: 86400,
    rarity: 'common',
    icon: 'zap',
  },
  ACCURACY_CHARM: {
    name: 'Accuracy Charm',
    description: 'Protects plan adherence score for the active cycle.',
    effect_type: 'TIME_BASED',
    duration_seconds: 604800,
    rarity: 'rare',
    icon: 'target',
  },
};

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<UserInventoryItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveItemEffect[]>([]);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const hasActiveEffects = activeEffects.length > 0;

  // Active Effects Live Ticking Timer
  useEffect(() => {
    if (!hasActiveEffects) return;

    const timer = setInterval(() => {
      setActiveEffects((prev) => {
        if (prev.length === 0) return prev;
        const next = prev
          .map((eff) => ({
            ...eff,
            remaining_seconds: Math.max(0, eff.remaining_seconds - 1),
          }))
          .filter((eff) => eff.remaining_seconds > 0);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasActiveEffects]);

  // In-flight fetch deduplication to prevent duplicate concurrent network calls
  const inFlightFetchRef = useRef<Promise<void> | null>(null);

  // Stable Fetch Inventory from Backend
  const fetchInventory = useCallback(async () => {
    if (!userRef.current) {
      setInventoryItems([]);
      setActiveEffects([]);
      return;
    }

    if (inFlightFetchRef.current) {
      return inFlightFetchRef.current;
    }

    setIsLoading(true);
    setError(null);

    const promise = (async () => {
      try {
        const data = await fetchUserInventory();
        setInventoryItems(data.inventory || []);
        setActiveEffects(data.active_effects || []);
      } catch (err: unknown) {
        console.warn('[InventoryContext] Failed to fetch inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
      } finally {
        setIsLoading(false);
        inFlightFetchRef.current = null;
      }
    })();

    inFlightFetchRef.current = promise;
    return promise;
  }, []);

  // Sync inventory whenever user identity changes
  const userEmail = user?.email;
  useEffect(() => {
    if (userEmail) {
      fetchInventory();
    } else {
      setInventoryItems([]);
      setActiveEffects([]);
    }
  }, [userEmail, fetchInventory]);

  // Consume / Use an item
  const useItem = useCallback(async (itemId: string, payload?: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await consumeInventoryItem(itemId, 1, payload);
      setInventoryItems(data.inventory || []);
      setActiveEffects(data.active_effects || []);
    } catch (err: unknown) {
      console.error('[InventoryContext] Failed to consume item:', err);
      const msg = err instanceof Error ? err.message : 'Failed to use item';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimistically grant an item (e.g. from RewardRoadmap claim)
  const grantItem = useCallback((itemId: string, quantity: number, details?: Partial<ItemCatalogItem>) => {
    setInventoryItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.item_details.item_id === itemId || i.item_id === itemId);
      if (existingIdx >= 0) {
        const next = [...prev];
        const existing = next[existingIdx];
        next[existingIdx] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
        return next;
      }

      const defaultDetails = ITEM_DEFAULTS[itemId] || {};
      const newItem: UserInventoryItem = {
        item_id: itemId,
        quantity,
        item_details: {
          item_id: (itemId as ItemCatalogItem['item_id']),
          name: details?.name || defaultDetails.name || itemId,
          effect_type: (details?.effect_type || defaultDetails.effect_type || 'INSTANT_USE') as 'INSTANT_USE' | 'TIME_BASED',
          duration_seconds: details?.duration_seconds ?? defaultDetails.duration_seconds ?? 0,
          description: details?.description || defaultDetails.description || '',
          rarity: (details?.rarity || defaultDetails.rarity || 'common') as 'common' | 'rare' | 'epic' | 'legendary',
          icon: details?.icon || defaultDetails.icon || '',
        },
      };
      return [...prev, newItem];
    });

    // Background verify with backend
    fetchInventory();
  }, [fetchInventory]);

  // Optimistically consume an item (e.g. from FreezeModal or RestoreModal)
  const consumeItem = useCallback((itemId: string, quantity: number = 1) => {
    setInventoryItems((prev) => {
      return prev
        .map((item) => {
          if (item.item_details.item_id === itemId || item.item_id === itemId) {
            return {
              ...item,
              quantity: Math.max(0, item.quantity - quantity),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });

    // Background verify with backend
    fetchInventory();
  }, [fetchInventory]);

  // Set explicit state (for mock data / testing toolbar)
  const setInventoryState = useCallback((items: UserInventoryItem[], effects: ActiveItemEffect[]) => {
    setInventoryItems(items);
    setActiveEffects(effects);
  }, []);

  const inventoryCount = useMemo(
    () => inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [inventoryItems]
  );

  const availableFreezeTokens = useMemo(() => {
    const item = inventoryItems.find((i) => i.item_details.item_id === 'STREAK_FREEZE_TOKEN' || i.item_id === 'STREAK_FREEZE_TOKEN');
    return item ? item.quantity : 0;
  }, [inventoryItems]);

  const availableRestoreShields = useMemo(() => {
    const item = inventoryItems.find((i) => i.item_details.item_id === 'RESTORE_SHIELD' || i.item_id === 'RESTORE_SHIELD');
    return item ? item.quantity : 0;
  }, [inventoryItems]);

  const contextValue = useMemo<InventoryContextType>(() => ({
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    setIsInventoryOpen,
    isLoading,
    error,
    inventoryCount,
    availableFreezeTokens,
    availableRestoreShields,
    fetchInventory,
    useItem,
    executeUseItem: useItem,
    grantItem,
    consumeItem,
    setInventoryState,
  }), [
    inventoryItems,
    activeEffects,
    isInventoryOpen,
    isLoading,
    error,
    inventoryCount,
    availableFreezeTokens,
    availableRestoreShields,
    fetchInventory,
    useItem,
    grantItem,
    consumeItem,
    setInventoryState,
  ]);

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
