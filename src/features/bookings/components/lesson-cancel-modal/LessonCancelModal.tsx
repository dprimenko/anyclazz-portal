import { Modal } from "@/ui-library/components/modal/Modal";
import type { BookingWithTeacher, BookingsRepository } from "../../domain/types";
import { useTranslations } from "@/i18n";
import { IconButton } from "@/ui-library/shared";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useMemo, useState } from "react";

export interface LessonCancelModalProps {
    lesson: BookingWithTeacher;
    repository: BookingsRepository;
    token: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export function LessonCancelModal({ lesson, repository, token, onClose, onSuccess }: LessonCancelModalProps) {
    const t = useTranslations();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const { cancel, loading, error } = useCancelBooking({
        repository,
        token,
        onSuccess: (response) => {
            setSuccessMessage(response.message);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);
        },
        onError: (errorMsg) => {
            console.error('Error cancelando booking:', errorMsg);
        }
    });

    const confirmCancellation = async () => {
        if (!lesson.id) return;
        
        await cancel(lesson.id);
    };

    const isPaid = useMemo(() => (lesson.status === 'confirmed'), [lesson.status]);
    const canCancel = useMemo(() => (lesson.status === 'pending' || lesson.status === 'confirmed'), [lesson.status]);

    if (!canCancel) {
        return (
            <Modal onClose={onClose} width={400} withCloseIcon fitContent>
                <div className="flex flex-col gap-4 p-6">
                    <IconButton icon="info" />
                    <Text size="text-md" weight="semibold" colorType="primary">
                        {t('common.info')}
                    </Text>
                    <Text>
                        {t('bookings.cannot_cancel_status')}
                    </Text>
                    <Space size={16} direction="vertical"/>
                    <div className="flex flex-row justify-end">
                        <Button 
                            colorType="primary"
                            label={t('common.close')}
                            onClick={onClose}
                        />
                    </div>
                </div>
            </Modal>
        );
    }

    if (successMessage) {
        return (
            <Modal onClose={onClose} width={400} withCloseIcon fitContent>
                <div className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                        <span className="text-2xl">✓</span>
                    </div>
                    <Text size="text-md" weight="semibold" colorType="primary">
                        {t('common.success')}
                    </Text>
                    <Text>{successMessage}</Text>
                </div>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose} width={400} withCloseIcon fitContent>
            <div className="flex flex-col gap-4 p-6">
                <IconButton icon="trash-can" />
                <Text size="text-md" weight="semibold" colorType="primary">
                    {t('bookings.cancel_lesson')}
                </Text>
                {isPaid ? (
                    <Text textLevel="div">
                        <div dangerouslySetInnerHTML={{ 
                            __html: `${t('bookings.cancel_with_refund_message')}<br/><br/>💡 <strong>${t('bookings.refund_info')}</strong> ${t('bookings.refund_time')}` 
                        }} />
                    </Text>
                ) : (
                    <Text>
                        {t('bookings.cancel_no_refund_message')}
                    </Text>
                )}
                
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text size="text-sm" className="text-red-600">
                            {error}
                        </Text>
                    </div>
                )}
                
                <Space size={16} direction="vertical"/>
                <div className="flex flex-row justify-end gap-3">
                    <Button 
                        colorType="secondary"
                        label={t('common.back')}
                        onClick={onClose}
                        disabled={loading}
                    />
                    <Button 
                        colorType="secondary"
                        className="!text-red-600"
                        label={loading ? t('common.cancelling') : t('bookings.confirm_cancellation')}
                        onClick={confirmCancellation}
                        disabled={loading}
                    />
                </div>
            </div>
        </Modal>
    );
}
