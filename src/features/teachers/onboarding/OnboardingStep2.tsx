import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Checkbox } from '@/components/ui/checkbox';
import { ClassType, type TeacherClassType } from '@/features/teachers/domain/types';
import { cn } from '@/lib/utils';
import { TeacherModalitiesRepository } from '../infrastructure/TeacherModalitiesRepository';

interface OnboardingStep2Props {
    lang: string;
    initialData?: {
        classModalities?: TeacherClassType[];
    };
    teacherId: string;
    token: string;
}

interface ModalityOption {
    id: ClassType;
    title: string;
    description: string;
}

export default function OnboardingStep2({ lang, initialData, teacherId, token }: OnboardingStep2Props) {
    const t = useTranslations();
    const repository = useMemo(() => new TeacherModalitiesRepository(), []);
    
    // Extraer los tipos de las modalidades iniciales
    const initialClassTypes = useMemo(() => 
        initialData?.classModalities?.map(m => m.type) || [], 
        [initialData]
    );
    
    const [selectedModalities, setSelectedModalities] = useState<ClassType[]>(initialClassTypes);
    const [isSaving, setIsSaving] = useState(false);

    const modalityOptions: ModalityOption[] = [
        {
            id: ClassType.onlineSingle,
            title: t('teacher-profile.modality.online_single.title'),
            description: t('teacher-profile.modality.online_single.description')
        },
        {
            id: ClassType.onlineGroup,
            title: t('teacher-profile.modality.online_group.title'),
            description: t('teacher-profile.modality.online_group.description')
        },
        {
            id: ClassType.onsiteGroup,
            title: t('teacher-profile.modality.onsite_group.title'),
            description: t('teacher-profile.modality.onsite_group.description')
        },
        {
            id: ClassType.onsiteSingle,
            title: t('teacher-profile.modality.onsite_single.title'),
            description: t('teacher-profile.modality.onsite_single.description')
        }
    ];

    const isFormValid = useMemo(() => selectedModalities.length > 0, [selectedModalities]);

    const handleToggle = useCallback((modalityId: ClassType) => {
        setSelectedModalities(prev => {
            if (prev.includes(modalityId)) {
                return prev.filter(id => id !== modalityId);
            } else {
                return [...prev, modalityId];
            }
        });
    }, []);

    const handleContinue = useCallback(async () => {
        if (!isFormValid) return;
        
        setIsSaving(true);
        try {
            // Transformar selectedModalities a TeacherClassType[] con precios por defecto
            const classTypes: TeacherClassType[] = selectedModalities.map(type => ({
                type
            }));
            
            await repository.saveClassTypes(teacherId, classTypes, token);
            
            // Navegar a la siguiente página
            window.location.href = `/onboarding/profile-basics`;
        } catch (error) {
            console.error('Error saving step 2:', error);
            // TODO: Mostrar mensaje de error al usuario
        } finally {
            setIsSaving(false);
        }
    }, [isFormValid, repository, teacherId, token, selectedModalities, lang]);

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary" textalign="center" className="mb-2">
                    {t('onboarding.step2.title')}
                </Text>
                <Text size="text-md" colorType="tertiary" textalign="center">
                    {t('onboarding.step2.description')}
                </Text>
            </div>

            {/* Class Modality */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-3">
                    {t('onboarding.class_modality')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <div className="flex flex-col gap-3">
                    {modalityOptions.map((option) => {
                        const checked = selectedModalities.includes(option.id);
                        
                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                                    checked 
                                        ? "border-2 border-[var(--color-primary-700)] bg-[var(--color-primary-100)]" 
                                        : "border border-[var(--color-neutral-200)] bg-white hover:border-[var(--color-neutral-300)]"
                                )}
                                onClick={() => handleToggle(option.id)}
                            >
                                <Checkbox
                                    id={option.id}
                                    checked={checked}
                                    onCheckedChange={() => handleToggle(option.id)}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <div className="flex flex-col gap-1 flex-1">
                                    <Text textLevel="span" size="text-md" weight="medium" colorType="primary">
                                        {option.title}
                                    </Text>
                                    <Text textLevel="span" size="text-sm" colorType="tertiary">
                                        {option.description}
                                    </Text>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
