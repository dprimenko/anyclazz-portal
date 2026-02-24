import { Button } from "@/ui-library/components/ssr/button/Button";
import type { Teacher } from "../../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/i18n";
import { HorizontalInputContainer } from "@/ui-library/components/horizontal-input-container/HorizontalInputContainer";
import { TextField } from "@/ui-library/components/form/text-field/TextField";
import { Combobox, type ComboboxItem } from "@/ui-library/components/form/combobox/Combobox";
import { Controller, useForm } from "react-hook-form";
import type { TeacherRepository } from "../../domain/types";
import { countries } from "../../onboarding/data/countries";
import { states } from "../../onboarding/data/states";
import { cities } from "../../onboarding/data/cities";
import { timezones } from "../../onboarding/data/timezones";

interface LocationFormValues {
    street: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
}

interface LocationProps {
    teacher: Teacher;
    accessToken: string;
    repository: TeacherRepository;
    lang?: string;
}

export function Location({ teacher, accessToken, repository, lang = 'es' }: LocationProps) {
    const t = useTranslations();
    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset, watch } = useForm<LocationFormValues>({
        defaultValues: {
            street: teacher.teacherAddress?.street ?? "",
            city: teacher.teacherAddress?.city ?? "",
            state: teacher.teacherAddress?.state ?? "",
            country: teacher.teacherAddress?.country ?? "",
            timezone: teacher.timezone ?? "",
        },
    });

    const watchedCountry = watch("country");

    // Transform countries data to ComboboxItem format
    const countryItems: ComboboxItem[] = useMemo(() => 
        countries.map(country => ({
            value: country.country,
            label: country.name[lang as keyof typeof country.name],
        })),
        [lang]
    );

    // Filter states by selected country
    const stateItems: ComboboxItem[] = useMemo(() => {
        const filteredStates = states.filter(state => state.country === watchedCountry);
        return filteredStates.map(state => ({
            value: state.state,
            label: state.name[lang as keyof typeof state.name],
        }));
    }, [lang, watchedCountry]);

    // Filter cities by selected country
    const cityItems: ComboboxItem[] = useMemo(() => {
        if (watchedCountry) {
            const countryCities = cities.filter(city => city.country === watchedCountry);
            return countryCities.map(city => ({
                value: city.city,
                label: city.name[lang as keyof typeof city.name],
            }));
        }
        return cities.map(city => ({
            value: city.city,
            label: city.name[lang as keyof typeof city.name],
        }));
    }, [lang, watchedCountry]);

    // Transform timezones data to ComboboxItem format
    const timezoneItems: ComboboxItem[] = useMemo(() => 
        timezones.map(tz => ({
            value: tz.value,
            label: tz.label,
        })),
        []
    );

    useEffect(() => {
        reset({
            street: teacher.teacherAddress?.street ?? "",
            city: teacher.teacherAddress?.city ?? "",
            state: teacher.teacherAddress?.state ?? "",
            country: teacher.teacherAddress?.country ?? "",
            timezone: teacher.timezone ?? "",
        });
    }, [reset, teacher.teacherAddress, teacher.timezone]);

    const handleSave = useCallback(async (values: LocationFormValues) => {
        setIsSaving(true);
        try {
            // Construir fullAddress
            const fullAddress = [
                values.street?.trim(),
                values.city,
                values.state,
                values.country
            ].filter(Boolean).join(', ');

            await repository.updateTeacher({
                token: accessToken,
                teacherId: teacher.id,
                data: {
                    address: {
                        street: values.street?.trim() || undefined,
                        city: values.city,
                        state: values.state || undefined,
                        country: values.country,
                        fullAddress,
                    },
                    timezone: values.timezone,
                },
            });
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, repository, teacher.id]);

    useEffect(() => {   
        console.log(teacher.teacherAddress);
    }, [teacher]);

    return (
        <form className="mt-6 flex flex-col gap-8" onSubmit={handleSubmit(handleSave)}>
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">{t('teacher-profile.location')}</Text>
                <Text size="text-md" colorType="tertiary">{t('teacher-profile.location_description')}</Text>
            </div>
            <Divider />
            <div className="max-w-[824px]">
                <HorizontalInputContainer 
                    label={t('teacher-profile.street')} 
                    required
                    description={t('teacher-profile.street_description')}
                >
                    <Controller
                        name="street"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField 
                                value={field.value} 
                                onChange={field.onChange} 
                                placeholder={t('teacher-profile.street_placeholder')} 
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.country')} required>
                    <Controller
                        name="country"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Combobox
                                items={countryItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.country_placeholder')}
                                searchPlaceholder={t('onboarding.nationality.search')}
                                emptyMessage={t('onboarding.nationality.empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.state')} required>
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Combobox
                                items={stateItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.state_placeholder')}
                                searchPlaceholder={t('onboarding.location.search')}
                                emptyMessage={t('onboarding.location.empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.city')} required>
                    <Controller
                        name="city"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Combobox
                                items={cityItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.city_placeholder')}
                                searchPlaceholder={t('onboarding.location.search')}
                                emptyMessage={t('onboarding.location.empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                {/* <Divider margin={20} />
                <HorizontalInputContainer 
                    label={t('teacher-profile.timezone')} 
                    required
                    description={t('teacher-profile.timezone_description')}
                >
                    <Controller
                        name="timezone"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Combobox
                                items={timezoneItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.timezone_placeholder')}
                                searchPlaceholder={t('teacher-profile.timezone_search')}
                                emptyMessage={t('teacher-profile.timezone_empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer> */}
                <div className="flex justify-end mt-4 mb-4">
                    <Button 
                        type="submit"
                        colorType="primary"
                        disabled={isSaving}
                        label={isSaving ? t('common.saving') : t('common.save')}
                    />
                </div> 
            </div>
        </form>
    );
}
