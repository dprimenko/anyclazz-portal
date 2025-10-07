import countriesList from "../../../assets/data/countries.json";

export const countryItems = () => {
    return countriesList.map((country) => ({
        label: country.name,
        value: country.abbr,
    }));
}