import { useState, useEffect, useMemo, type FC } from 'react';
import { useTranslations } from '@/i18n';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { StudentPaymentsTable } from './StudentPaymentsTable';
import { StudentPaymentsRepository } from '../../infrastructure/StudentPaymentsRepository';
import type { GetStudentPaymentsResponse } from '../../domain/paymentTypes';

const ITEMS_PER_PAGE = 10;

export interface PaginatedStudentPaymentsProps {
    initialPayments: GetStudentPaymentsResponse;
    accessToken: string;
    lang?: string;
}

export const PaginatedStudentPayments: FC<PaginatedStudentPaymentsProps> = ({
    initialPayments,
    accessToken,
    lang,
}) => {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    const repository = useMemo(() => new StudentPaymentsRepository(), []);
    const [data, setData] = useState(initialPayments);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (targetPage: number) => {
        setLoading(true);
        try {
            const result = await repository.getPaymentHistory({
                token: accessToken,
                page: targetPage,
                limit: ITEMS_PER_PAGE,
            });
            setData(result);
        } catch (error) {
            console.error('Error fetching student payment history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        fetchPage(page);
    }, [page]);

    return (
        <div className="mt-6 flex flex-col gap-6">
            {/* Section header */}
            <div>
                <Text size="text-lg" weight="semibold" colorType="primary">
                    {t('payments.billing_history')}
                </Text>
                <Text size="text-sm" colorType="tertiary">
                    {t('payments.billing_history_description')}
                </Text>
            </div>

            {/* Table */}
            <StudentPaymentsTable
                payments={data.payments}
                loading={loading}
                lang={lang}
            />

            {/* Pagination */}
            {data.meta.lastPage > 1 && (
                <>
                    <Divider />
                    <Space size={4} direction="vertical" />
                    <PageSelector
                        pages={data.meta.lastPage}
                        currentPage={page}
                        maxPages={3}
                        disabled={loading}
                        onChangedPage={setPage}
                    />
                </>
            )}
        </div>
    );
};
