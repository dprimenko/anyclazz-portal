import { Button } from "@/ui-library/components/ssr/button/Button";
import type { Teacher } from "../../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";
import { HorizontalInputContainer } from "@/ui-library/components/horizontal-input-container/HorizontalInputContainer";
import { TextField } from "@/ui-library/components/form/text-field/TextField";
import { Textarea } from "@/ui-library/components/form/text-area/Textarea";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { FileUpload } from "@/ui-library/components/file-upload";
import { Controller, useForm } from "react-hook-form";
import type { TeacherRepository } from "../../domain/types";

interface PublicInformationFormValues {
    name: string;
    surname: string;
    shortPresentation: string;
}

export function PublicInformation({ teacher, accessToken, repository }: { teacher: Teacher; accessToken: string; repository: TeacherRepository }) {
    const t = useTranslations();
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [portraitFile, setPortraitFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<PublicInformationFormValues>({
        defaultValues: {
            name: teacher.name,
            surname: teacher.surname,
            shortPresentation: teacher.shortPresentation ?? "",
        },
    });

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarSelect = useCallback((file: File) => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }, [avatarPreview]);

    const handleAvatarRemove = useCallback(() => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
    }, [avatarPreview]);

    const handlePortraitSelect = useCallback((file: File) => {
        if (portraitPreview) {
            URL.revokeObjectURL(portraitPreview);
        }
        setPortraitFile(file);
        setPortraitPreview(URL.createObjectURL(file));
    }, [portraitPreview]);

    useEffect(() => {
        reset({
            name: teacher.name,
            surname: teacher.surname,
            shortPresentation: teacher.shortPresentation ?? "",
        });
    }, [reset, teacher.name, teacher.surname, teacher.shortPresentation]);

    const handleSave = useCallback(async (values: PublicInformationFormValues) => {
        setIsSaving(true);
        try {
            await repository.updateTeacher({
                token: accessToken,
                teacherId: teacher.id,
                data: {
                    name: values.name.trim(),
                    surname: values.surname.trim(),
                    shortPresentation: values.shortPresentation.trim(),
                    ...(avatarFile ? { avatar: avatarFile } : {}),
                    ...(portraitFile ? { portrait: portraitFile } : {}),
                },
            });
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, avatarFile, portraitFile, repository, teacher.id]);

    return (
        <form className="mt-6 flex flex-col gap-8" onSubmit={handleSubmit(handleSave)}>
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">{t('teacher-profile.public_information')}</Text>
                <Text size="text-md" colorType="tertiary">{t('teacher-profile.public_information_description')}</Text>
            </div>
            <Divider />
            <div>
                <HorizontalInputContainer label={t('teacher-profile.name')} required >
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.name_placeholder')} className="max-w-[512px]"/>
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.surname')} required >
                    <Controller
                        name="surname"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.surname_placeholder')} className="max-w-[512px]"/>
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.job-title')} >
                    <Controller
                        name="shortPresentation"
                        control={control}
                        render={({ field }) => (
                            <Textarea value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.job_title_placeholder')} className="max-w-[512px]" rows={3} />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('teacher-profile.avatar_label')}
                    description={t('teacher-profile.avatar_description')}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <Avatar
                            src={avatarPreview ?? teacher.avatar}
                            alt={`${teacher.name} ${teacher.surname}`}
                            size={72}
                            hasOutline
                        />
                        <div className="flex items-center gap-4">
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        handleAvatarSelect(file);
                                    }
                                }}
                            />
                            <Button
                                onlyText
                                colorType="primary"
                                label={t('teacher-profile.update_photo')}
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={isSaving}
                            />
                            <Button
                                onlyText
                                colorType="secondary"
                                label={t('teacher-profile.delete')}
                                onClick={handleAvatarRemove}
                                className="text-[var(--color-error-600)]"
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('teacher-profile.portrait_label')}
                    description={t('teacher-profile.portrait_description')}
                >
                    <div className="flex flex-col gap-4">
                        {(portraitPreview || teacher.portrait) ? (
                            <img
                                src={portraitPreview ?? teacher.portrait}
                                alt={t('teacher-profile.portrait_alt')}
                                className="w-full max-w-[512px] rounded-xl border border-neutral-200 object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full max-w-[512px] h-[170px] rounded-xl border border-neutral-200 bg-neutral-50">
                                <Text size="text-sm" colorType="tertiary">{t('teacher-profile.portrait_empty')}</Text>
                            </div>
                        )}
                        <FileUpload
                            accept="image/jpeg,image/png"
                            maxSize={10 * 1024 * 1024}
                            recommendedSize={t('teacher-profile.portrait_upload_format')}
                            onFileSelect={handlePortraitSelect}
                            label={t('teacher-profile.portrait_upload_label')}
                            description={t('teacher-profile.portrait_upload_description')}
                            icon="image"
                            className="w-full max-w-[512px]"
                            disabled={isSaving}
                        />
                    </div>
                </HorizontalInputContainer>
            </div>
            
            <div className="flex justify-end mt-8">
                <Button 
                    type="submit"
                    colorType="primary"
                    disabled={isSaving}
                    label={isSaving ? t('common.saving') : t('common.save')}
                />
            </div> 
            <Space size={16} />
        </form>
    );
}