import { Notification } from '@/ui-library/components/notification/Notification';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useMemo } from 'react';

export function TeacherReviewNotification({ reviewStatus }: { reviewStatus?: string }) {
    const message = useMemo(() => {
        if (reviewStatus === 'rejected') {
            return (
                <span>
                    <strong>Your profile has not been approved. Please contact support for more information.</strong>
                </span>
            );
        }

        if (reviewStatus === 'confirmed') {
            return (
                <span>
                    <strong>Your profile has been approved!</strong> You can now start receiving bookings. Make sure your profile is fully completed and published.
                </span>
            );
        }

        return (
            <span>
                <strong>Your profile is currently under review by the AnyClazz team.</strong> In the meantime, you can keep completing your profile to increase your chances of approval.
            </span>
        );
    }, [reviewStatus]);

    const actions = useMemo(() => {
        if (reviewStatus === 'rejected') {
            return (
                <a href="/contact-us"><Button label='Contact support' colorType='primary' size='lg' fullWidth></Button></a>
            );
        }

        return (
            <a href="/profile?tab=public_information"><Button label='Complete profile' colorType='primary' size='lg' fullWidth></Button></a>
        );
    }, [reviewStatus]);

    return (
        <Notification 
            colorType="secondary" 
            text={message}
            actions={actions} 
            onClose={() => {}}
        />
    );
}