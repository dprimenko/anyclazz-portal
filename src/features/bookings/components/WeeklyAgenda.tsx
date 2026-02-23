import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { DateTime, fromISOKeepZone } from '@/features/shared/utils/dateConfig';
import type { BookingWithTeacher, GetBookingsResponse } from '@/features/bookings/domain/types';
import type { AuthUser } from '@/features/auth/domain/types';
import { useTranslations } from '@/i18n';
import { AnyclazzMyBookingsRepository } from '../infrastructure/AnyclazzMyBookingsRepository';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { LessonItem } from './lesson-item/LessonItem';

interface WeeklyAgendaProps {
    bookings: GetBookingsResponse;
    user: AuthUser | null;
    token: string;
}

export function WeeklyAgenda({ bookings: initialBookings, user, token }: WeeklyAgendaProps) {
    const t = useTranslations();
    
    // Helper para calcular el inicio de semana en formato USA (domingo)
    const getWeekStart = useCallback((date: DateTime) => {
        // En Luxon, weekday va de 1 (lunes) a 7 (domingo)
        // Para formato USA: domingo = 0, lunes = 1, ..., sábado = 6
        const dayOfWeek = date.weekday === 7 ? 0 : date.weekday;
        return date.minus({ days: dayOfWeek }).startOf('day');
    }, []);
    
    // Crear repositorio en el cliente
    const repository = useMemo(() => new AnyclazzMyBookingsRepository(), []);
    
    const [currentWeek, setCurrentWeek] = useState(() => {
        const now = DateTime.now();
        const dayOfWeek = now.weekday === 7 ? 0 : now.weekday;
        return now.minus({ days: dayOfWeek }).startOf('day');
    });
    const [bookings, setBookings] = useState(initialBookings);
    const [loading, setLoading] = useState(false);
    const isFirstRender = useRef(true);

    // Calcular el inicio y fin de la semana actual (formato USA: domingo a sábado)
    const weekStart = currentWeek;
    const weekEnd = currentWeek.plus({ days: 6 }).endOf('day');

    // Fetch bookings cuando cambia la semana
    const fetchWeekBookings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await repository.getBookings({
                token,
                sort: 'desc',
                startAt: weekStart.toISO(),
                endAt: weekEnd.toISO(),
                timezone: user?.timezone || 'America/New_York',
                page: 1,
                size: 100
            });
            setBookings(data);
        } catch (error) {
            console.error('Error fetching week bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [repository, token, weekStart, weekEnd, user?.timezone]);

    // Recargar bookings cuando cambia la semana
    useEffect(() => {
        // Saltar el primer render ya que tenemos initialBookings
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        fetchWeekBookings();
    }, [currentWeek]);

    // Agrupar bookings por día
    const bookingsByDay = useMemo(() => {
        const groups: Record<string, BookingWithTeacher[]> = {};
        
        bookings.bookings.forEach(booking => {
            // Parsear manteniendo la zona horaria original del backend
            const dayKey = fromISOKeepZone(booking.startAt).toFormat('yyyy-MM-dd');
            if (!groups[dayKey]) {
                groups[dayKey] = [];
            }
            groups[dayKey].push(booking);
        });

        // Ordenar bookings dentro de cada día por hora
        Object.keys(groups).forEach(day => {
            groups[day].sort((a, b) => {
                return fromISOKeepZone(a.startAt).toMillis() - fromISOKeepZone(b.startAt).toMillis();
            });
        });

        return groups;
    }, [bookings]);

    // Navegar semanas
    const goToPreviousWeek = () => {
        setCurrentWeek(prev => prev.minus({ weeks: 1 }));
    };

    const goToNextWeek = () => {
        setCurrentWeek(prev => prev.plus({ weeks: 1 }));
    };

    const goToCurrentWeek = () => {
        const now = DateTime.now();
        const dayOfWeek = now.weekday === 7 ? 0 : now.weekday;
        setCurrentWeek(now.minus({ days: dayOfWeek }).startOf('day'));
    };

    // Calcular el número de semana
    const weekNumber = currentWeek.weekNumber;

    // Generar array de días de la semana
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(weekStart.plus({ days: i }));
        }
        return days;
    }, [weekStart]);

    return (
        <Card className="flex flex-col">
            {/* Header */}
            <div className="flex justify-between p-6 border-b border-[var(--color-neutral-200)]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Text size="text-lg" weight="semibold" colorType="primary">
                            {weekStart.toFormat('MMMM yyyy')}
                        </Text>
                        <Chip colorType="secondary" size="sm">
                            <Text size="text-sm" colorType="secondary" weight='medium'>
                                {t('common.week')} {weekNumber}
                            </Text>
                        </Chip>
                    </div>
                    <Text size="text-md" colorType="tertiary">
                        {weekStart.toFormat('MMM d, yyyy')} – {weekEnd.toFormat('MMM d, yyyy')}
                    </Text>
                </div>

                <div className="flex items-center gap-3">
                    {/* Week Navigation */}
                    <div className="flex items-center gap-2 bg-white border border-[var(--color-neutral-300)] rounded-lg px-3">
                        <button 
                            onClick={goToPreviousWeek}
                            className="p-1 hover:bg-neutral-100 rounded transition-colors"
                        >
                            <Icon icon="arrow-left" iconWidth={20} iconHeight={20} />
                        </button>
                        
                        <button 
                            onClick={goToCurrentWeek}
                            className="px-3 py-1 hover:bg-neutral-100 transition-colors border-x border-[var(--color-neutral-300)] py-2.5"
                        >
                            <Text size="text-sm" colorType="secondary" weight='semibold'>{t('common.week')} {weekNumber}</Text>
                        </button>

                        <button 
                            onClick={goToNextWeek}
                            className="p-1 hover:bg-neutral-100 rounded transition-colors"
                        >
                            <Icon icon="arrow-right" iconWidth={20} iconHeight={20} />
                        </button>
                    </div>

                    {/* Schedule Lesson Button */}
                    <a href="/teachers">
                        <Button 
							icon="plus" 
                            iconColor='#FDD7A5'
							label={t('dashboard.schedule_lesson')} 
							colorType="primary"
							className="flex-1 md:flex-none"
						/>
                    </a>
                </div>
            </div>

            {/* Days of the week */}
            <div className="flex flex-col relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                )}
                {weekDays.map((day) => {
                    const dayKey = day.toFormat('yyyy-MM-dd');
                    const dayBookings = bookingsByDay[dayKey] || [];
                    const isToday = day.hasSame(DateTime.now(), 'day');

                    return (
                        <div key={dayKey} className="flex flex-row p-5 border-b border-[var(--color-neutral-200)]">
                            {/* Day Header */}
                            <div className="flex gap-2 md:w-[140px]">
                                <Text 
                                    size="text-sm" 
                                    weight="semibold" 
                                    colorType={'primary'}
                                    color={isToday ? 'var(--color-primary-500)' : undefined}
                                >
                                    {day.toFormat('EEEE d')}
                                </Text>
                            </div>

                            {/* Lessons for this day */}
                            {dayBookings.length > 0 && (
                                <div className="flex flex-col gap-2.5 w-full">
                                    {dayBookings.map((booking) => (
                                        <LessonItem 
                                            key={booking.id} 
                                            isHighlited
                                            innerTableHeader
                                            lesson={booking} 
                                            repository={repository}
                                            token={token}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
