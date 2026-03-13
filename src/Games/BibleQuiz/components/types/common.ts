// Mahjong/types/common.types.ts
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export type Nullable<T> = T | null;