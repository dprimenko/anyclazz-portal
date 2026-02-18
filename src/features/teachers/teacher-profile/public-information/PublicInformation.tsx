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
import type { TeacherLanguage, TeacherRepository } from "../../domain/types";
import { LanguageSelector } from "../../onboarding/components/LanguageSelector";
import { RectangleSelectionGroup, type RectangleSelectionGroupItem } from "@/ui-library/components/form/rectangle-selection-group";
import { Dropdown, type DropdownItem } from "@/ui-library/components/form/dropdown";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { STUDENT_LEVELS, SUBJECT_CATEGORIES, SUBJECTS_BY_CATEGORY } from "../../onboarding/constants";
import { ImageCropper } from "./ImageCropper";
import { AvatarCropper } from "./AvatarCropper";
import { Modal } from "@/ui-library/components/modal/Modal";

interface PublicInformationFormValues {
    name: string;
    surname: string;
    shortPresentation: string;
    speaksLanguages: TeacherLanguage[];
    studentLevelId: string;
    subjectCategoryId: string;
    subjectId: string;
}

export function PublicInformation({ teacher, accessToken, repository, lang }: { teacher: Teacher; accessToken: string; repository: TeacherRepository; lang: string }) {
    const t = useTranslations();
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [portraitFile, setPortraitFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [portraitSourceFile, setPortraitSourceFile] = useState<string | null>(null);
    const [avatarCropModalOpen, setAvatarCropModalOpen] = useState(false);
    const [avatarSourceFile, setAvatarSourceFile] = useState<string | null>(null);

    const { control, handleSubmit, reset, watch } = useForm<PublicInformationFormValues>({
        defaultValues: {
            name: teacher.name,
            surname: teacher.surname,
            shortPresentation: teacher.shortPresentation ?? "",
            speaksLanguages: teacher.speaksLanguages ?? [],
            studentLevelId: teacher.studentLevel?.id ?? "",
            subjectCategoryId: teacher.subjectCategory?.id ?? "",
            subjectId: teacher.subject?.id ?? "",
        },
    });

    const watchedCategory = watch("subjectCategoryId");

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarSelect = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setAvatarSourceFile(src);
            setAvatarCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleAvatarRemove = useCallback(() => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
    }, [avatarPreview]);

    const handleAvatarCrop = useCallback((croppedFile: File) => {
        setAvatarFile(croppedFile);
        setAvatarPreview(URL.createObjectURL(croppedFile));
        setAvatarCropModalOpen(false);
        setAvatarSourceFile(null);
    }, []);

    const handlePortraitSelect = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setPortraitSourceFile(src);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const handlePortraitCrop = useCallback((croppedFile: File) => {
        setPortraitFile(croppedFile);
        setPortraitPreview(URL.createObjectURL(croppedFile));
        setCropModalOpen(false);
        setPortraitSourceFile(null);
    }, []);

    useEffect(() => {
        reset({
            name: teacher.name,
            surname: teacher.surname,
            shortPresentation: teacher.shortPresentation ?? "",
            speaksLanguages: teacher.speaksLanguages ?? [],
            studentLevelId: teacher.studentLevel?.id ?? "",
            subjectCategoryId: teacher.subjectCategory?.id ?? "",
            subjectId: teacher.subject?.id ?? "",
        });
    }, [reset, teacher.name, teacher.surname, teacher.shortPresentation, teacher.speaksLanguages, teacher.studentLevel?.id, teacher.subjectCategory?.id, teacher.subject?.id]);

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
                    speaksLanguages: values.speaksLanguages,
                    studentLevelId: values.studentLevelId,
                    subjectCategoryId: values.subjectCategoryId,
                    subjectId: values.subjectId,
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
            <div className="max-w-[824px]">
                <HorizontalInputContainer label={t('teacher-profile.name')} required >
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.name_placeholder')} />
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
                            <TextField value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.surname_placeholder')} />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.job-title')} >
                    <Controller
                        name="shortPresentation"
                        control={control}
                        render={({ field }) => (
                            <Textarea value={field.value} onChange={field.onChange} placeholder={t('teacher-profile.job_title_placeholder')} rows={3} />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('teacher-profile.avatar_label')}
                    description={t('teacher-profile.avatar_description')}
                >
                    <div className="flex flex-row justify-between">
                        <Avatar
                            src={avatarPreview ?? teacher.avatar}
                            alt={`${teacher.name} ${teacher.surname}`}
                            size={64}
                        />
                        <div className="flex flex-row">
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
                            <div className="flex flex-row">
                                <Button
                                    onlyText
                                    colorType="secondary"
                                    label={t('teacher-profile.delete')}
                                    onClick={handleAvatarRemove}
                                    className="text-[var(--color-error-600)]"
                                    disabled={isSaving}
                                />
                                <Button
                                    onlyText
                                    colorType="primary"
                                    label={t('teacher-profile.update_photo')}
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={isSaving}
                                />
                                
                            </div>
                        </div>
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
                <HorizontalInputContainer
                    label={t('teacher-profile.portrait_label')}
                    description={t('teacher-profile.portrait_description')}
                >
                    <div className="flex flex-col gap-4">
                        {(portraitPreview || teacher.portrait) ? (
                            <img
                                src={portraitPreview ?? teacher.portrait}
                                alt={t('teacher-profile.portrait_alt')}
                                className="w-full h-[170px] rounded-xl border border-neutral-200 object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-[170px] rounded-xl border border-neutral-200 bg-neutral-50">
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
                            className="w-full"
                            disabled={isSaving}
                        />
                    </div>
                </HorizontalInputContainer>

                {cropModalOpen && portraitSourceFile && (
                    <Modal fitContent onClose={() => setCropModalOpen(false)}>
                        <div className="flex flex-col gap-6 p-6">
                            <div>
                                <Text textLevel="h2" colorType="primary" size="text-md" weight="semibold">
                                    {t('teacher-profile.portrait_crop_title')}
                                </Text>
                                <Text colorType="tertiary" size="text-sm">
                                    {t('teacher-profile.portrait_crop_subtitle')}
                                </Text>
                            </div>
                            <ImageCropper
                                imageSrc={portraitSourceFile}
                                onCrop={handlePortraitCrop}
                                onCancel={() => {
                                    setCropModalOpen(false);
                                    setPortraitSourceFile(null);
                                }}
                            />
                        </div>
                    </Modal>
                )}
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('teacher-profile.languages_spoken')}
                    description={t('teacher-profile.languages_spoken_description')}
                    required
                >
                    <Controller
                        name="speaksLanguages"
                        control={control}
                        rules={{ 
                            validate: (langs) => langs.length > 0 && langs.every(l => l.language && l.proficiencyLevel)
                        }}
                        render={({ field }) => (
                            <LanguageSelector
                                lang={lang}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('onboarding.student_levels')}
                    required
                >
                    <Controller
                        name="studentLevelId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <RectangleSelectionGroup
                                items={STUDENT_LEVELS.map(level => ({
                                    id: level.id,
                                    children: () => (
                                        <span className="text-sm font-medium text-[var(--color-neutral-900)]">
                                            {level.name[lang as keyof typeof level.name]}
                                        </span>
                                    ),
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                colorType="primary"
                                cnn={{ container: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('onboarding.category')}
                    required
                >
                    <Controller
                        name="subjectCategoryId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <RectangleSelectionGroup
                                items={SUBJECT_CATEGORIES.map(cat => ({
                                    id: cat.id,
                                    children: () => (
                                        <span className="text-sm font-medium text-[var(--color-neutral-900)]">
                                            {cat.name[lang as keyof typeof cat.name]}
                                        </span>
                                    ),
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                colorType="primary"
                                cnn={{ container: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer
                    label={t('onboarding.select_main_area')}
                    required
                >
                    <Controller
                        name="subjectId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Dropdown
                                items={(SUBJECTS_BY_CATEGORY[watchedCategory] || []).map(subj => ({
                                    value: subj.id,
                                    label: subj.name[lang as keyof typeof subj.name],
                                    renderItem: (item, isSelected) => (
                                        <div className="flex items-center justify-between w-full">
                                            <span>{item.label}</span>
                                            {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[var(--color-primary-700)]" />}
                                        </div>
                                    ),
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('onboarding.select_main_area')}
                                fullWidth
                            />
                        )}
                    />
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