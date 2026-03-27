import { Button } from "@/ui-library/components/ssr/button/Button";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/i18n";
import { HorizontalInputContainer } from "@/ui-library/components/horizontal-input-container/HorizontalInputContainer";
import { TextField } from "@/ui-library/components/form/text-field/TextField";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { FileUpload } from "@/ui-library/components/file-upload";
import { Controller, useForm } from "react-hook-form";
import { Combobox, type ComboboxItem } from "@/ui-library/components/form/combobox/Combobox";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Modal } from "@/ui-library/components/modal/Modal";
import { RichTextEditor } from "@/ui-library/components/form/rich-text-editor/RichTextEditor";
import { AvatarCropper } from "@/features/teachers/teacher-profile/public-information/AvatarCropper";
import { countries } from "@/features/teachers/onboarding/data/countries";
import { cities } from "@/features/teachers/onboarding/data/cities";
import { timezones } from "@/features/teachers/onboarding/data/timezones";
import type { UserProfile, UserRepository } from "../../domain/types";

const BIO_MAX_LENGTH = 1000;

interface MyDetailsFormValues {
    name: string;
    surname: string;
    email: string;
    country: string;
    city: string;
    timezone: string;
    bio: string;
}

interface MyDetailsProps {
    user: UserProfile;
    accessToken: string;
    repository: UserRepository;
    lang: string;
}

