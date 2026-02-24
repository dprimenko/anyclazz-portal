import { useMemo, useCallback, useEffect } from 'react';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { languages } from '../data/languages';
import { proficiencyLevels } from '../data/proficiencyLevels';
import type { TeacherLanguage } from '@/features/teachers/domain/types';
import { useTranslations } from '@/i18n';

interface LanguageSelectorProps {
    lang: string;
    value: TeacherLanguage[];
    onChange: (languages: TeacherLanguage[]) => void;
    label?: string;
    required?: boolean;
}

export function LanguageSelector({ lang, value, onChange, label, required }: LanguageSelectorProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    // Ensure there's always at least one empty row
    useEffect(() => {
        if (value.length === 0) {
            onChange([{ language: '', proficiencyLevel: '' }]);
        }
    }, []);

    // Transform proficiency levels to combobox items
    const levelItems: ComboboxItem[] = useMemo(() => 
        proficiencyLevels.map(level => ({
            value: level.code,
            label: level.name[lang as keyof typeof level.name],
        })),
        [lang]
    );

    // Get available language items for a specific index
    const getLanguageItems = useCallback((currentIndex: number): ComboboxItem[] => {
        const selectedLanguages = value
            .map((v, idx) => idx !== currentIndex ? v.language : null)
            .filter((code): code is string => code !== null && code !== '');
        
        return languages
            .filter(l => !selectedLanguages.includes(l.code))
            .map(language => ({
                value: language.code,
                label: language.name[lang as keyof typeof language.name],
            }));
    }, [lang, value]);

    const handleLanguageChange = useCallback((index: number, languageCode: string) => {
        const newValue = [...value];
        newValue[index] = { ...newValue[index], language: languageCode };
        onChange(newValue);
    }, [value, onChange]);

    const handleLevelChange = useCallback((index: number, levelCode: string) => {
        const newValue = [...value];
        newValue[index] = { ...newValue[index], proficiencyLevel: levelCode };
        onChange(newValue);
    }, [value, onChange]);

    const handleRemoveLanguage = useCallback((index: number) => {
        const newValue = value.filter((_, idx) => idx !== index);
        // Keep at least one row
        if (newValue.length === 0) {
            onChange([{ language: '', proficiencyLevel: '' }]);
        } else {
            onChange(newValue);
        }
    }, [value, onChange]);

    const handleAddLanguage = useCallback(() => {
        onChange([...value, { language: '', proficiencyLevel: '' }]);
    }, [value, onChange]);

    return (
        <div>
            {label && (
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {label} {required && <span className="text-[var(--color-primary-700)]">*</span>}
                </label>
            )}

            <div className="space-y-4">
                {/* Language Rows */}
                <div className="space-y-3">
                    {value.map((teacherLang, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <Combobox
                                    items={getLanguageItems(index)}
                                    value={teacherLang.language}
                                    onChange={(languageCode) => handleLanguageChange(index, languageCode)}
                                    placeholder={t('language_selector.select_language')}
                                    searchPlaceholder={t('language_selector.search_language')}
                                    emptyMessage={t('language_selector.no_languages_found')}
                                    fullWidth
                                />
                                <Combobox
                                    items={levelItems}
                                    value={teacherLang.proficiencyLevel}
                                    onChange={(levelCode) => handleLevelChange(index, levelCode)}
                                    placeholder={t('language_selector.select_level')}
                                    searchPlaceholder={t('language_selector.search_level')}
                                    emptyMessage={t('language_selector.no_levels_found')}
                                    fullWidth
                                    disabled={!teacherLang.language}
                                />
                            </div>
                            {value.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLanguage(index)}
                                    className="p-2 hover:bg-[var(--color-neutral-200)] rounded-md transition-colors mt-[2px]"
                                >
                                    <Icon 
                                        icon="close" 
                                        iconWidth={20} 
                                        iconHeight={20}
                                        iconColor="#181d27"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Language Button */}
                <Button
                    type="button"
                    onClick={handleAddLanguage}
                    colorType="secondary"
                    icon="add"
                    label={t('language_selector.add_language')}
                    fullWidth
                />
            </div>
        </div>
    );
}
