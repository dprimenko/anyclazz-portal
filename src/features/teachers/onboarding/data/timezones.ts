export interface Timezone {
    value: string;
    label: string;
    offset: string;
}

export const timezones: Timezone[] = [
    // Europa
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Barcelona', label: 'Barcelona (GMT+1)', offset: '+01:00' },
    { value: 'Europe/London', label: 'London (GMT+0)', offset: '+00:00' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Rome', label: 'Rome (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Brussels', label: 'Brussels (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Lisbon', label: 'Lisbon (GMT+0)', offset: '+00:00' },
    { value: 'Europe/Vienna', label: 'Vienna (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Zurich', label: 'Zurich (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Stockholm', label: 'Stockholm (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Oslo', label: 'Oslo (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Copenhagen', label: 'Copenhagen (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Helsinki', label: 'Helsinki (GMT+2)', offset: '+02:00' },
    { value: 'Europe/Warsaw', label: 'Warsaw (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Prague', label: 'Prague (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Athens', label: 'Athens (GMT+2)', offset: '+02:00' },
    { value: 'Europe/Dublin', label: 'Dublin (GMT+0)', offset: '+00:00' },
    { value: 'Europe/Bucharest', label: 'Bucharest (GMT+2)', offset: '+02:00' },
    { value: 'Europe/Budapest', label: 'Budapest (GMT+1)', offset: '+01:00' },
    { value: 'Europe/Moscow', label: 'Moscow (GMT+3)', offset: '+03:00' },
    { value: 'Europe/Istanbul', label: 'Istanbul (GMT+3)', offset: '+03:00' },

    // América del Norte
    { value: 'America/New_York', label: 'New York (GMT-5)', offset: '-05:00' },
    { value: 'America/Chicago', label: 'Chicago (GMT-6)', offset: '-06:00' },
    { value: 'America/Denver', label: 'Denver (GMT-7)', offset: '-07:00' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)', offset: '-08:00' },
    { value: 'America/Phoenix', label: 'Phoenix (GMT-7)', offset: '-07:00' },
    { value: 'America/Anchorage', label: 'Anchorage (GMT-9)', offset: '-09:00' },
    { value: 'America/Toronto', label: 'Toronto (GMT-5)', offset: '-05:00' },
    { value: 'America/Vancouver', label: 'Vancouver (GMT-8)', offset: '-08:00' },
    { value: 'America/Mexico_City', label: 'Mexico City (GMT-6)', offset: '-06:00' },

    // América Central y Caribe
    { value: 'America/Guatemala', label: 'Guatemala (GMT-6)', offset: '-06:00' },
    { value: 'America/Havana', label: 'Havana (GMT-5)', offset: '-05:00' },
    { value: 'America/Panama', label: 'Panama (GMT-5)', offset: '-05:00' },
    { value: 'America/Costa_Rica', label: 'Costa Rica (GMT-6)', offset: '-06:00' },
    { value: 'America/Santo_Domingo', label: 'Santo Domingo (GMT-4)', offset: '-04:00' },

    // América del Sur
    { value: 'America/Bogota', label: 'Bogotá (GMT-5)', offset: '-05:00' },
    { value: 'America/Lima', label: 'Lima (GMT-5)', offset: '-05:00' },
    { value: 'America/Santiago', label: 'Santiago (GMT-3)', offset: '-03:00' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)', offset: '-03:00' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)', offset: '-03:00' },
    { value: 'America/Caracas', label: 'Caracas (GMT-4)', offset: '-04:00' },
    { value: 'America/Montevideo', label: 'Montevideo (GMT-3)', offset: '-03:00' },
    { value: 'America/Asuncion', label: 'Asunción (GMT-4)', offset: '-04:00' },
    { value: 'America/La_Paz', label: 'La Paz (GMT-4)', offset: '-04:00' },
    { value: 'America/Guayaquil', label: 'Guayaquil (GMT-5)', offset: '-05:00' },

    // Asia
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offset: '+09:00' },
    { value: 'Asia/Seoul', label: 'Seoul (GMT+9)', offset: '+09:00' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', offset: '+08:00' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)', offset: '+08:00' },
    { value: 'Asia/Singapore', label: 'Singapore (GMT+8)', offset: '+08:00' },
    { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)', offset: '+07:00' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', offset: '+04:00' },
    { value: 'Asia/Kolkata', label: 'Kolkata (GMT+5:30)', offset: '+05:30' },
    { value: 'Asia/Karachi', label: 'Karachi (GMT+5)', offset: '+05:00' },
    { value: 'Asia/Manila', label: 'Manila (GMT+8)', offset: '+08:00' },
    { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7)', offset: '+07:00' },

    // Oceanía
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10)', offset: '+10:00' },
    { value: 'Australia/Melbourne', label: 'Melbourne (GMT+10)', offset: '+10:00' },
    { value: 'Australia/Brisbane', label: 'Brisbane (GMT+10)', offset: '+10:00' },
    { value: 'Australia/Perth', label: 'Perth (GMT+8)', offset: '+08:00' },
    { value: 'Pacific/Auckland', label: 'Auckland (GMT+12)', offset: '+12:00' },

    // África
    { value: 'Africa/Cairo', label: 'Cairo (GMT+2)', offset: '+02:00' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)', offset: '+02:00' },
    { value: 'Africa/Lagos', label: 'Lagos (GMT+1)', offset: '+01:00' },
    { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)', offset: '+03:00' },
    { value: 'Africa/Casablanca', label: 'Casablanca (GMT+0)', offset: '+00:00' },

    // Atlántico
    { value: 'Atlantic/Azores', label: 'Azores (GMT-1)', offset: '-01:00' },
    { value: 'Atlantic/Canary', label: 'Canary Islands (GMT+0)', offset: '+00:00' },

    // Pacífico
    { value: 'Pacific/Honolulu', label: 'Honolulu (GMT-10)', offset: '-10:00' },
    { value: 'Pacific/Fiji', label: 'Fiji (GMT+12)', offset: '+12:00' },

    // Otros
    { value: 'UTC', label: 'UTC (GMT+0)', offset: '+00:00' },
];
