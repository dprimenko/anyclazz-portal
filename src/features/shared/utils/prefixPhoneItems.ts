import prefixPhoneList from "../../../assets/data/prefixes.json";

export const prefixPhoneItems = (defaultPrefix: string) => {
    return prefixPhoneList.reduce((acc: { label: string; value: string }[], prefix) => {
        if (acc.some((item) => item.value === prefix.callingCode)) {
            return acc;
        }
        acc.push({
            label: prefix.callingCode,
            value: prefix.callingCode,
        });
        acc.sort((a, b) => Number(a.value.replace('+', '')) - Number(b.value.replace('+', '')));
        acc.sort((a, b) => a.value === defaultPrefix ? -1 : b.value === defaultPrefix ? 1 : 0);

        return acc;
    }, []);
}