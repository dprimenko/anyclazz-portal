import type { AuthUser } from "../domain/types";

const USER_CACHE_KEY = 'anyclazz_user_profile';
const CACHE_EXPIRY_KEY = 'anyclazz_user_profile_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export class UserCache {
    private isClient(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    save(user: AuthUser): void {
        if (!this.isClient()) return;

        try {
            const expiryTime = Date.now() + CACHE_DURATION;
            localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
            localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
        } catch (error) {
            console.error('Error saving user to cache:', error);
        }
    }

    get(): AuthUser | null {
        if (!this.isClient()) return null;

        try {
            const cached = localStorage.getItem(USER_CACHE_KEY);
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

            if (!cached || !expiry) return null;

            // Verificar si el caché ha expirado
            if (Date.now() > parseInt(expiry)) {
                this.clear();
                return null;
            }

            return JSON.parse(cached);
        } catch (error) {
            console.error('Error reading user from cache:', error);
            this.clear();
            return null;
        }
    }

    clear(): void {
        if (!this.isClient()) return;

        try {
            localStorage.removeItem(USER_CACHE_KEY);
            localStorage.removeItem(CACHE_EXPIRY_KEY);
        } catch (error) {
            console.error('Error clearing user cache:', error);
        }
    }

    isValid(): boolean {
        if (!this.isClient()) return false;

        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        if (!expiry) return false;

        return Date.now() <= parseInt(expiry);
    }
}
