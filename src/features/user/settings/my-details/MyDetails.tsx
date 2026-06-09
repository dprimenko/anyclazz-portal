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
import { Modal } from "@/ui-library/components/modal/Modal";
import { RichTextEditor } from "@/ui-library/components/form/rich-text-editor/RichTextEditor";
import { AvatarCropper } from "@/features/teachers/teacher-profile/public-information/AvatarCropper";
import { countries } from "@/features/teachers/onboarding/data/countries";
import { cities } from "@/features/teachers/onboarding/data/cities";
import { timezones } from "@/features/teachers/onboarding/data/timezones";
import type { UserProfile, UserRepository } from "../../domain/types";

const BIO_MAX_LENGTH = 1000;
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

function formatIban(value: string): string {
    const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return raw.match(/.{1,4}/g)?.join(' ') ?? raw;
}

function validateIban(formatted: string): boolean {
    const raw = formatted.replace(/\s/g, '').toUpperCase();
    if (raw.length < 5 || raw.length > 34) return false;
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) return false;
    const rearranged = raw.slice(4) + raw.slice(0, 4);
    const numeric = rearranged
        .split('')
        .map((c) => (c >= 'A' && c <= 'Z' ? String(c.charCodeAt(0) - 55) : c))
        .join('');
    let remainder = 0;
    for (let i = 0; i < numeric.length; i += 7) {
        remainder = parseInt(remainder + numeric.slice(i, i + 7), 10) % 97;
    }
    return remainder === 1;
}

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
    role?: string;
    teacherId?: string;
    initialIban?: string | null;
    initialAccountHolderName?: string | null;
    initialAccountNumber?: string | null;
    initialRoutingNumber?: string | null;
}

