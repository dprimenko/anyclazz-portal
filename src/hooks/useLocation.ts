import { useCallback } from "react";

export const useLocation = () => {
    const requestCurrentLocation = useCallback((): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            }, (error) => {
                reject(error);
            });
        });
    }, []);

    return {
        requestCurrentLocation,
    };
};