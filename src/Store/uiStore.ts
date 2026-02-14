import { create } from 'zustand';

interface UIState {
    activePage: string;
    showSettings: boolean;
    showBuyPoints: boolean;
    showAuthModal: boolean;
    authModalMode: 'login' | 'signup';
    showMobileMenu: boolean;
    showProfile:boolean;

    // Actions
    setActivePage: (page: string) => void;
    setShowSettings: (show: boolean) => void;
    setShowBuyPoints: (show: boolean) => void;
    setShowAuthModal: (show: boolean) => void;
    setAuthModalMode: (mode: 'login' | 'signup') => void;
    setShowMobileMenu: (show: boolean) => void;
    toggleMobileMenu: () => void;
    closeAllModals: () => void;
    setShowProfile:(show:boolean)=>void;
}

export const useUIStore = create<UIState>((set) => ({
    activePage: 'home',
    showSettings: false,
    showBuyPoints: false,
    showAuthModal: false,
    authModalMode: 'login',
    showMobileMenu: false,
    showProfile:false,
    setActivePage: (page) => set({ activePage: page }),

    setShowSettings: (show) => set({ showSettings: show }),

    setShowBuyPoints: (show) => set({ showBuyPoints: show }),

    setShowAuthModal: (show) => set({ showAuthModal: show }),
    setShowProfile: (show) => set({ showProfile: show }),

    setAuthModalMode: (mode) => set({ authModalMode: mode }),

    setShowMobileMenu: (show) => set({ showMobileMenu: show }),

    toggleMobileMenu: () => set((state) => ({ showMobileMenu: !state.showMobileMenu })),

    closeAllModals: () => set({
        showSettings: false,
        showBuyPoints: false,
        showAuthModal: false,
        showMobileMenu: false,
        showProfile:false,
    }),
}));