export function MyDetails({ user, accessToken, repository, lang, role, teacherId, initialIban, initialAccountHolderName, initialAccountNumber, initialRoutingNumber }: MyDetailsProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const isTeacher = role === 'teacher';

    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarCropModalOpen, setAvatarCropModalOpen] = useState(false);
    const [avatarSourceFile, setAvatarSourceFile] = useState<string | null>(null);
    const [emailChanged, setEmailChanged] = useState(false);
    const [emailInUseError, setEmailInUseError] = useState(false);

    // Bank fields (teacher only)
    const [bankType, setBankType] = useState<'iban' | 'us'>(initialIban ? 'iban' : 'us');
    const [iban, setIban] = useState(initialIban ? formatIban(initialIban) : '');
    const [accountHolderName, setAccountHolderName] = useState(initialAccountHolderName ?? '');
    const [ibanTouched, setIbanTouched] = useState(false);
    const [accountNumber, setAccountNumber] = useState(initialAccountNumber ?? '');
    const [routingNumber, setRoutingNumber] = useState(initialRoutingNumber ?? '');
    const [routingTouched, setRoutingTouched] = useState(false);

    const ibanRaw = iban.replace(/\s/g, '');
    const ibanValid = ibanRaw.length > 0 && validateIban(iban);
    const ibanError = ibanTouched && ibanRaw.length > 0 && !ibanValid;

    const routingValid = /^\d{9}$/.test(routingNumber.replace(/\s/g, ''));
    const routingError = routingTouched && routingNumber.length > 0 && !routingValid;

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

            // Save bank details for teachers
            if (isTeacher && teacherId) {
                const bankBody = bankType === 'iban'
                    ? { iban: ibanRaw || null, accountHolderName: accountHolderName.trim() || null, accountNumber: null, routingNumber: null }
                    : { iban: null, accountHolderName: accountHolderName.trim() || null, accountNumber: accountNumber.trim() || null, routingNumber: routingNumber.trim() || null };
                await fetch(`${API_URL}/teachers/${teacherId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bankBody),
                });
            }
        } catch (err) {
            if (err instanceof Error && err.message === 'EMAIL_ALREADY_IN_USE') {
                setEmailInUseError(true);
            }
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, avatarFile, repository, user.email, isTeacher, teacherId, bankType, ibanRaw, accountHolderName, accountNumber, routingNumber]);

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

                {/* Bank details — teachers only */}
                {isTeacher && (
                    <>
                        <div className="flex flex-col gap-[2px] mb-5">
                            <Text size="text-lg" weight="semibold" colorType="primary">{t('user-settings.bank_details')}</Text>
                            <Text size="text-md" colorType="tertiary">{t('user-settings.bank_details_description')}</Text>
                        </div>
                        <Divider margin={20} />

                        {/* Bank type toggle */}
                        <HorizontalInputContainer label="">
                            <div className="flex rounded-lg border border-[var(--color-neutral-300)] overflow-hidden text-sm font-medium w-full">
                                <button
                                    type="button"
                                    onClick={() => setBankType('iban')}
                                    disabled={isSaving}
                                    className={[
                                        'flex-1 py-2 px-3 transition-colors disabled:opacity-50',
                                        bankType === 'iban'
                                            ? 'bg-[var(--color-primary-700)] text-white'
                                            : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)]',
                                    ].join(' ')}
                                >
                                    {t('onboarding.step5.bank_type_iban')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBankType('us')}
                                    disabled={isSaving}
                                    className={[
                                        'flex-1 py-2 px-3 transition-colors border-l border-[var(--color-neutral-300)] disabled:opacity-50',
                                        bankType === 'us'
                                            ? 'bg-[var(--color-primary-700)] text-white'
                                            : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)]',
                                    ].join(' ')}
                                >
                                    {t('onboarding.step5.bank_type_us')}
                                </button>
                            </div>
                        </HorizontalInputContainer>
                        <Divider margin={20} />

                        {/* Account holder name */}
                        <HorizontalInputContainer label={t('onboarding.step5.account_holder_name')}>
                            <input
                                type="text"
                                value={accountHolderName}
                                onChange={(e) => setAccountHolderName(e.target.value)}
                                placeholder={t('onboarding.step5.account_holder_name_placeholder')}
                                disabled={isSaving}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--color-neutral-300)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)] focus:border-transparent disabled:opacity-50"
                            />
                        </HorizontalInputContainer>
                        <Divider margin={20} />

                        {bankType === 'iban' ? (
                            <>
                                {/* IBAN with mask + validation */}
                                <HorizontalInputContainer label={t('onboarding.step5.iban')}>
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="text"
                                                autoCorrect="off"
                                                autoCapitalize="characters"
                                                spellCheck={false}
                                                value={iban}
                                                onChange={(e) => setIban(formatIban(e.target.value))}
                                                onBlur={() => setIbanTouched(true)}
                                                placeholder={t('onboarding.step5.iban_placeholder')}
                                                maxLength={42}
                                                disabled={isSaving}
                                                className={[
                                                    'w-full px-3 py-2 pr-9 rounded-lg border bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50',
                                                    ibanError
                                                        ? 'border-red-400 focus:ring-red-300'
                                                        : ibanValid
                                                            ? 'border-green-400 focus:ring-green-300'
                                                            : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-700)]',
                                                ].join(' ')}
                                            />
                                            {ibanValid && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-base leading-none">✓</span>
                                            )}
                                            {ibanError && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-base leading-none">✗</span>
                                            )}
                                        </div>
                                        {ibanError && (
                                            <p className="text-xs text-red-500">{t('onboarding.step5.iban_invalid')}</p>
                                        )}
                                    </div>
                                </HorizontalInputContainer>
                                <Divider margin={20} />
                            </>
                        ) : (
                            <>
                                {/* US account number */}
                                <HorizontalInputContainer label={t('onboarding.step5.account_number')}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder={t('onboarding.step5.account_number_placeholder')}
                                        disabled={isSaving}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-neutral-300)] bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)] focus:border-transparent disabled:opacity-50"
                                    />
                                </HorizontalInputContainer>
                                <Divider margin={20} />

                                {/* US routing number */}
                                <HorizontalInputContainer label={t('onboarding.step5.routing_number')}>
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={routingNumber}
                                                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                                                onBlur={() => setRoutingTouched(true)}
                                                placeholder={t('onboarding.step5.routing_number_placeholder')}
                                                maxLength={9}
                                                disabled={isSaving}
                                                className={[
                                                    'w-full px-3 py-2 pr-9 rounded-lg border bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50',
                                                    routingError
                                                        ? 'border-red-400 focus:ring-red-300'
                                                        : routingValid && routingNumber.length > 0
                                                            ? 'border-green-400 focus:ring-green-300'
                                                            : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-700)]',
                                                ].join(' ')}
                                            />
                                            {routingValid && routingNumber.length > 0 && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-base leading-none">✓</span>
                                            )}
                                            {routingError && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-base leading-none">✗</span>
                                            )}
                                        </div>
                                        {routingError && (
                                            <p className="text-xs text-red-500">{t('onboarding.step5.routing_number_invalid')}</p>
                                        )}
                                    </div>
                                </HorizontalInputContainer>
                                <Divider margin={20} />
                            </>
                        )}
                    </>
                )}

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
