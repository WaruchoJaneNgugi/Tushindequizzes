import { useMemo } from 'react';

export interface PointsPackage {
    id: number;
    points: number;
    price: number;
    popular: boolean;
}

export interface UsePointsPackagesReturn {
    pointsPackages: PointsPackage[];
    getPackageById: (id: number) => PointsPackage | undefined;
    calculatePointsPerCurrency: (packageId: number) => number;
}

export const usePointsPackages = (): UsePointsPackagesReturn => {
    const pointsPackages: PointsPackage[] = useMemo(() => [
        { id: 1, points: 7, price: 10, popular: false },
        { id: 2, points: 15, price: 20, popular: false },
        { id: 3, points: 40, price: 50, popular: false },
        { id: 4, points: 85, price: 100, popular: true },
        { id: 5, points: 170, price: 200, popular: false },
        { id: 6, points: 255, price: 300, popular: false },
    ], []);

    const getPackageById = (id: number): PointsPackage | undefined => {
        return pointsPackages.find(pkg => pkg.id === id);
    };

    const calculatePointsPerCurrency = (packageId: number): number => {
        const pkg = getPackageById(packageId);
        if (!pkg) return 0;
        return Math.round(pkg.points / pkg.price * 100) / 100;
    };

    return {
        pointsPackages,
        getPackageById,
        calculatePointsPerCurrency,
    };
};