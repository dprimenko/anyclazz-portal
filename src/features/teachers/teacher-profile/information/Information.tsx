import { Button } from "@/ui-library/components/ssr/button/Button";
import type { Teacher, TeacherRepository } from "../../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "@/i18n";
import { HorizontalInputContainer } from "@/ui-library/components/horizontal-input-container/HorizontalInputContainer";
import { Controller, useForm } from "react-hook-form";
import { RichTextEditor } from "@/ui-library/components/form/rich-text-editor/RichTextEditor";
import { PresentationVideoUpload } from "./components/PresentationVideoUpload";

interface InformationFormValues {
    about: string;
    academicBackground: string;
    certifications: string;
    skills: string;
}

export function Information({ teacher, accessToken, repository, lang }: { teacher: Teacher; accessToken: string; repository: TeacherRepository; lang: string }) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [isSaving, setIsSaving] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [shouldRemoveVideo, setShouldRemoveVideo] = useState(false);

    const { control, handleSubmit, reset } = useForm<InformationFormValues>({
        defaultValues: {
            about: teacher.about ?? "",
            academicBackground: teacher.academicBackground ?? "",
            certifications: teacher.certifications ?? "",
            skills: teacher.skills ?? "",
        },
    });

    useEffect(() => {
        reset({
            about: teacher.about ?? "",
            academicBackground: teacher.academicBackground ?? "",
            certifications: teacher.certifications ?? "",
            skills: teacher.skills ?? "",
        });
    }, [reset, teacher.about, teacher.academicBackground, teacher.certifications, teacher.skills]);

    // Limpiar estado local cuando el video termine de procesarse
    useEffect(() => {
        if (teacher.videoPresentationStatus === 'ready' && videoFile) {
            setVideoFile(null);
            setShouldRemoveVideo(false);
        }
    }, [teacher.videoPresentationStatus, videoFile]);

    const handleVideoChange = useCallback((file: File | null) => {
        if (file) {
            // Guardar archivo para subir en submit
            setVideoFile(file);
            setShouldRemoveVideo(false);
        } else {
            // Marcar para eliminar en submit
            setVideoFile(null);
            setShouldRemoveVideo(true);
        }
    }, []);

    const handleSave = useCallback(async (values: InformationFormValues) => {
        setIsSaving(true);
        try {
            await repository.updateTeacher({
                token: accessToken,
                teacherId: teacher.id,
                data: {
                    about: values.about,
                    academicBackground: values.academicBackground,
                    certifications: values.certifications,
                    skills: values.skills,
                    ...(videoFile ? { videoPresentation: videoFile } : {}),
                    ...(shouldRemoveVideo && !videoFile ? { videoPresentation: null as any } : {}),
                },
            });
        } finally {
            setIsSaving(false);
        }
    }, [accessToken, repository, teacher.id, videoFile, shouldRemoveVideo]);

    return (
        <form className="mt-6 flex flex-col gap-8" onSubmit={handleSubmit(handleSave)}>
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">{t('teacher-profile.information')}</Text>
                <Text size="text-md" colorType="tertiary">{t('teacher-profile.information_description')}</Text>
            </div>
            <Divider />
            <div className="max-w-[824px]">
                <HorizontalInputContainer label={t('teacher-profile.about_me')} required={false}>
                    <Controller
                        name="about"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.about_me_placeholder')}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer 
                    label={t('teacher-profile.video_presentation')} 
                    description={t('teacher-profile.video_presentation_description')}
                    required={false}
                >
                    <PresentationVideoUpload
                        videoUrl={teacher.videoPresentation}
                        videoStatus={teacher.videoPresentationStatus}
                        onChange={handleVideoChange}
                        disabled={isSaving}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.academic_background')} required={false}>
                    <Controller
                        name="academicBackground"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.academic_background_placeholder')}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.certifications')} required={false}>
                    <Controller
                        name="certifications"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.certifications_placeholder')}
                            />
                        )}
                    />
                </HorizontalInputContainer>
                <Divider margin={20} />
                <HorizontalInputContainer label={t('teacher-profile.skills_specialties')} required={false}>
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={t('teacher-profile.skills_specialties_placeholder')}
                            />
                        )}
                    />
                </HorizontalInputContainer>
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
