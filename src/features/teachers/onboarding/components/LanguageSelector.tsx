import { useState, useMemo, useCallback } from 'react';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { languages } from '../data/languages';
import { proficiencyLevels } from '../data/proficiencyLevels';
import type { TeacherLanguage } from '@/features/teachers/domain/types';

interface LanguageSelectorProps {
    lang: string;
    value: TeacherLanguage[];
    onChange: (languages: TeacherLanguage[]) => void;
    label?: string;
    required?: boolean;
}

export function LanguageSelector({ lang, value, onChange, label, required }: LanguageSelectorProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');

    // Transform languages to combobox items
    const languageItems: ComboboxItem[] = useMemo(() => 
        languages
            .filter(l => !value.some(v => v.language === l.code))
            .map(language => ({
                value: language.code,
                label: language.name[lang as keyof typeof language.name],
            })),
        [lang, value]
    );

    // Transform proficiency levels to combobox items
    const levelItems: ComboboxItem[] = useMemo(() => 
        proficiencyLevels.map(level => ({
            value: level.code,
            label: level.name[lang as keyof typeof level.name],
        })),
        [lang]
    );

    const handleAddLanguage = useCallback(() => {
        if (selectedLanguage && selectedLevel) {
            onChange([...value, { language: selectedLanguage, proficiencyLevel: selectedLevel }]);
            setSelectedLanguage('');
            setSelectedLevel('');
        }
    }, [selectedLanguage, selectedLevel, value, onChange]);

    const handleRemoveLanguage = useCallback((languageCode: string) => {
        onChange(value.filter(l => l.language !== languageCode));
    }, [value, onChange]);

    const getLanguageName = useCallback((code: string) => {
        const language = languages.find(l => l.code === code);
        return language?.name[lang as keyof typeof language.name] || code;
    }, [lang]);

    const getLevelName = useCallback((code: string) => {
        const level = proficiencyLevels.find(l => l.code === code);
        return level?.name[lang as keyof typeof level.name] || code;
    }, [lang]);

    const canAdd = selectedLanguage !== '' && selectedLevel !== '';

    return (
        <div>
            {label && (
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {label} {required && <span className="text-[var(--color-primary-700)]">*</span>}
                </label>
            )}

            <div className="space-y-4">
            {/* Selected Languages List */}
            {value.length > 0 && (
                <div className="space-y-2 mb-4">
                    {value.map((teacherLang) => (
                        <div
                            key={teacherLang.language}
                            className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]"
                        >
                            <div className="flex flex-col gap-1">
                                <Text size="text-sm" weight="medium" colorType="primary">
                                    {getLanguageName(teacherLang.language)}
                                </Text>
                                <Text size="text-xs" colorType="tertiary">
                                    {getLevelName(teacherLang.proficiencyLevel)}
                                </Text>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveLanguage(teacherLang.language)}
                                className="p-1 hover:bg-[var(--color-neutral-200)] rounded-md transition-colors"
                            >
                                <Icon 
                                    icon="close" 
                                    iconWidth={16} 
                                    iconHeight={16}
                                    iconColor="#181d27"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Language Section */}
            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Combobox
                        items={languageItems}
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        placeholder={lang === 'es' ? 'Seleccionar idioma' : 'Select language'}
                        searchPlaceholder={lang === 'es' ? 'Buscar idioma...' : 'Search language...'}
                        emptyMessage={lang === 'es' ? 'No se encontraron idiomas' : 'No languages found'}
                        fullWidth
                    />
                    <Combobox
                        items={levelItems}
                        value={selectedLevel}
                        onChange={setSelectedLevel}
                        placeholder={lang === 'es' ? 'Nivel' : 'Level'}
                        searchPlaceholder={lang === 'es' ? 'Buscar nivel...' : 'Search level...'}
                        emptyMessage={lang === 'es' ? 'No se encontraron niveles' : 'No levels found'}
                        fullWidth
                        disabled={!selectedLanguage}
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleAddLanguage}
                    disabled={!canAdd}
                    colorType="secondary"
                    icon="add"
                    label={lang === 'es' ? 'Añadir idioma' : 'Add language'}
                    fullWidth
                />
            </div>
            </div>
        </div>
    );
}
