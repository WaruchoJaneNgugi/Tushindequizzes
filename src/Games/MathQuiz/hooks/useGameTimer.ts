import { useEffect } from 'react';

export const useGameTimer = (redirectUrl: string | null) => {
  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);
};