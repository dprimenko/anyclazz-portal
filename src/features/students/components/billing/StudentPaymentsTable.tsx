import { type FC, useState } from 'react';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { useTranslations } from '@/i18n';
import type { StudentPaymentItem, StudentPaymentStatus } from '../../domain/paymentTypes';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';

interface StudentPaymentsTableProps {
    payments: StudentPaymentItem[];
    loading?: boolean;
    lang?: string;
}

const STATUS_STYLES: Record<StudentPaymentStatus, { bg: string; text: string; iconColor: string; icon: string; border: string }> = {
    succeeded: {
        bg: '#ECFDF3',
        text: '#067647',
        iconColor: '#17B26A',
        icon: 'check',
        border: '#ABEFC6',
    },
    pending: {
        bg: '#FFFAEB',
        text: '#B54708',
        iconColor: '#F79009',
        icon: 'time',
        border: '#FEDF89',
    },
    failed: {
        bg: '#FEF3F2',
        text: '#B42318',
        iconColor: '#F04438',
        icon: 'close',
        border: '#FECDCA',
    },
    refunded: {
        bg: '#F9FAFB',
        text: '#344054',
        iconColor: '#667085',
        icon: 'refresh-ccw',
        border: '#D0D5DD',
    },
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

const PaymentRow: FC<{ payment: StudentPaymentItem; t: ReturnType<typeof useTranslations> }> = ({
    payment,
    t,
}) => {
    const statusStyle = STATUS_STYLES[payment.status] ?? STATUS_STYLES.pending;
    const [opening, setOpening] = useState(false);

    const handleOpenReceipt = () => {
        if (!payment.receipt.receipt_url) return;
        setOpening(true);
        window.open(payment.receipt.receipt_url, '_blank', 'noopener,noreferrer');
        setTimeout(() => setOpening(false), 800);
    };

    return (
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 items-center py-4 border-b border-[var(--color-neutral-200)] last:border-b-0">
            {/* Teacher */}
            <div className="flex items-center gap-3 min-w-0">
                <Avatar
                    src={payment.teacher.avatar ?? undefined}
                    alt={payment.teacher.full_name}
                    size={40}
                />
                <div className="min-w-0">
                    <Text size="text-sm" weight="medium" colorType="primary" className="truncate">
                        {payment.teacher.full_name}
                    </Text>
                    <Text size="text-xs" colorType="tertiary">
                        {t('common.teacher').toLowerCase()}
                    </Text>
                </div>
            </div>

            {/* Amount */}
            <Text size="text-sm" colorType="secondary">
                {payment.amount.formatted}
            </Text>

            {/* Date */}
            <Text size="text-sm" colorType="secondary">
                {formatDate(payment.payment_date)}
            </Text>

            {/* Status */}
            <div>
                <Chip
                    rounded
                    bgColor={statusStyle.bg}
                    textColor={statusStyle.text}
                    borderColor={statusStyle.border}>
                    <Icon icon={statusStyle.icon} iconColor={statusStyle.iconColor} iconWidth={12} iconHeight={12} />
                    {t(`payments.status.${payment.status}`)}
                </Chip>
            </div>

            {/* Receipt */}
            <div className="flex justify-center">
                {payment.receipt.available && payment.receipt.receipt_url ? (
                    <button
                        className="cursor-pointer disabled:cursor-default"
                        type="button"
                        onClick={handleOpenReceipt}
                        disabled={opening}
                    >
                        <Icon icon="download-cloud-02" iconWidth={16} iconHeight={16} />
                    </button>
                ) : (
                    <span className="text-xs text-[var(--color-neutral-400)]">—</span>
                )}
            </div>
        </div>
    );
};

export const StudentPaymentsTable: FC<StudentPaymentsTableProps> = ({
    payments,
    loading = false,
    lang,
}) => {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <ProgressIndicator size="lg" />
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16 text-center">
                <Text size="text-md" colorType="tertiary">
                    {t('payments.no_payments')}
                </Text>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                <Text size="text-xs" colorType="tertiary" weight="semibold">
                    {t('common.teacher')}
                </Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">
                    {t('common.total')}
                </Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">
                    {t('common.date')}
                </Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">
                    {t('common.status')}
                </Text>
                <div />
            </div>

            {/* Rows */}
            {payments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} t={t} />
            ))}
        </div>
    );
};
