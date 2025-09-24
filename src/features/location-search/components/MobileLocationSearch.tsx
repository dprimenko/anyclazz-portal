import './styles.scss';
import { LocationSearch } from "./LocationSearch";
import { CaretLeftIcon, NavigationArrowIcon } from '@phosphor-icons/react';
import { useThemeContext } from '../../../ui-library/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AutocompleteOption } from '../../../ui-library/components/autocomplete/style';
import { Loader } from '../../../ui-library/components/loader/Loader';
import { useLocation } from '../../../hooks/useLocation';
import { getGeocode, searchPlaces } from '../../../services/google-maps';

export interface MobileLocationSearchProps {
    onSelect: (item: { place_id: string; lat: number; lng: number; address: string }) => void;
    onClose: () => void;
}

export function MobileLocationSearch({ onSelect, onClose }: MobileLocationSearchProps) {
    const { theme } = useThemeContext();
    
    const [value, setValue] = useState<string>('');
    const [locations, setLocations] = useState<{ place_id: string; lat: number; lng: number; address: string }[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isError, setIsError] = useState(false);
    const { requestCurrentLocation } = useLocation();

    const handleValueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        resetState();
    }, []);

    const resetState = useCallback(() => {
        setIsFetching(false);
        setNotFound(false);
        setIsError(false);
        setLocations([]);
    }, []);

    const onSearch = useCallback(async (value: string) => {
        setIsFetching(true);
        setNotFound(false);
        setIsError(false);
        searchPlaces(value)
            .then((detailsResponses) => {
                const locations = detailsResponses.map(response => ({
                    place_id: response.data.result.place_id,
                    lat: response.data.result.geometry.location.lat,
                    lng: response.data.result.geometry.location.lng,
                    address: response.data.result.formatted_address
                }));
                setLocations(locations);
                if (locations.length === 0) {
                    setNotFound(true);
                }
            })
            .catch((_) => {
                setIsError(true);
            }).finally(() => {
                setIsFetching(false);
            });
    }, []);

    const ref = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!ref.current) return;
        ref.current.focus();
    }, [ref]);

    const handleCurrentLocation = useCallback(async () => {
        const position = await requestCurrentLocation();
        const response = await getGeocode(position.coords.latitude, position.coords.longitude);

        const result = response.data.results[0];
        onSelect({
            place_id: result.place_id,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            address: result.formatted_address
        });
    }, []);

    return (
        <div className="mobile-location-search__container">
            <div className="mobile-location-search__header">
                <div className="mobile-location-search__header-back-button">
                    <CaretLeftIcon color={theme.colors.neutral[900]} size={24} onClick={onClose} />
                </div>
                <LocationSearch ref={ref} value={value} onSearch={onSearch} onChange={handleValueChange} />
            </div>
            <div className="mobile-location-search__content">
                <>
                    <AutocompleteOption $variant="small" onClick={() => handleCurrentLocation()}>
                        <>
                            <NavigationArrowIcon size={24} color={theme.colors.primary[700]} />
                            <span>Usar mi ubicación actual</span>
                        </>
                    </AutocompleteOption>
                    {locations.map((item) => (
                        <AutocompleteOption $variant="small" key={item.place_id} onClick={() => onSelect(item)}>
                            <>
                                <span>{item.address}</span>
                            </>
                        </AutocompleteOption>
                    ))
                    }
                    {isFetching && (
                        <div className="mobile-location-search__content-loader">
                            <Loader color={theme.colors.neutral[900]} backgroundColor={theme.colors.basic.white} />
                        </div>
                    )}
                    {notFound && (
                        <AutocompleteOption $variant="small" $disabled>
                            <div className="mobile-location-search__content-not-found">
                                No se encontraron resultados
                            </div>
                        </AutocompleteOption>
                    )}
                </>
            </div>
        </div>
    );
}