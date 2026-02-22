import countriesList from "../../../assets/data/countries.json";

/**
 * Retorna la lista de países con Estados Unidos priorizado al inicio.
 * La primera versión de la app está diseñada para EEUU.
 */
export const countryItems = () => {
    const countries = countriesList.map((country) => ({
        label: country.name,
        value: country.abbr,
    }));
    
    // Priorizar Estados Unidos (US) al inicio de la lista
    const usIndex = countries.findIndex(country => country.value === 'US');
    if (usIndex > 0) {
        const usCountry = countries[usIndex];
        countries.splice(usIndex, 1);
        countries.unshift(usCountry);
    }
    
    return countries;
}