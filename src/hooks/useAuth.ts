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
        changePassword,
        updateUser,
        clearError,
        token,
    } = useAuthStore();

    return {
        user,
        isLoggedIn,
        isLoading,
        error,
        login,
        signup,
        logout,
        changePassword,
        updateUser,
        clearError,
        token
    };
};