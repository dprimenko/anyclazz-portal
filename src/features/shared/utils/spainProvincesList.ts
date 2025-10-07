import spainProvincesList from "../../../assets/data/spainProvinces.json";

export const provinceItems = () => {
    return spainProvincesList.map((province) => ({
        label: province.nombre,
        value: province.id.toString(),
    }));
};