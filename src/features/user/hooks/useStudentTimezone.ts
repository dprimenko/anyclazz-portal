import { useState, useEffect } from 'react';
import { ApiUserRepository } from '../infrastructure/ApiUserRepository';

const userRepository = new ApiUserRepository();

/**
 * Returns the student's timezone from their profile.
 * Falls back to the browser's timezone if the profile is not yet loaded
 * or if the accessToken is not available.
 */
export function useStudentTimezone(accessToken: string): string {
    const [timezone, setTimezone] = useState<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    useEffect(() => {
        if (!accessToken) return;
        userRepository
            .getUserProfile({ token: accessToken })
            .then(profile => {
                if (profile.timezone) {
                    setTimezone(profile.timezone);
                }
            })
            .catch(() => {
                // Keep browser timezone as fallback
            });
    }, [accessToken]);

    return timezone;
}
