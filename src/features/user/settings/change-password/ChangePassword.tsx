import { useCallback, useState } from "react";
import { useTranslations } from "@/i18n";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { HorizontalInputContainer } from "@/ui-library/components/horizontal-input-container/HorizontalInputContainer";
import { TextField } from "@/ui-library/components/form/text-field/TextField";
import type { UserRepository } from "../../domain/types";

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

interface ChangePasswordProps {
    accessToken: string;
    repository: UserRepository;
    lang: string;
}

export function ChangePassword({ accessToken, repository, lang }: ChangePasswordProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wrongPasswordError, setWrongPasswordError] = useState(false);

    const { control, handleSubmit, reset, getValues } = useForm<ChangePasswordFormValues>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },
    });

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess(false);
        setWrongPasswordError(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset();
        setWrongPasswordError(false);
    };

    const handleSave = useCallback(async (values: ChangePasswordFormValues) => {
        setIsSaving(true);
        setWrongPasswordError(false);
        setSuccess(false);
        try {
            await repository.changePassword({
                token: accessToken,
                data: {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    newPasswordConfirmation: values.newPasswordConfirmation,
                },
            });
            setSuccess(true);
            setIsEditing(false);
            reset();
        } catch (err) {
            if (err instanceof Error && err.message === 'WRONG_CURRENT_PASSWORD') {
                setWrongPasswordError(true);
            }
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, repository, reset]);

    return (
        <form className="mt-6 flex flex-col gap-8" onSubmit={handleSubmit(handleSave)}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-[2px]">
                    <Text size="text-lg" weight="semibold" colorType="primary">{t('user-settings.password_section_title')}</Text>
                    <Text size="text-md" colorType="tertiary">{t('user-settings.password_section_description')}</Text>
                </div>
                {!isEditing && (
                    <Button type="button" colorType="secondary" label={t('common.edit')} onClick={handleEdit} />
                )}
            </div>
            <Divider />
            {success && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                    <span className="shrink-0 mt-0.5">✅</span>
                    <span>{t('user-settings.password_changed_success')}</span>
                </div>
            )}
            {wrongPasswordError && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    <span className="shrink-0 mt-0.5">⛔</span>
                    <span>{t('user-settings.wrong_current_password')}</span>
                </div>
            )}
            <div className="max-w-[824px]">
                {/* Current password */}
                <HorizontalInputContainer label={t('user-settings.current_password')} required>
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{ required: isEditing }}
                        render={({ field }) => (
                            <TextField
                                type="password"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="••••••••"
                                disabled={!isEditing}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* New password */}
                <HorizontalInputContainer
                    label={t('user-settings.new_password')}
                    description={t('user-settings.new_password_hint')}
                    required
                >
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{ required: isEditing, minLength: isEditing ? 8 : undefined }}
                        render={({ field }) => (
                            <TextField
                                type="password"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="••••••••"
                                disabled={!isEditing}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />

                {/* Confirm new password */}
                <HorizontalInputContainer label={t('user-settings.confirm_new_password')} required>
                    <Controller
                        name="newPasswordConfirmation"
                        control={control}
                        rules={{
                            required: isEditing,
                            validate: isEditing ? (value) => value === getValues('newPassword') : undefined,
                        }}
                        render={({ field }) => (
                            <TextField
                                type="password"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="••••••••"
                                disabled={!isEditing}
                            />
                        )}
                    />
                </HorizontalInputContainer>

                {isEditing && (
                    <>
                        <Divider margin={20} />
                        <div className="flex justify-end gap-3 mb-4">
                            <Button
                                type="button"
                                colorType="secondary"
                                label={t('common.cancel')}
                                onClick={handleCancel}
                                disabled={isSaving}
                            />
                            <Button
                                type="submit"
                                colorType="primary"
                                disabled={isSaving}
                                label={isSaving ? t('common.saving') : t('common.save')}
                            />
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}
