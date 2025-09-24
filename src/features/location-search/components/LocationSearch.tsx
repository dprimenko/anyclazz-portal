import { Autocomplete } from "../../../ui-library/components/autocomplete/Autocomplete";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useTranslations, getLangFromUrl } from "../../../i18n";
import type { ChangeEvent } from "react";
import { useThemeContext } from "../../../ui-library/themes";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export interface LocationSearchProps {
    ref?: React.RefObject<HTMLInputElement | null>;
    value: string;
    onSearch: (value: string) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function LocationSearch({
    ref,
    value,
    onSearch,
    onChange,
}: LocationSearchProps) {
    const { theme } = useThemeContext();

	return (
        <Autocomplete
            ref={ref}
            value={value}
            variant="small"
            placeholder={t('location.placeholder')}
            delay={600}
            leftIcon={<MagnifyingGlassIcon size={24} color={theme.colors.neutral[900]} />}
            optionLeftIcon={<MagnifyingGlassIcon size={24} color={theme.colors.neutral[900]} />}
            valueKey="id"
            labelKey="name"
            onSearch={onSearch}
            onChange={onChange}
        />
    );
}