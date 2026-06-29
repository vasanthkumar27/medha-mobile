import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Me {
  id: number;
  email: string;
  name: string;
  role: string;
  available_hours_per_day: number;
  total_xp: number;
  streak: number;
  gems?: number;
  hearts?: number;
  league?: string;
  avatar?: string | null;
}

export interface Economy {
  xp: number;
  level: number;
  xp_in_level: number;
  xp_to_next: number;
  streak: number;
  gems: number;
  hearts: number;
  league: string;
  next_heart_refill_at: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  me: Me | null;
  economy: Economy | null;
  hydrated: boolean;
  setTokens: (a: string, r: string) => void;
  setMe: (m: Me | null) => void;
  setEconomy: (e: Economy | null) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      me: null,
      economy: null,
      hydrated: false,
      setTokens: (a, r) => set({ accessToken: a, refreshToken: r }),
      setMe: (me) => set({ me }),
      setEconomy: (economy) => set({ economy }),
      setHydrated: () => set({ hydrated: true }),
      logout: () => set({ accessToken: null, refreshToken: null, me: null, economy: null }),
    }),
    {
      name: "mentora-auth",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
