import { api } from '@/utils/api';
import { ItemCatalogItem, UserInventoryItem, ActiveItemEffect } from './types';

export interface UserInventoryResponse {
  inventory: UserInventoryItem[];
  active_effects: ActiveItemEffect[];
}

interface RawInventoryItem {
  item_id: string;
  quantity: number;
  item_details: ItemCatalogItem;
}

interface RawActiveEffect {
  item_id: string;
  activated_at: string;
  expires_at: string;
  remaining_seconds: number;
}

interface RawInventoryResponse {
  inventory?: RawInventoryItem[];
  active_effects?: RawActiveEffect[];
}

export async function fetchItemCatalog(): Promise<ItemCatalogItem[]> {
  return api.get<ItemCatalogItem[]>('/items');
}

export async function fetchUserInventory(): Promise<UserInventoryResponse> {
  const data = await api.get<RawInventoryResponse>('/inventory');
  return {
    inventory: (data?.inventory || []).map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
      item_details: item.item_details,
    })),
    active_effects: (data?.active_effects || []).map((effect) => ({
      item_id: effect.item_id,
      activated_at: effect.activated_at,
      expires_at: effect.expires_at,
      remaining_seconds: effect.remaining_seconds,
    })),
  };
}

export async function consumeInventoryItem(
  itemId: string,
  quantity: number = 1,
  payload?: Record<string, unknown>
): Promise<UserInventoryResponse> {
  const data = await api.post<RawInventoryResponse>('/inventory/use', {
    item_id: itemId,
    quantity,
    payload,
  });
  return {
    inventory: (data?.inventory || []).map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
      item_details: item.item_details,
    })),
    active_effects: (data?.active_effects || []).map((effect) => ({
      item_id: effect.item_id,
      activated_at: effect.activated_at,
      expires_at: effect.expires_at,
      remaining_seconds: effect.remaining_seconds,
    })),
  };
}
