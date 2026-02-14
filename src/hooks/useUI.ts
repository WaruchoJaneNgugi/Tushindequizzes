import {useUIStore} from "../Store/uiStore";

export const useUI = () => {
    const {
        activePage,
        showSettings,
        showBuyPoints,
        showAuthModal,
        authModalMode,
        showMobileMenu,
        showProfile,
        setActivePage,
        setShowSettings,
        setShowBuyPoints,
        setShowAuthModal,
        setAuthModalMode,
        setShowMobileMenu,
        toggleMobileMenu,
        closeAllModals,
        setShowProfile
    } = useUIStore();

    return {
        activePage,
        showSettings,
        showBuyPoints,
        showAuthModal,
        authModalMode,
        showMobileMenu,
        showProfile,
        setActivePage,
        setShowSettings,
        setShowBuyPoints,
        setShowAuthModal,
        setAuthModalMode,
        setShowMobileMenu,
        toggleMobileMenu,
        closeAllModals,
        setShowProfile,
    };
};