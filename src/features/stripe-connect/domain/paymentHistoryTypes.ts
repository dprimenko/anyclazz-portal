export interface PaymentHistoryStudent {
    id: string;
    name: string;
    surname: string;
    full_name: string;
    avatar: string | null;
}

export interface PaymentHistoryAmount {
    value: number;
    currency: string;
    formatted: string;
}

export interface PaymentHistoryInvoice {
    invoice_number: string;
    download_url: string;
    available: boolean;
}

export interface PaymentHistoryReceipt {
    charge_id: string | null;
    receipt_url: string | null;
    available: boolean;
}

export type PaymentHistoryStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export type PaymentHistoryClassType =
    | 'online_single'
    | 'online_group'
    | 'onsite_single'
    | 'onsite_group';

export interface PaymentHistoryItem {
    id: string;
    booking_id: string;
    student: PaymentHistoryStudent;
    amount: PaymentHistoryAmount;
    class_type: PaymentHistoryClassType;
    booking_date: string;
    payment_date: string;
    status: PaymentHistoryStatus;
    invoice: PaymentHistoryInvoice;
    receipt: PaymentHistoryReceipt;
}

export interface PaymentHistoryMeta {
    currentPage: number;
    lastPage: number;
    size: number;
    total: number;
}

export interface GetPaymentHistoryResponse {
    payments: PaymentHistoryItem[];
    meta: PaymentHistoryMeta;
}

export interface PaymentsDashboardAmount {
    amount: number;
    currency: string;
    formatted: string;
}

export interface PaymentsDashboardResponse {
    revenue: {
        this_month: PaymentsDashboardAmount;
        last_month: PaymentsDashboardAmount;
    };
    balance: PaymentsDashboardAmount;
    classes: {
        this_month: number;
        last_30_days: number;
    };
    account_status: {
        can_receive_payments: boolean;
        charges_enabled: boolean;
        payouts_enabled: boolean;
    };
}
