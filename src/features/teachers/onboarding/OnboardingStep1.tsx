import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from '@/i18n';
import { RectangleSelectionGroup, type RectangleSelectionGroupItem } from '@/ui-library/components/form/rectangle-selection-group';
import { Dropdown, type DropdownItem } from '@/ui-library/components/form/dropdown';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { STUDENT_LEVELS, SUBJECT_CATEGORIES, SUBJECTS_BY_CATEGORY } from './constants';
import { ApiTeacherRepository } from '../infrastructure/ApiTeacherRepository';

interface OnboardingStep1Props {
    lang: string;
    initialData?: {
        studentLevel?: string;
        category?: string;
        subject?: string;
    };
    teacherId: string;
    token: string;
}

export default function OnboardingStep1({ lang, initialData, teacherId, token }: OnboardingStep1Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const repository = useMemo(() => new ApiTeacherRepository(), []);
    
    // Por defecto selecciona la primera categoría
    const defaultCategory = SUBJECT_CATEGORIES[0].id;
    
    const [studentLevel, setStudentLevel] = useState<string>(initialData?.studentLevel || '');
    const [category, setCategory] = useState<string>(initialData?.category || defaultCategory);
    const [subject, setSubject] = useState<string>(initialData?.subject || '');
    const [isSaving, setIsSaving] = useState(false);

    // Cambiar subjects cuando cambia la categoría
    useEffect(() => {
        // Si cambia la categoría, reinicia el subject seleccionado
        if (category && !initialData?.subject) {
            setSubject('');
        }
    }, [category, initialData?.subject]);

    // Convertir student levels a items del selector
    const studentLevelItems: RectangleSelectionGroupItem[] = useMemo(() => 
        STUDENT_LEVELS.map(level => ({
            id: level.id,
            children: () => (
                <span className={`text-sm font-medium text-[var(--color-neutral-900)]`}>
                    {level.name[lang]}
                </span>
            ),
        })),
        [lang]
    );

    // Convertir categories a items del selector
    const categoryItems: RectangleSelectionGroupItem[] = useMemo(() =>
        SUBJECT_CATEGORIES.map(cat => ({
            id: cat.id,
            children: () => (
                <span className={`text-sm font-medium text-[var(--color-neutral-900)]`}>
                    {cat.name[lang]}
                </span>
            ),
        })),
        [lang]
    );

    // Obtener subjects según la categoría seleccionada
    const subjectItems: DropdownItem[] = useMemo(() => {
        const subjects = SUBJECTS_BY_CATEGORY[category] || [];
        return subjects.map(subj => ({
            value: subj.id,
            label: subj.name[lang],
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[var(--color-primary-700)]" />}
                </div>
            ),
        }));
    }, [category, lang]);

    const isFormValid = useMemo(() => {
        return studentLevel !== '' && category !== '' && subject !== '';
    }, [studentLevel, category, subject]);

    const selectStudentLevel = useCallback((levelId: string) => {
        console.log('Selected student level:', levelId);
        setStudentLevel(levelId);
    }, []);

    const selectCategory = useCallback((categoryId: string) => {
        console.log('Selected category:', categoryId);
        setCategory(categoryId);
    }, []);

    const handleContinue = useCallback(async () => {
        if (!isFormValid) return;
        
        setIsSaving(true);
        try {
            await repository.updateTeacher({
                teacherId,
                token,
                data: {
                    studentLevelId: studentLevel,
                    subjectCategoryId: category,
                    subjectId: subject,
                }
            });
            
            // Navegar a la siguiente página
            window.location.href = `/onboarding/class-modality`;
        } catch (error) {
            console.error('Error saving step 1:', error);
            // TODO: Mostrar mensaje de error al usuario
        } finally {
            setIsSaving(false);
        }
    }, [isFormValid, repository, teacherId, token, studentLevel, category, subject, lang]);

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary" textalign="center" className="mb-2">
                    {t('onboarding.step1.title')}
                </Text>
                <Text size="text-md" colorType="tertiary" textalign="center">
                    {t('onboarding.step1.description')}
                </Text>
            </div>

            {/* Student Levels */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-3">
                    {t('onboarding.student_levels')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <RectangleSelectionGroup
                    items={studentLevelItems}
                    value={studentLevel}
                    onValueChange={selectStudentLevel}
                    colorType="primary"
                    cnn={{ container: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }}
                />
            </div>

            {/* Category */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.category')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <RectangleSelectionGroup
                    items={categoryItems}
                    value={category}
                    onValueChange={selectCategory}
                    colorType="primary"
                    cnn={{ container: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }}
                />
            </div>

            {/* Subject */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.select_main_area')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <Dropdown
                    items={subjectItems}
                    value={subject}
                    onChange={setSubject}
                    placeholder={t('onboarding.select_main_area')}
                    fullWidth
                />
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                disabled={!isFormValid || isSaving}
                className={`
                    w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all
                    ${isFormValid && !isSaving
                        ? 'bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]'
                        : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-400)] cursor-not-allowed'
                    }
                `}
            >
                {isSaving ? t('onboarding.saving') : t('onboarding.continue')}
            </button>
        </>
    );
}
