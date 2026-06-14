import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { cn } from '@/lib/utils';
import { loadGoogleMaps } from '@/features/shared/services/googleMaps';

export interface GoogleCitySelection {
    /** Nombre legible de la ciudad, ej. "New York" */
    city: string;
    /** Código ISO2 del país en minúsculas, ej. "us" */
    country: string;
    /** Nombre legible del país, ej. "United States" */
    countryName: string;
    /** Texto "Ciudad, País" listo para mostrar/guardar */
    fullAddress: string;
}

export interface GoogleCityAutocompleteProps {
    /** Texto a mostrar cuando ya hay una ciudad seleccionada (ej. fullAddress) */
    value?: string;
    onSelect: (selection: GoogleCitySelection) => void;
    onClear?: () => void;
    lang?: 'es' | 'en';
    placeholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

interface Prediction {
    placeId: string;
    mainText: string;
    secondaryText: string;
}

export function GoogleCityAutocomplete({
    value = '',
    onSelect,
    onClear,
    lang = 'en',
    placeholder = 'Search city...',
    emptyMessage = 'No cities found.',
    loadingMessage = 'Searching...',
    fullWidth = false,
    disabled = false,
}: GoogleCityAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const autocompleteServiceRef = useRef<any>(null);
    const placesServiceRef = useRef<any>(null);
    const sessionTokenRef = useRef<any>(null);
    const googleRef = useRef<any>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mantener sincronizado el texto cuando el padre cambia el valor (ej. reset)
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Cargar el SDK de Google Maps y preparar los servicios de Places
    useEffect(() => {
        let cancelled = false;
        loadGoogleMaps(lang)
            .then((google) => {
                if (cancelled) return;
                googleRef.current = google;
                autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
                placesServiceRef.current = new google.maps.places.PlacesService(
                    document.createElement('div')
                );
                sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
                setReady(true);
            })
            .catch((error) => {
                console.error('Google Maps no disponible:', error);
            });
        return () => {
            cancelled = true;
        };
    }, [lang]);

    // Cerrar el desplegable al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPredictions = (input: string) => {
        if (!autocompleteServiceRef.current || !input.trim()) {
            setPredictions([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        autocompleteServiceRef.current.getPlacePredictions(
            {
                input,
                types: ['(cities)'],
                sessionToken: sessionTokenRef.current,
            },
            (results: any[] | null) => {
                setLoading(false);
                if (!results) {
                    setPredictions([]);
                    return;
                }
                setPredictions(
                    results.map((r) => ({
                        placeId: r.place_id,
                        mainText: r.structured_formatting?.main_text ?? r.description,
                        secondaryText: r.structured_formatting?.secondary_text ?? '',
                    }))
                );
            }
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setInputValue(next);
        setOpen(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!next.trim()) {
            setPredictions([]);
            onClear?.();
            return;
        }

        debounceRef.current = setTimeout(() => fetchPredictions(next), 250);
    };

    const resolveAddressComponents = (place: any): GoogleCitySelection => {
        const components: any[] = place.address_components ?? [];
        const find = (type: string) =>
            components.find((c) => c.types.includes(type));

        const cityComponent =
            find('locality') ||
            find('postal_town') ||
            find('administrative_area_level_3') ||
            find('administrative_area_level_2') ||
            find('administrative_area_level_1');

        const city = cityComponent?.long_name ?? place.name ?? '';
        const countryComponent = find('country');
        const countryName = countryComponent?.long_name ?? '';
        const country = (countryComponent?.short_name ?? '').toLowerCase();
        const fullAddress = countryName ? `${city}, ${countryName}` : city;

        return { city, country, countryName, fullAddress };
    };

    const handleSelectPrediction = (prediction: Prediction) => {
        if (!placesServiceRef.current) return;
        setOpen(false);

        placesServiceRef.current.getDetails(
            {
                placeId: prediction.placeId,
                fields: ['address_components', 'name'],
                sessionToken: sessionTokenRef.current,
            },
            (place: any, status: string) => {
                // Renovar el session token tras completar la búsqueda (facturación)
                if (googleRef.current) {
                    sessionTokenRef.current = new googleRef.current.maps.places.AutocompleteSessionToken();
                }

                if (status !== 'OK' || !place) {
                    // Fallback: usamos el texto de la predicción
                    const fallback: GoogleCitySelection = {
                        city: prediction.mainText,
                        country: '',
                        countryName: prediction.secondaryText,
                        fullAddress: [prediction.mainText, prediction.secondaryText]
                            .filter(Boolean)
                            .join(', '),
                    };
                    setInputValue(fallback.fullAddress);
                    onSelect(fallback);
                    return;
                }

                const selection = resolveAddressComponents(place);
                setInputValue(selection.fullAddress);
                onSelect(selection);
            }
        );
    };

    const showDropdown = open && inputValue.trim().length > 0;

    return (
        <div ref={containerRef} className={cn('relative', fullWidth ? 'w-full' : 'min-w-[200px]')}>
            <div
                className={cn(
                    'flex items-center gap-2 px-4 py-2.5',
                    'border border-[var(--color-neutral-200)] rounded-lg bg-white transition-all',
                    'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--color-primary-700)]',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <Icon
                    icon="search"
                    iconWidth={16}
                    iconHeight={16}
                    className="shrink-0 text-[var(--color-neutral-400)]"
                />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.trim() && setOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled || !ready}
                    className={cn(
                        'flex-1 min-w-0 bg-transparent text-sm outline-none',
                        'placeholder:text-[var(--color-neutral-400)] text-[var(--color-neutral-900)]'
                    )}
                />
                {inputValue && !disabled && (
                    <button
                        type="button"
                        onClick={() => {
                            setInputValue('');
                            setPredictions([]);
                            setOpen(false);
                            onClear?.();
                        }}
                        className="shrink-0 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
                        aria-label="Clear"
                    >
                        <Icon icon="close" iconWidth={16} iconHeight={16} />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div
                    className={cn(
                        'absolute z-50 mt-2 w-full bg-white rounded-lg',
                        'border border-[var(--color-neutral-200)] shadow-lg',
                        'max-h-[300px] overflow-y-auto p-1'
                    )}
                >
                    {loading ? (
                        <div className="py-6 text-center text-sm text-[var(--color-neutral-400)]">
                            {loadingMessage}
                        </div>
                    ) : predictions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-[var(--color-neutral-400)]">
                            {emptyMessage}
                        </div>
                    ) : (
                        predictions.map((prediction) => (
                            <button
                                key={prediction.placeId}
                                type="button"
                                onClick={() => handleSelectPrediction(prediction)}
                                className={cn(
                                    'flex w-full flex-col items-start rounded-md px-3 py-2 text-left',
                                    'transition-colors hover:bg-[var(--color-neutral-100)]'
                                )}
                            >
                                <span className="text-sm text-[var(--color-neutral-900)]">
                                    {prediction.mainText}
                                </span>
                                {prediction.secondaryText && (
                                    <span className="text-xs text-[var(--color-neutral-400)]">
                                        {prediction.secondaryText}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
