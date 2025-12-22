import { useState } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

interface PaymentFormProps {
    bookingId: string;
    amount: number;
    currency: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function PaymentForm({ bookingId, amount, currency, onSuccess, onError }: PaymentFormProps) {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.slice(0, 19); // 16 dígitos + 3 espacios
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const detectCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (/^4/.test(cleaned)) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        return null;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value);
        setExpiry(formatted);
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCvv(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch(`/api/bookings/${bookingId}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardName,
                    cardNumber: cardNumber.replace(/\s/g, ''),
                    expiry: expiry.replace(/\s\/\s/g, ''),
                    cvv,
                    saveCard,
                }),
            });

            if (response.ok) {
                onSuccess?.();
                window.location.href = '/me/upcoming-lessons';
            } else {
                const error = await response.json();
                onError?.(error.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            onError?.('An error occurred during payment');
        } finally {
            setIsProcessing(false);
        }
    };

    const cardType = detectCardType(cardNumber);
    const formattedAmount = `${currency.toUpperCase()} ${amount.toFixed(2)}`;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name on card */}
            <div className="flex flex-col gap-2">
                <label htmlFor="cardName" className="text-sm font-medium text-neutral-700">
                    Name on card <span className="text-red-500">*</span>
                </label>
                <input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Olivia Rhye"
                    required
                    className="px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
            </div>

            {/* Expiry */}
            <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="expiry" className="text-sm font-medium text-neutral-700">
                        Expiry <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="expiry"
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM / YY"
                        required
                        maxLength={7}
                        className="px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Card number and CVV */}
            <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-[2]">
                    <label htmlFor="cardNumber" className="text-sm font-medium text-neutral-700">
                        Card number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="cardNumber"
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 1234 1234 1234"
                            required
                            className="w-full px-3.5 py-2.5 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {cardType && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {cardType === 'visa' && (
                                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                                        <rect width="32" height="20" rx="3" fill="#1434CB"/>
                                        <path d="M13.8 14.5L15.2 5.5H17.4L16 14.5H13.8Z" fill="white"/>
                                    </svg>
                                )}
                                {cardType === 'mastercard' && (
                                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                                        <rect width="32" height="20" rx="3" fill="#EB001B"/>
                                        <circle cx="12" cy="10" r="6" fill="#FF5F00"/>
                                        <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="cvv" className="text-sm font-medium text-neutral-700">
                        CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="cvv"
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="•••"
                        required
                        maxLength={3}
                        className="px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Save card checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <Text size="text-sm" colorType="secondary">
                    Save this card for future payments
                </Text>
            </label>

            {/* Confirm payment button */}
            <Button
                type="submit"
                colorType="primary"
                label={`Confirm payment • ${formattedAmount}`}
                className="w-full mt-2"
                disabled={isProcessing}
            />

            {/* Payment policy */}
            <Text size="text-xs" colorType="tertiary" className="text-center">
                By pressing the "Confirm payment" button, you agree to{' '}
                <a href="/stripe-refund-policy" className="text-primary-600 underline">
                    Stripe's Refund and Payment Policy
                </a>
                . It's safe to pay on Stripe. All transactions are protected by SSL encryption.
            </Text>
        </form>
    );
}
