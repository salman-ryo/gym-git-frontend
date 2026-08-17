import { api } from '@/utils/api';
import { ItemCatalogItem, UserInventoryItem, ActiveItemEffect } from './types';

export interface UserInventoryResponse {
  inventory: UserInventoryItem[];
  active_effects: ActiveItemEffect[];
}

interface RawInventoryItem {
  item_id: string;
  quantity: number;
  item_details?: ItemCatalogItem;
  item?: {
    id: string;
    name: string;
    description?: string;
    effect_type: 'INSTANT_USE' | 'TIME_BASED' | string;
    duration_seconds: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | string;
    icon_slug?: string;
  };
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

function mapRawInventoryItem(item: RawInventoryItem): UserInventoryItem {
  const rawDetails = item.item_details || item.item;
  const effectType = (rawDetails?.effect_type === 'TIME_BASED' ? 'TIME_BASED' : 'INSTANT_USE') as 'INSTANT_USE' | 'TIME_BASED';
  const rarity = (rawDetails?.rarity === 'rare' || rawDetails?.rarity === 'epic' || rawDetails?.rarity === 'legendary' ? rawDetails.rarity : 'common') as 'common' | 'rare' | 'epic' | 'legendary';
  const itemId = ((rawDetails && ('item_id' in rawDetails ? rawDetails.item_id : rawDetails.id)) || item.item_id || 'XP_BOOST') as ItemCatalogItem['item_id'];

  return {
    item_id: item.item_id,
    quantity: item.quantity,
    item_details: {
      item_id: itemId,
      name: rawDetails?.name || '',
      effect_type: effectType,
      duration_seconds: rawDetails?.duration_seconds || 0,
      description: rawDetails?.description || '',
      rarity: rarity,
      icon: (rawDetails && ('icon' in rawDetails ? rawDetails.icon : rawDetails.icon_slug)) || '',
    },
  };
}

export async function fetchItemCatalog(): Promise<ItemCatalogItem[]> {
  return api.get<ItemCatalogItem[]>('/items');
}

export async function fetchUserInventory(): Promise<UserInventoryResponse> {
  const data = await api.get<RawInventoryResponse>('/inventory');
  return {
    inventory: (data?.inventory || []).map(mapRawInventoryItem),
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
    inventory: (data?.inventory || []).map(mapRawInventoryItem),
    active_effects: (data?.active_effects || []).map((effect) => ({
      item_id: effect.item_id,
      activated_at: effect.activated_at,
      expires_at: effect.expires_at,
      remaining_seconds: effect.remaining_seconds,
    })),
  };
}
