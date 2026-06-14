// Carga el SDK de Google Maps JavaScript (con la librería Places) una sola vez
// y lo reutiliza en toda la app. Requiere la variable de entorno
// PUBLIC_GOOGLE_MAPS_API_KEY y tener habilitadas en Google Cloud:
//   - Maps JavaScript API
//   - Places API
//
// La key se usa en el cliente, así que restríngela en Google Cloud por
// referrer HTTP (los dominios de la app) para evitar usos no autorizados.

type GoogleNamespace = typeof globalThis & { google?: any };

const CALLBACK_NAME = '__initGoogleMapsPlaces';

let loaderPromise: Promise<any> | null = null;

export function loadGoogleMaps(language: string = 'en'): Promise<any> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google Maps solo puede cargarse en el navegador'));
    }

    const win = window as unknown as GoogleNamespace;

    if (win.google?.maps?.places) {
        return Promise.resolve(win.google);
    }

    if (loaderPromise) {
        return loaderPromise;
    }

    loaderPromise = new Promise((resolve, reject) => {
        const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            reject(new Error('Falta la variable de entorno PUBLIC_GOOGLE_MAPS_API_KEY'));
            return;
        }

        (win as any)[CALLBACK_NAME] = () => {
            resolve(win.google);
        };

        const script = document.createElement('script');
        const params = new URLSearchParams({
            key: apiKey,
            libraries: 'places',
            language,
            callback: CALLBACK_NAME,
            loading: 'async',
        });
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.async = true;
        script.onerror = () => {
            loaderPromise = null;
            reject(new Error('No se pudo cargar el SDK de Google Maps'));
        };
        document.head.appendChild(script);
    });

    return loaderPromise;
}
