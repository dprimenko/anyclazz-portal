import { useEffect, useState, useMemo } from 'react';
import { TeacherReview } from "../../teacher-review/TeacherReview";
import type { GetTeacherReviewsResponse, TeacherRepository } from '../../domain/types';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import { useTranslations } from '@/i18n';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';

const ITEMS_PER_PAGE = 10;

interface PaginatedTeacherReviewsProps {
    teacherId: string;
    token: string;
    repository: TeacherRepository;
}

export function PaginatedTeacherReviews({ teacherId, token, repository }: PaginatedTeacherReviewsProps) {
    const t = useTranslations();

    const [reviewsData, setReviewsData] = useState<GetTeacherReviewsResponse | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pages = reviewsData?.meta.lastPage || 0;

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await repository.getTeacherReviews({ 
                token, 
                teacherId,
                page,
                size: ITEMS_PER_PAGE
            });
            setReviewsData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page, teacherId, token]);

    if (loading && !reviewsData) {
        return <ProgressIndicator />;
    }

    if (error) {
        return (
            <EmptyState
                title={t('common.error')}
                description={error}
            />
        );
    }

    if (!reviewsData || reviewsData.reviews.length === 0) {
        return (
            <EmptyState
                title={t('reviews.no_reviews_title')}
                description={t('reviews.no_reviews_description')}
            />
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {reviewsData.reviews.map(review => (
                    <TeacherReview key={review.id} review={review} />
                ))}
            </div>
            {pages > 1 && (
                <>
                    <Divider />
                    <Space size={20} direction="vertical" />
                    <div>
                        <PageSelector
                            pages={pages}
                            currentPage={page}
                            maxPages={3}
                            disabled={loading}
                            onChangedPage={setPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}