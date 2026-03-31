import { type FC } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';
import type { PaymentsDashboardResponse } from '../../domain/paymentHistoryTypes';

interface StatCardProps {
    label: string;
    period: string;
    value: string | number;
}

const StatCard: FC<StatCardProps> = ({ label, period, value }) => (
    <div className="flex flex-col gap-2 p-5 rounded-xl border border-[var(--color-neutral-200)] bg-white flex-1">
        <div className="flex items-center justify-between">
            <Text size="text-sm" colorType="secondary" weight="medium">{label}</Text>
            <Text size="text-sm" colorType="tertiary">{period}</Text>
        </div>
        <Text size="text-2xl" weight="semibold" colorType="primary">{value}</Text>
    </div>
);

export interface PaymentsDashboardSummaryProps {
    dashboard: PaymentsDashboardResponse;
    lang?: string;
}

export const PaymentsDashboardSummary: FC<PaymentsDashboardSummaryProps> = ({ dashboard, lang }) => {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <StatCard
                label={t('payments.dashboard.revenue')}
                period={t('payments.dashboard.this_month')}
                value={dashboard.revenue.this_month.formatted}
            />
            <StatCard
                label={t('payments.dashboard.balance')}
                period={t('payments.dashboard.this_month')}
                value={dashboard.balance.formatted}
            />
            <StatCard
                label={t('payments.dashboard.classes_given')}
                period={t('payments.dashboard.last_30_days')}
                value={dashboard.classes.last_30_days}
            />
        </div>
    );
};
