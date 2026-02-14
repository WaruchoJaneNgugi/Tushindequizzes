import {useAuthStore} from "../Store/authStore";

export const useAuth = () => {
    const {
        user,
        isLoggedIn,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateUser,
        clearError,
    } = useAuthStore();

    return {
        user,
        isLoggedIn,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateUser,
        clearError,
    };
};