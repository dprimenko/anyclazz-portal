import { GOOGLE_MAPS_API_KEY } from 'astro:env/client';
import axios from 'axios';

function getMapsUrl(path: string) {
    return path;
}

export function searchPlaces(query: string) {
    return axios.get(getMapsUrl(`/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_MAPS_API_KEY}`))
        .then((res) => {
            const detailsPromises = res.data.predictions.map((prediction: any) => 
                axios.get(getMapsUrl(`/maps/api/place/details/json?place_id=${prediction.place_id}&key=${GOOGLE_MAPS_API_KEY}`))
            );
            return Promise.all(detailsPromises);
        });
}

export function getGeocode(lat: number, lng: number) {
    return axios.get(getMapsUrl(`/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`));
}