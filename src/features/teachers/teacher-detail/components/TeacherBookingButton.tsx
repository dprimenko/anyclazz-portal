import { useState } from "react";
import { Modal } from "@/ui-library/components/modal/Modal";
import { BookingCreator } from "@/features/bookings/components/booking-creator/BookingCreator";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useTranslations } from "@/i18n";
import type { Teacher } from "../../domain/types";
import { TeachersProvider } from "../../providers/TeachersProvider";
import { ApiTeacherRepository } from "../../infrastructure/ApiTeacherRepository";

interface TeacherBookingButtonProps {
    teacher: Teacher;
    accessToken: string;
}

export function TeacherBookingButton({ teacher, accessToken }: TeacherBookingButtonProps) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const t = useTranslations();
    const teacherRepository = new ApiTeacherRepository();

    return (
        <>
            <Button 
                colorType="primary" 
                size="lg" 
                label={t('teachers.book-lesson')} 
                fullWidth 
                onClick={() => setIsBookingModalOpen(true)} 
            />
            {isBookingModalOpen && (
                <Modal width={700} height={700}>
                    <TeachersProvider teacherRepository={teacherRepository} accessToken={accessToken}>
                        <BookingCreator teacher={teacher} onClose={() => setIsBookingModalOpen(false)} />
                    </TeachersProvider>
                </Modal>
            )}
        </>
    );
}
