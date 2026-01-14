import { useState, useMemo, useEffect } from "react";
import { PopMenu } from "@/ui-library/components/pop-menu/PopMenu";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Dropdown, type DropdownItem } from "@/ui-library/components/form/dropdown/Dropdown";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";
import { SUBJECT_CATEGORIES, SUBJECTS_BY_CATEGORY, STUDENT_LEVELS } from "../../onboarding/constants";
import { languages } from "../../onboarding/data/languages";

export interface MoreFiltersProps {
    subjectCategoryId?: string;
    subjectId?: string;
    speakLanguage?: string;
    studentLevelId?: string;
    lang: string;
    fullWidth?: boolean;
    onFiltersChange: (filters: {
        subjectCategoryId?: string;
        subjectId?: string;
        speakLanguage?: string;
        studentLevelId?: string;
    }) => void;
}

export function MoreFilters({ 
    subjectCategoryId, 
    subjectId, 
    speakLanguage, 
    studentLevelId,
    lang,
    fullWidth,
    onFiltersChange 
}: MoreFiltersProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [localSubjectCategory, setLocalSubjectCategory] = useState<string>(subjectCategoryId || SUBJECT_CATEGORIES[0].id);
    const [localSubject, setLocalSubject] = useState<string>(subjectId || '');
    const [localLanguage, setLocalLanguage] = useState<string>(speakLanguage || '');
    const [localStudentLevel, setLocalStudentLevel] = useState<string>(studentLevelId || '');

    // Update local state when props change
    useEffect(() => {
        setLocalSubjectCategory(subjectCategoryId || SUBJECT_CATEGORIES[0].id);
        setLocalSubject(subjectId || '');
        setLocalLanguage(speakLanguage || '');
        setLocalStudentLevel(studentLevelId || '');
    }, [subjectCategoryId, subjectId, speakLanguage, studentLevelId]);

    // Reset subject when category changes
    useEffect(() => {
        if (localSubjectCategory && localSubject) {
            const subjectsInCategory = SUBJECTS_BY_CATEGORY[localSubjectCategory] || [];
            const isSubjectInCategory = subjectsInCategory.some(s => s.id === localSubject);
            if (!isSubjectInCategory) {
                setLocalSubject('');
            }
        }
    }, [localSubjectCategory, localSubject]);

    // Transform subject categories to dropdown items
    const categoryItems: DropdownItem[] = useMemo(() => 
        SUBJECT_CATEGORIES.map(category => ({
            value: category.id,
            label: category.name[lang as keyof typeof category.name],
        })),
        [lang]
    );

    // Transform subjects based on selected category
    const subjectItems: DropdownItem[] = useMemo(() => {
        const subjects = SUBJECTS_BY_CATEGORY[localSubjectCategory] || [];
        return subjects.map(subject => ({
            value: subject.id,
            label: subject.name[lang as keyof typeof subject.name],
        }));
    }, [localSubjectCategory, lang]);

    // Transform languages to dropdown items
    const languageItems: DropdownItem[] = useMemo(() => 
        languages.map(language => ({
            value: language.code,
            label: language.name[lang as keyof typeof language.name],
        })),
        [lang]
    );

    // Transform student levels to dropdown items
    const studentLevelItems: DropdownItem[] = useMemo(() => 
        STUDENT_LEVELS.map(level => ({
            value: level.id,
            label: level.name[lang as keyof typeof level.name],
        })),
        [lang]
    );

    const handleApply = () => {
        const filtersToApply = {
            subjectCategoryId: localSubject ? localSubjectCategory : undefined,
            subjectId: localSubject || undefined,
            speakLanguage: localLanguage || undefined,
            studentLevelId: localStudentLevel || undefined,
        };
        console.log('MoreFilters - Applying filters:', filtersToApply);
        onFiltersChange(filtersToApply);
        setIsOpen(false);
    };

    const handleClear = () => {
        setLocalSubjectCategory(SUBJECT_CATEGORIES[0].id);
        setLocalSubject('');
        setLocalLanguage('');
        setLocalStudentLevel('');
        onFiltersChange({
            subjectCategoryId: undefined,
            subjectId: undefined,
            speakLanguage: undefined,
            studentLevelId: undefined,
        });
        setIsOpen(false);
    };

    const hasActiveFilters = localSubject !== '' || localLanguage !== '' || localStudentLevel !== '';

    const getDisplayText = () => {
        const activeCount = [localSubject, localLanguage, localStudentLevel].filter(Boolean).length;
        if (activeCount === 0) {
            return t('teachers.more_filters');
        }
        return `${t('teachers.more_filters')} (${activeCount})`;
    };

    return (
        <PopMenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            contentClassName="w-[400px]"
            trigger={
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex items-center justify-between px-4 py-2.5 text-left min-w-[200px]',
                        'border border-[var(--color-neutral-200)] rounded-lg',
                        'bg-white transition-all',
                        'hover:border-[var(--color-neutral-300)]',
                        'focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]',
                        isOpen && 'outline outline-2 outline-[var(--color-primary-700)]',
                        hasActiveFilters && 'border-[var(--color-primary-700)]',
                        fullWidth && 'w-full'
                    )}
                >
                    <div className="flex items-center gap-2 flex-1">
                        <Icon 
                            icon="filter-lines" 
                            iconWidth={16} 
                            iconHeight={16}
                            className={cn(
                                'text-[var(--color-neutral-500)]',
                                hasActiveFilters && 'text-[var(--color-primary-700)]'
                            )}
                        />
                        <span className={cn(
                            hasActiveFilters ? 'text-[var(--color-primary-700)] font-medium' : 'text-[var(--color-neutral-900)]'
                        )}>
                            {getDisplayText()}
                        </span>
                    </div>
                    <Icon 
                        icon="chevron-down" 
                        iconWidth={16} 
                        iconHeight={16}
                        className={cn(
                            'ml-2 shrink-0 transition-transform text-[var(--color-neutral-500)]',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>
            }
        >
            <div className="flex flex-col gap-4 p-4">
                <Text size="text-sm" weight="semibold" colorType="primary">
                    {t('teachers.more_filters')}
                </Text>
                
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Text size="text-xs" colorType="tertiary">
                            {t('teachers.subject_category')}
                        </Text>
                        <Dropdown
                            items={categoryItems}
                            value={localSubjectCategory}
                            onChange={setLocalSubjectCategory}
                            placeholder={t('teachers.select_category')}
                            disablePortal={true}
                            fullWidth
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text size="text-xs" colorType="tertiary">
                            {t('teachers.subject')}
                        </Text>
                        <Dropdown
                            items={subjectItems}
                            value={localSubject}
                            onChange={setLocalSubject}
                            placeholder={t('teachers.select_subject')}
                            clearable={true}
                            clearText={t('teachers.all_subjects')}
                            disablePortal={true}
                            fullWidth
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text size="text-xs" colorType="tertiary">
                            {t('teachers.speaks_language')}
                        </Text>
                        <Dropdown
                            items={languageItems}
                            value={localLanguage}
                            onChange={setLocalLanguage}
                            placeholder={t('teachers.select_language')}
                            clearable={true}
                            clearText={t('teachers.all_languages')}
                            disablePortal={true}
                            fullWidth
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Text size="text-xs" colorType="tertiary">
                            {t('teachers.student_level')}
                        </Text>
                        <Dropdown
                            items={studentLevelItems}
                            value={localStudentLevel}
                            onChange={setLocalStudentLevel}
                            placeholder={t('teachers.select_student_level')}
                            clearable={true}
                            clearText={t('teachers.all_levels')}
                            disablePortal={true}
                            fullWidth
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[var(--color-neutral-200)]">
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
