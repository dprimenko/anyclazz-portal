import { Notification } from '@/ui-library/components/notification/Notification';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useMemo } from 'react';
import { useTranslations } from '@/i18n';

export function TeacherReviewNotification({ reviewStatus }: { reviewStatus?: string }) {
    const t = useTranslations();

    const message = useMemo(() => {
        if (reviewStatus === 'rejected') {
            return (
                <span>
                    <strong>{t('review-notification.rejected_title')}</strong> {t('review-notification.rejected_body')}
                </span>
            );
        }

        if (reviewStatus === 'confirmed') {
            return (
                <span>
                    <strong>{t('review-notification.confirmed_title')}</strong> {t('review-notification.confirmed_body')}
                </span>
            );
        }

        return (
            <span>
                <strong>{t('review-notification.pending_title')}</strong> {t('review-notification.pending_body')}
            </span>
        );
    }, [reviewStatus, t]);

    const actions = useMemo(() => {
        if (reviewStatus === 'rejected') {
            return (
                <a href="/contact"><Button label={t('review-notification.contact_support')} colorType='primary' size='lg' fullWidth /></a>
            );
        }

        return (
            <a href="/profile?tab=availability_and_modalities"><Button label={t('review-notification.complete_profile')} colorType='primary' size='lg' fullWidth /></a>
        );
    }, [reviewStatus, t]);

    return (
        <Notification 
            colorType="secondary" 
            text={message}
            actions={actions} 
            onClose={() => {}}
        />
    );
}