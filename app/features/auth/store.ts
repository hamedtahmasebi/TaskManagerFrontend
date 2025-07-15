import { create } from "zustand";
import { persist } from "zustand/middleware";
type TAuthStoreProperties = {
    accessToken: string | null;
    setAccessToken: (t: string | null) => void;
};

export const useAuthStore = create<TAuthStoreProperties>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (t) => set(() => ({ accessToken: t })),
        }),
        {
            name: "auth-store",
            version: 1,
            partialize: (s) => ({ accessToken: s.accessToken }),
        }
    )
);
