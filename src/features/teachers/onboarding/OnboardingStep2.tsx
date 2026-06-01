import { useState, useMemo, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Checkbox } from '@/ui-library/shared';
import { ClassType, type TeacherClassType, type DurationPrice } from '@/features/teachers/domain/types';
import { cn } from '@/lib/utils';
import { TeacherModalitiesRepository } from '../infrastructure/TeacherModalitiesRepository';
import { TeacherAvailabilityRepository } from '../infrastructure/TeacherAvailabilityRepository';
import { WeeklyAvailabilitySelector, type DayAvailability } from '../availability_and_modalities/components/WeeklyAvailabilitySelector';

interface OnboardingStep2Props {
    lang: string;
    initialData?: {
        classModalities?: TeacherClassType[];
        availability?: DayAvailability[];
    };
    teacherId: string;
    token: string;
    timezone?: string;
}

interface ModalityOption {
    id: ClassType;
    title: string;
    description: string;
}

export default function OnboardingStep2({ lang, initialData, teacherId, token, timezone = 'America/New_York' }: OnboardingStep2Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const repository = useMemo(() => new TeacherModalitiesRepository(), []);
    const availabilityRepository = useMemo(() => new TeacherAvailabilityRepository(), []);

    const validInitial = useMemo(() =>
        (initialData?.classModalities || []).filter(ct => ct.type && Array.isArray(ct.durations)),
        [initialData]
    );

    const [classTypes, setClassTypes] = useState<TeacherClassType[]>(validInitial);
    const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>(initialData?.availability || []);
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

    const isSelected = useCallback((modalityId: ClassType) =>
        classTypes.some(ct => ct.type === modalityId), [classTypes]);

    const getPrice = useCallback((modalityId: ClassType, duration: 30 | 60): number | undefined => {
        const ct = classTypes.find(c => c.type === modalityId);
        return ct?.durations?.find(d => d.duration === duration)?.price?.amount;
    }, [classTypes]);

    // Cada modalidad seleccionada debe tener al menos un precio > 0
    // y debe haber al menos un tramo horario disponible
    const isFormValid = useMemo(() => {
        if (classTypes.length === 0) return false;
        const hasValidPrices = classTypes.every(ct =>
            ct.durations?.some(d => d.price && d.price.amount > 0)
        );
        const hasAvailability = weeklyAvailability.some(d => d.isAvailable && d.timeRanges.length > 0);
        return hasValidPrices && hasAvailability;
    }, [classTypes, weeklyAvailability]);

    const handleToggle = useCallback((modalityId: ClassType) => {
        setClassTypes(prev => {
            const exists = prev.find(ct => ct.type === modalityId);
            if (exists) {
                return prev.filter(ct => ct.type !== modalityId);
            }
            return [...prev, { type: modalityId, durations: [{ duration: 30 as const }, { duration: 60 as const }] }];
        });
    }, []);

    const handlePriceChange = useCallback((modalityId: ClassType, duration: 30 | 60, amount: number | undefined) => {
        setClassTypes(prev => {
            const next = prev.map(ct => {
                if (ct.type !== modalityId) return ct;

                const durations = Array.isArray(ct.durations) ? [...ct.durations] : [];
                const idx = durations.findIndex(d => d.duration === duration);
                const updated: DurationPrice = amount && amount > 0
                    ? { duration, price: { amount, currency: 'USD' } }
                    : { duration };

                if (idx !== -1) {
                    durations[idx] = updated;
                } else {
                    durations.push(updated);
                }

                return { ...ct, durations };
            });
            return next;
        });
    }, []);

    const handleContinue = useCallback(async () => {
        if (!isFormValid) return;

        setIsSaving(true);
        try {
            await repository.saveClassTypes(teacherId, classTypes, token);
            await availabilityRepository.saveAvailability(teacherId, weeklyAvailability, token, timezone);
            window.location.href = `/onboarding/profile-basics`;
        } catch (error) {
            console.error('Error saving step 2:', error);
        } finally {
            setIsSaving(false);
        }
    }, [isFormValid, repository, availabilityRepository, teacherId, token, classTypes, weeklyAvailability, timezone]);

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
                        const checked = isSelected(option.id);

                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    "flex flex-col gap-3 p-4 rounded-lg border transition-all",
                                    checked
                                        ? "border-2 border-[var(--color-primary-700)] bg-[var(--color-primary-100)]"
                                        : "border border-[var(--color-neutral-200)] bg-white hover:border-[var(--color-neutral-300)]"
                                )}
                            >
                                <label className="flex items-start gap-3 cursor-pointer">
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
                                </label>

                                {checked && (
                                    <div className="flex flex-col gap-3 pl-8 pt-2">
                                        {([30, 60] as const).map((duration) => {
                                            const hasOtherPrice = getPrice(option.id, duration === 30 ? 60 : 30) !== undefined
                                                && (getPrice(option.id, duration === 30 ? 60 : 30) ?? 0) > 0;
                                            const thisPrice = getPrice(option.id, duration);
                                            const isRequired = !hasOtherPrice;

                                            return (
                                                <div
                                                    key={duration}
                                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <Text textLevel="span" size="text-md" weight="medium" colorType="primary">
                                                            {t('teacher-profile.minutes_lesson', { minutes: duration })}
                                                        </Text>
                                                        {isRequired && (
                                                            <span className="text-[var(--color-primary-700)] text-sm">*</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <NumericFormat
                                                            value={thisPrice ?? ''}
                                                            onValueChange={(values) => handlePriceChange(option.id, duration, values.floatValue)}
                                                            placeholder={t('common.price')}
                                                            className="w-32 px-3 py-2 border border-gray-200 rounded-md text-sm text-right"
                                                            allowNegative={false}
                                                            decimalScale={2}
                                                            fixedDecimalScale={false}
                                                            thousandSeparator={false}
                                                        />
                                                        <Text textLevel="span" size="text-md" colorType="tertiary">
                                                            $
                                                        </Text>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {/* Hint when no price is set yet */}
                                        {!classTypes.find(ct => ct.type === option.id)?.durations?.some(d => d.price && d.price.amount > 0) && (
                                            <Text textLevel="span" size="text-sm" colorType="tertiary">
                                                {t('onboarding.pricing_required')}
                                            </Text>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1">
                    {t('onboarding.availability')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <Text textLevel="p" size="text-sm" colorType="tertiary" className="mb-3">
                    {t('teacher-profile.add_time_ranges')}
                </Text>
                <WeeklyAvailabilitySelector
                    availability={weeklyAvailability.length > 0 ? weeklyAvailability : undefined}
                    onChange={setWeeklyAvailability}
                    hideLabel
                />
                {!weeklyAvailability.some(d => d.isAvailable && d.timeRanges.length > 0) && classTypes.length > 0 && (
                    <Text textLevel="span" size="text-sm" colorType="tertiary" className="mt-2 block">
                        {t('onboarding.availability_required')}
                    </Text>
                )}
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
