// utils/paginationHelpers.ts

import type {Pagination} from "../types/adminTypes.ts";

export function parsePagination(pagination: Pagination | string | undefined): Pagination | undefined {
    if (!pagination) return undefined;

    if (typeof pagination === 'string') {
        try {
            // Try to parse if it's a JSON string
            return JSON.parse(pagination);
        } catch {
            // If parsing fails, return a default pagination object
            return {
                page: 1,
                limit: 10,
                total: 0,
                pages: 1
            };
        }
    }

    return pagination;
}