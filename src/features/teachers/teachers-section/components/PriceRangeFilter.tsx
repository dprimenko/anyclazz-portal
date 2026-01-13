import { useState } from "react";
import { PopMenu } from "@/ui-library/components/pop-menu/PopMenu";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useTranslations } from "@/i18n";

export interface PriceRangeFilterProps {
    minPrice?: number;
    maxPrice?: number;
    onPriceChange: (minPrice?: number, maxPrice?: number) => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onPriceChange }: PriceRangeFilterProps) {
    const t = useTranslations();
    const [localMin, setLocalMin] = useState<string>(minPrice?.toString() || '');
    const [localMax, setLocalMax] = useState<string>(maxPrice?.toString() || '');
    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        const min = localMin ? parseFloat(localMin) : undefined;
        const max = localMax ? parseFloat(localMax) : undefined;
        onPriceChange(min, max);
        setIsOpen(false);
    };

    const handleClear = () => {
        setLocalMin('');
        setLocalMax('');
        onPriceChange(undefined, undefined);
        setIsOpen(false);
    };

    const getDisplayText = () => {
        if (minPrice && maxPrice) {
            return `€${minPrice} - €${maxPrice}`;
        }
        if (minPrice) {
            return `${t('common.from')} €${minPrice}`;
        }
        if (maxPrice) {
            return `${t('common.up_to')} €${maxPrice}`;
        }
        return t('teachers.any_price');
    };

    return (
        <PopMenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            trigger={
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-400 transition-colors bg-white"
                >
                    <span className="text-sm">💰</span>
                    <Text size="text-sm" colorType="primary">{getDisplayText()}</Text>
                </button>
            }
        >
            <div className="flex flex-col gap-4 p-4 w-64">
                <Text size="text-sm" weight="semibold" colorType="primary">
                    {t('teachers.price_range')}
                </Text>
                
                <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-1">
                        <Text size="text-xs" colorType="tertiary">
                            {t('common.min_price')}
                        </Text>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={localMin}
                            onChange={(e) => setLocalMin(e.target.value)}
                            placeholder="0"
                            className="px-3 py-2 border border-neutral-200 rounded-md text-sm"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <Text size="text-xs" colorType="tertiary">
                            {t('common.max_price')}
                        </Text>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={localMax}
                            onChange={(e) => setLocalMax(e.target.value)}
                            placeholder={t('common.no_limit')}
                            className="px-3 py-2 border border-neutral-200 rounded-md text-sm"
                        />
                    </label>
                </div>

                <div className="flex gap-2">
                    <Button
                        colorType="secondary"
                        label={t('common.clear')}
                        size="sm"
                        fullWidth
                        onClick={handleClear}
                    />
                    <Button
                        colorType="primary"
                        label={t('common.apply')}
                        size="sm"
                        fullWidth
                        onClick={handleApply}
                    />
                </div>
            </div>
        </PopMenu>
    );
}
