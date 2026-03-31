export interface StudentPaymentTeacher {
    id: string;
    name: string;
    surname: string;
    full_name: string;
    avatar: string | null;
}

export interface StudentPaymentAmount {
    value: number;
    currency: string;
    formatted: string;
}

export interface StudentPaymentReceipt {
    charge_id: string | null;
    receipt_url: string | null;
    available: boolean;
}

export type StudentPaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export type StudentPaymentClassType =
    | 'online_single'
    | 'online_group'
    | 'onsite_single'
    | 'onsite_group';

export interface StudentPaymentItem {
    id: string;
    booking_id: string;
    teacher: StudentPaymentTeacher;
    amount: StudentPaymentAmount;
    class_type: StudentPaymentClassType;
    booking_date: string;
    payment_date: string;
    status: StudentPaymentStatus;
    receipt: StudentPaymentReceipt;
}

export interface StudentPaymentMeta {
    currentPage: number;
    lastPage: number;
    size: number;
    total: number;
}

export interface GetStudentPaymentsResponse {
    payments: StudentPaymentItem[];
    meta: StudentPaymentMeta;
}
