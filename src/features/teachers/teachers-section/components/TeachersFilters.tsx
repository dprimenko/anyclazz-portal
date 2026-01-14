import { useState, useMemo } from "react";
import { useTranslations } from "@/i18n";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { MoreFilters } from "./MoreFilters";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { ClassType } from "../../domain/types";
import { CitySelector } from '../../onboarding/components/CitySelector';
import { useTeachers } from "../../providers/TeachersProvider";
import { Dropdown, type DropdownItem } from "@/ui-library/components/form/dropdown/Dropdown";

export interface TeachersFiltersProps {
    onFiltersChange: (filters: {
        search?: string;
        countryISO2?: string;
        cityISO2?: string;
        classTypeId?: string;
        minPrice?: number;
        maxPrice?: number;
        subjectCategoryId?: string;
        subjectId?: string;
        speakLanguage?: string;
        studentLevelId?: string;
    }) => void;
    onClear: () => void;
}

const CLASS_TYPE_OPTIONS = [
    { id: ClassType.onlineSingle, labelKey: 'classtype.online_single', icon: '👤' },
    { id: ClassType.onlineGroup, labelKey: 'classtype.online_group', icon: '👥' },
    { id: ClassType.onsiteSingle, labelKey: 'classtype.onsite_single', icon: '🏠' },
    { id: ClassType.onsiteGroup, labelKey: 'classtype.onsite_group', icon: '🏫' },
];

export function TeachersFilters({ onFiltersChange, onClear }: TeachersFiltersProps) {
    const t = useTranslations();
    const { filters, lang } = useTeachers();
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>(filters.countryISO2 || '');
    const [selectedCity, setSelectedCity] = useState<string>(filters.cityISO2 || '');
    const [selectedClassType, setSelectedClassType] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [subjectCategoryId, setSubjectCategoryId] = useState<string | undefined>();
    const [subjectId, setSubjectId] = useState<string | undefined>();
    const [speakLanguage, setSpeakLanguage] = useState<string | undefined>();
    const [studentLevelId, setStudentLevelId] = useState<string | undefined>();

    // Transform class type options to dropdown items
    const classTypeItems: DropdownItem[] = useMemo(() => 
        CLASS_TYPE_OPTIONS.map(option => ({
            value: option.id,
            label: t(option.labelKey),
            renderItem: (item) => (
                <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                </div>
            )
        })),
        [t]
    );

    const handleSearch = () => {
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
            subjectCategoryId,
            subjectId,
            speakLanguage,
            studentLevelId,
        });
    };

    const handleClear = () => {
        setSearch('');
        // No resetear selectedCountry y selectedCity
        setSelectedClassType('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSubjectCategoryId(undefined);
        setSubjectId(undefined);
        setSpeakLanguage(undefined);
        setStudentLevelId(undefined);
        onClear();
    };

    const handleCityChange = (cityISO2: string, countryISO2: string) => {
        setSelectedCity(cityISO2);
        setSelectedCountry(countryISO2);
        
        onFiltersChange({
            search: search || undefined,
            countryISO2: countryISO2 || undefined,
            cityISO2: cityISO2 || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
            subjectCategoryId,
            subjectId,
            speakLanguage,
            studentLevelId,
        });
    };

    const handleClassTypeChange = (classType: string) => {
        setSelectedClassType(classType);
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: classType || undefined,
            minPrice,
            maxPrice,
            subjectCategoryId,
            subjectId,
            speakLanguage,
            studentLevelId,
        });
    };

    const handlePriceChange = (min?: number, max?: number) => {
        setMinPrice(min);
        setMaxPrice(max);
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice: min,
            maxPrice: max,
            subjectCategoryId,
            subjectId,
            speakLanguage,
            studentLevelId,
        });
    };

    const handleMoreFiltersChange = (moreFilters: {
        subjectCategoryId?: string;
        subjectId?: string;
        speakLanguage?: string;
        studentLevelId?: string;
    }) => {
        console.log('TeachersFilters - Received from MoreFilters:', moreFilters);
        setSubjectCategoryId(moreFilters.subjectCategoryId);
        setSubjectId(moreFilters.subjectId);
        setSpeakLanguage(moreFilters.speakLanguage);
        setStudentLevelId(moreFilters.studentLevelId);
        const filtersToSend = {
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
            subjectCategoryId: moreFilters.subjectCategoryId,
            subjectId: moreFilters.subjectId,
            speakLanguage: moreFilters.speakLanguage,
            studentLevelId: moreFilters.studentLevelId,
        };
        console.log('TeachersFilters - Sending to updateFilters:', filtersToSend);
        onFiltersChange(filtersToSend);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Filters Row */}
            <div className="flex flex-row items-space-between w-full">
                <div className="flex flex-row gap-2 w-full">
                    <div className="min-w-[180px]">
                        <CitySelector
                            value={selectedCity}
                            onChange={handleCityChange}
                            lang={lang as 'es' | 'en'}
                            placeholder={t('teachers.select_city')}
                            searchPlaceholder={t('onboarding.location.search')}
                            emptyMessage={t('onboarding.location.empty')}
                            fullWidth={true}
                        />
                    </div>

                    {/* Class Type Filter */}
                    <div className="min-w-[180px]">
                        <Dropdown
                            prepend={<Icon icon="target-05" iconWidth={20} iconHeight={20} />}
                            items={classTypeItems}
                            value={selectedClassType}
                            onChange={handleClassTypeChange}
                            placeholder={t('teachers.all_class_types')}
                            clearable={true}
                            clearText={t('teachers.all_class_types')}
                            fullWidth={true}
                        />
                    </div>

                    <div className="min-w-[180px]">
                        <PriceRangeFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            fullWidth
                            onPriceChange={handlePriceChange}
                        />
                    </div>
                </div>
                

                <div className="min-w-[180px]">
                    <MoreFilters
                        subjectCategoryId={subjectCategoryId}
                        subjectId={subjectId}
                        speakLanguage={speakLanguage}
                        studentLevelId={studentLevelId}
                        lang={lang as string}
                        onFiltersChange={handleMoreFiltersChange}
                        fullWidth
                    />
                </div>
            </div>
            {/* Search Bar */}
            <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={t('teachers.search_placeholder')}
                        className="w-full px-4 py-2.5 pl-10 border border-[var(--color-neutral-200)] rounded-lg focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]"
                    />
                    <Icon 
                        icon="search" 
                        iconWidth={20} 
                        iconHeight={20} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
                    />
                </div>
                {(search || selectedClassType || minPrice || maxPrice || subjectId || speakLanguage || studentLevelId) && (
                    <Button
                        colorType="secondary"
                        size="lg" 
                        label={t('common.clear')}
                        onClick={handleClear}
                    />
                )}
                <Button
                    colorType="primary"
                    size="lg" 
                    label={t('common.search')}
                    onClick={handleSearch}
                />
            </div>
        </div>
    );
}
