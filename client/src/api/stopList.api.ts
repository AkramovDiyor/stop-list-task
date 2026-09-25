import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://stop-list-server.onrender.com/api',
});

export type DishCategory = 'Кухня' | 'Бар' | 'Десерты';

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  price: number;
}

export interface StopListEntry {
  id: string;
  dishId: string;
  reason: string;
  stoppedAt: string;
  expiresAt: string;
  returnedAt: string | null;
}

export interface StopListEntryView extends StopListEntry {
  dish: Dish;
  status: 'active' | 'returned' | 'expired';
  minutesLeft: number;
}

export interface CreateStopEntryInput {
  dishId: string;
  reason: string;
  durationMinutes: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}


export const stopListApi = {
  getDishes: async (): Promise<Dish[]> => {
    const response = await api.get<{ data: Dish[] }>('/dishes');
    return response.data.data;
  },

  getActiveStopList: async (category?: string): Promise<StopListEntryView[]> => {
    const response = await api.get<{ data: StopListEntryView[] }>('/stop-list', {
      params: category ? { category } : {},
    });
    return response.data.data;
  },

  createStopEntry: async (input: CreateStopEntryInput): Promise<StopListEntry> => {
    const response = await api.post<{ data: StopListEntry }>('/stop-list', input);
    return response.data.data;
  },

  returnDish: async (id: string): Promise<StopListEntry> => {
    const response = await api.patch<{ data: StopListEntry }>(`/stop-list/${id}/return`);
    return response.data.data;
  },

  getHistory: async (limit = 20, offset = 0): Promise<StopListEntryView[]> => {
    const response = await api.get<{ data: StopListEntryView[] }>('/stop-list/history', {
      params: { limit, offset },
    });
    return response.data.data;
  },
};