export function MyDetails({ user, accessToken, repository, lang }: MyDetailsProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarCropModalOpen, setAvatarCropModalOpen] = useState(false);
    const [avatarSourceFile, setAvatarSourceFile] = useState<string | null>(null);
    const [emailChanged, setEmailChanged] = useState(false);
    const [emailInUseError, setEmailInUseError] = useState(false);

    const { control, handleSubmit, reset, watch } = useForm<MyDetailsFormValues>({
        defaultValues: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            country: user.country ?? "",
            city: user.city ?? "",
            timezone: user.timezone ?? "",
            bio: user.bio ?? "",
        },
    });

    const watchedCountry = watch("country");
    const watchedBio = watch("bio");

    const countryItems: ComboboxItem[] = useMemo(() =>
        countries.map(c => ({
            value: c.country,
            label: c.name[lang as keyof typeof c.name] ?? c.country,
        })),
        [lang]
    );

    const cityItems: ComboboxItem[] = useMemo(() => {
        const source = watchedCountry
            ? cities.filter(c => c.country === watchedCountry)
            : cities;
        return source.map(c => ({
            value: c.city,
            label: c.name[lang as keyof typeof c.name] ?? c.city,
        }));
    }, [lang, watchedCountry]);

    const timezoneItems: ComboboxItem[] = useMemo(() =>
        timezones.map(tz => ({ value: tz.value, label: tz.label })),
        []
    );

    const bioCharactersLeft = BIO_MAX_LENGTH - (watchedBio?.replace(/<[^>]*>/g, '').length ?? 0);

    const handleAvatarFileSelect = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarSourceFile(e.target?.result as string);
            setAvatarCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleAvatarCrop = useCallback((croppedFile: File) => {
        setAvatarFile(croppedFile);
        setAvatarPreview(URL.createObjectURL(croppedFile));
        setAvatarCropModalOpen(false);
        setAvatarSourceFile(null);
    }, []);

    useEffect(() => {
        reset({
            name: user.name,
            surname: user.surname,
            email: user.email,
            country: user.country ?? "",
            city: user.city ?? "",
            timezone: user.timezone ?? "",
            bio: user.bio ?? "",
        });
    }, [reset, user]);

    const handleSave = useCallback(async (values: MyDetailsFormValues) => {
        setIsSaving(true);
        setEmailInUseError(false);
        setEmailChanged(false);
        try {
            await repository.updateUser({
                token: accessToken,
                data: {
                    name: values.name.trim(),
                    surname: values.surname.trim(),
                    email: values.email.trim(),
                    timezone: values.timezone || undefined,
                    bio: values.bio || undefined,
                    ...(avatarFile ? { avatar: avatarFile } : {}),
                    address: {
                        country: values.country.toLowerCase() || undefined,
                        city: values.city.toLowerCase() || undefined,
                    },
                },
            });

            if (values.email.trim() !== user.email) {
                setEmailChanged(true);
            }
        } catch (err) {
            if (err instanceof Error && err.message === 'EMAIL_ALREADY_IN_USE') {
                setEmailInUseError(true);
            }
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, avatarFile, repository, user.email]);

    return (
        <form className="mt-6 flex flex-col gap-8" onSubmit={handleSubmit(handleSave)}>
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">{t('user-settings.personal_info')}</Text>
                <Text size="text-md" colorType="tertiary">{t('user-settings.personal_info_description')}</Text>
            </div>
            <Divider />
            {emailChanged && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{t('user-settings.email_changed_warning')}</span>
                </div>
            )}
            {emailInUseError && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    <span className="shrink-0 mt-0.5">⛔</span>
                    <span>{t('user-settings.email_already_in_use')}</span>
                </div>
            )}
            <div className="max-w-[824px]">
                {/* Name */}
                <HorizontalInputContainer label={t('user-settings.name')} required>
                    <div className="flex gap-3">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField value={field.value} onChange={field.onChange} placeholder={t('user-settings.name_placeholder')} />
                            )}
                        />
                        <Controller
                            name="surname"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField value={field.value} onChange={field.onChange} placeholder={t('user-settings.surname_placeholder')} />
                            )}
                        />
                    </div>
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* Email */}
                <HorizontalInputContainer label={t('user-settings.email')} required>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder={t('user-settings.email_placeholder')} />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* Avatar */}
                <HorizontalInputContainer
                    label={t('user-settings.photo')}
                    description={t('user-settings.photo_description')}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={avatarPreview ?? user.avatar ?? undefined}
                                alt={`${user.name} ${user.surname}`}
                                size={64}
                            />
                        </div>
                        <FileUpload
                            accept="image/jpeg,image/png"
                            maxSize={10 * 1024 * 1024}
                            recommendedSize={t('user-settings.photo_upload_format')}
                            onFileSelect={handleAvatarFileSelect}
                            label={t('user-settings.photo_upload_label')}
                            description={t('user-settings.photo_upload_description')}
                            icon="upload-cloud"
                            className="w-full"
                            disabled={isSaving}
                        />
                    </div>
                </HorizontalInputContainer>

                {avatarCropModalOpen && avatarSourceFile && (
                    <Modal fitContent onClose={() => setAvatarCropModalOpen(false)}>
                        <div className="flex flex-col gap-6 p-6">
                            <div>
                                <Text textLevel="h2" colorType="primary" size="text-md" weight="semibold">
                                    {t('teacher-profile.avatar_crop_title')}
                                </Text>
                                <Text colorType="tertiary" size="text-sm">
                                    {t('teacher-profile.avatar_crop_subtitle')}
                                </Text>
                            </div>
                            <AvatarCropper
                                imageSrc={avatarSourceFile}
                                onCrop={handleAvatarCrop}
                                onCancel={() => {
                                    setAvatarCropModalOpen(false);
                                    setAvatarSourceFile(null);
                                }}
                            />
                        </div>
                    </Modal>
                )}
                <Divider margin={20} />

                {/* Country */}
                <HorizontalInputContainer label={t('user-settings.country')} required>
                    <Controller
                        name="country"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Combobox
                                items={countryItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('user-settings.country_placeholder')}
                                searchPlaceholder={t('user-settings.country_search')}
                                emptyMessage={t('user-settings.country_empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* City */}
                <HorizontalInputContainer label={t('user-settings.city')}>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                items={cityItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('user-settings.city_placeholder')}
                                searchPlaceholder={t('user-settings.city_search')}
                                emptyMessage={t('user-settings.city_empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* Timezone */}
                <HorizontalInputContainer label={t('user-settings.timezone')}>
                    <Controller
                        name="timezone"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                items={timezoneItems}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('user-settings.timezone_placeholder')}
                                searchPlaceholder={t('teacher-profile.timezone_search')}
                                emptyMessage={t('teacher-profile.timezone_empty')}
                                fullWidth
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* Bio */}
                <HorizontalInputContainer
                    label={t('user-settings.bio')}
                    description={t('user-settings.bio_description')}
                >
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="bio"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t('user-settings.bio_placeholder')}
                                    disabled={isSaving}
                                />
                            )}
                        />
                        <Text size="text-xs" colorType="tertiary" className="text-right">
                            {t('user-settings.bio_characters_left').replace('{{count}}', String(Math.max(0, bioCharactersLeft)))}
                        </Text>
                    </div>
                </HorizontalInputContainer>
                <Divider margin={20} />

                <div className="flex justify-end mb-4">
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