import { Modal } from "@/ui-library/components/modal/Modal";
import { useTranslations } from "@/i18n";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useState } from "react";
import { RatingStars } from "../rating-stars/RatingStars";
import type { ApiTeacherRepository } from "@/features/teachers/infrastructure/ApiTeacherRepository";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Textarea } from "@/ui-library/components/form/text-area/Textarea";

export interface RateTutorModalProps {
    teacherId: string;
    teacherName: string;
    repository: ApiTeacherRepository;
    token: string;
    onClose: () => void;
    onSuccess?: () => void;
    lang?: string;
}

export function RateTutorModal({ 
    teacherId, 
    teacherName,
    repository, 
    token, 
    onClose, 
    onSuccess,
    lang 
}: RateTutorModalProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError(t('reviews.overall_rating'));
            return;
        }

        if (!comment.trim()) {
            setError(t('reviews.leave_comment'));
            return;
        }

        if (comment.trim().length < 10) {
            setError(t('reviews.comment_too_short'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await repository.createReview({
                token,
                teacherId,
                rating,
                comment: comment.trim(),
            });

            setSuccess(true);
            
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);
        } catch (err: any) {
            console.error('Error submitting review:', err);
            
            // Check error type - FetchClient throws errors with cause property
            const errorMessage = err?.cause || err?.error || err?.message || '';
            
            if (errorMessage.includes('already reviewed') || err?.status === 409) {
                setError(t('reviews.already_reviewed'));
            } else if (errorMessage.includes('10 characters')) {
                setError(t('reviews.comment_too_short'));
            } else {
                setError(t('reviews.error_message'));
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Modal onClose={onClose} width={400} fitContent>
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: '#FFF4E7' }}>
                        <Icon icon="check-rounded" iconWidth={20} iconHeight={20} iconColor="#F4A43A" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Text size="text-md" weight="semibold" colorType="primary">
                            {t('reviews.success_title')}
                        </Text>
                        <Text size="text-sm" colorType="tertiary">{t('reviews.success_message')}</Text>
                    </div>
                    <Button 
                        colorType="primary"
                        label={t('common.close')}
                        onClick={onClose}
                        fullWidth
                    />
                </div>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose} width={480} withCloseIcon fitContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <Text size="text-md" weight="semibold" colorType="primary">
                        {t('reviews.rate_tutor_title', { name: teacherName })}
                    </Text>
                    <Text size="text-sm" colorType="tertiary">
                        {t('reviews.rate_tutor_subtitle')}
                    </Text>
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-2">
                    <Text size="text-sm" weight="medium" colorType="tertiary">
                        {t('reviews.overall_rating')} <span style={{ color: 'var(--color-primary-700)' }}>*</span>
                    </Text>
                    <RatingStars 
                        rating={rating} 
                        onRatingChange={setRating}
                        size={20}
                    />
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-2">
                    <Text size="text-sm" weight="medium" colorType="tertiary">
                        {t('reviews.leave_comment')} <span style={{ color: 'var(--color-primary-700)' }}>*</span>
                    </Text>
                    <Textarea
                        value={comment}
                        onChange={setComment}
                        placeholder={t('reviews.comment_placeholder')}
                        rows={5}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Icon icon="alert-circle" iconWidth={20} iconHeight={20} iconColor="#DC2626" />
                        <Text size="text-sm" className="text-red-600">
                            {error}
                        </Text>
                    </div>
                )}

                <Space size={8} direction="vertical" />

                {/* Actions */}
                <div className="flex flex-row gap-3 justify-end">
                    <Button 
                        colorType="tertiary"
                        label={t('common.cancel')}
                        onClick={onClose}
                        disabled={loading}
                    />
                    <Button 
                        type="submit"
                        colorType="primary"
                        label={loading ? t('reviews.submitting') : t('reviews.submit_review')}
                        disabled={loading || rating === 0 || comment.trim().length < 10}
                    />
                </div>
            </form>
        </Modal>
    );
}
