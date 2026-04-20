import type { FC } from 'react';
import type { PaymentMethod } from '@/services/paymentMethods';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';

interface SavedPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  selectedId: string | null; // null = new method
  onSelect: (id: string | null) => void;
  lang?: 'en' | 'es';
}

export const SavedPaymentMethods: FC<SavedPaymentMethodsProps> = ({
  paymentMethods,
  selectedId,
  onSelect,
  lang = 'en',
}) => {
  const t = useTranslations({ lang });

  const cardBrandLabel = (brand?: string) =>
    brand ? brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase() : 'Card';

  const expiryLabel = (method: PaymentMethod) => {
    if (method.is_expired) return t('checkout.card_expired');
    if (method.card_exp_month && method.card_exp_year) {
      return t('checkout.card_expires', {
        month: String(method.card_exp_month).padStart(2, '0'),
        year: String(method.card_exp_year).slice(-2),
      });
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-2">
      {paymentMethods.map((method) => {
        const isSelected = selectedId === method.payment_method_id;
        return (
          <button
            key={method.payment_method_id}
            type="button"
            onClick={() => onSelect(method.payment_method_id)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors w-full text-left ${
              isSelected
                ? 'border-[#FDB022] bg-[#FFF9F0]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                isSelected ? 'border-[#FDB022]' : 'border-gray-300'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-[#FDB022]" />}
            </div>

            {method.type === 'card' ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Text size="text-sm" weight="medium" colorType="primary">
                  {cardBrandLabel(method.card_brand)}
                </Text>
                <Text size="text-sm" colorType="primary">
                  ••••{method.card_last4}
                </Text>
                <Text
                  size="text-xs"
                  colorType={method.is_expired ? 'primary' : 'tertiary'}
                  className={`ml-auto flex-shrink-0 ${method.is_expired ? 'text-red-500' : ''}`}
                >
                  {expiryLabel(method)}
                </Text>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Text size="text-sm" weight="medium" colorType="primary">
                  PayPal
                </Text>
                {method.paypal_email && (
                  <Text size="text-xs" colorType="tertiary" className="ml-auto truncate">
                    {method.paypal_email}
                  </Text>
                )}
              </div>
            )}

            {method.is_default && (
              <span className="text-xs text-[#FDB022] font-medium flex-shrink-0">
                {t('checkout.default')}
              </span>
            )}
          </button>
        );
      })}

      {/* New payment method option */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors w-full text-left ${
          selectedId === null
            ? 'border-[#FDB022] bg-[#FFF9F0]'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            selectedId === null ? 'border-[#FDB022]' : 'border-gray-300'
          }`}
        >
          {selectedId === null && <div className="w-2 h-2 rounded-full bg-[#FDB022]" />}
        </div>
        <Text size="text-sm" colorType="primary">
          {t('checkout.new_payment_method')}
        </Text>
      </button>
    </div>
  );
};
