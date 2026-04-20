import { useState, useEffect, type FC } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';
import {
  getPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  type PaymentMethod,
} from '@/services/paymentMethods';
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import { AddPaymentMethodModal } from './AddPaymentMethodModal';
import { HorizontalInputContainer } from '@/ui-library/components/horizontal-input-container/HorizontalInputContainer';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

interface PaymentMethodsManagerProps {
  accessToken: string;
  lang?: 'en' | 'es';
}

function CardBrandIcon({ brand }: { brand?: string }) {
  const b = (brand ?? '').toLowerCase();
  if (b === 'visa') {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Visa">
        <rect width="38" height="24" rx="4" fill="#EFF6FF" />
        <text x="6" y="17" fontFamily="sans-serif" fontWeight="bold" fontSize="13" fill="#1D4ED8">VISA</text>
      </svg>
    );
  }
  if (b === 'mastercard') {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Mastercard">
        <rect width="38" height="24" rx="4" fill="#FFF7ED" />
        <circle cx="14" cy="12" r="8" fill="#EF4444" />
        <circle cx="24" cy="12" r="8" fill="#F97316" fillOpacity="0.85" />
      </svg>
    );
  }
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-label="Card">
      <rect width="38" height="24" rx="4" fill="#F3F4F6" />
      <rect x="6" y="8" width="26" height="8" rx="2" fill="#D1D5DB" />
    </svg>
  );
}

export const PaymentMethodsManager: FC<PaymentMethodsManagerProps> = ({
  accessToken,
  lang = 'en',
}) => {
  const t = useTranslations({ lang });
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getPaymentMethods(accessToken)
      .then(setMethods)
      .catch(() =>
        publish(SharedDomainEvents.showToast, {
          message: t('payments.error_loading'),
          variant: 'error',
        })
      )
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await setDefaultPaymentMethod(accessToken, id);
      setMethods((prev) =>
        prev.map((m) => ({ ...m, is_default: m.payment_method_id === id }))
      );
      publish(SharedDomainEvents.showToast, {
        message: t('payments.card_set_default'),
        variant: 'success',
      });
    } catch {
      publish(SharedDomainEvents.showToast, {
        message: t('payments.error_loading'),
        variant: 'error',
      });
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePaymentMethod(accessToken, id);
      setMethods((prev) => prev.filter((m) => m.payment_method_id !== id));
      publish(SharedDomainEvents.showToast, {
        message: t('payments.card_removed'),
        variant: 'success',
      });
    } catch {
      publish(SharedDomainEvents.showToast, {
        message: t('payments.error_loading'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdded = (method: PaymentMethod) => {
    setMethods((prev) => {
      const updated = method.is_default
        ? prev.map((m) => ({ ...m, is_default: false }))
        : prev;
      return [...updated, method];
    });
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text size="text-lg" weight="semibold" colorType="primary">
          {t('payments.payment_method_title')}
        </Text>
        <Text size="text-sm" colorType="tertiary">
          {t('payments.payment_method_description')}
        </Text>
      </div>

      <HorizontalInputContainer
        label={t('payments.card_details')}
        description={t('payments.select_default')}
        required
      >
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-[72px] rounded-xl border border-gray-100 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : methods.length === 0 ? (
          <></>
        ) : (
          <div className="flex flex-col gap-2">
            {methods.map((method) => {
              const expiry =
                method.card_exp_month && method.card_exp_year
                  ? `${t('checkout.card_expires', {
                      month: String(method.card_exp_month).padStart(2, '0'),
                      year: String(method.card_exp_year),
                    })}`
                  : null;

              return (
                <div
                  key={method.payment_method_id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    method.is_default
                      ? 'border-[#FDB022] bg-[#FFFCF5]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    aria-label={method.is_default ? 'Default' : 'Set as default'}
                    onClick={() => !method.is_default && handleSetDefault(method.payment_method_id)}
                    className="flex-shrink-0"
                    disabled={settingDefaultId !== null}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        method.is_default
                          ? 'border-[#FDB022] bg-[#FDB022]'
                          : 'border-gray-300 hover:border-[#FDB022]'
                      }`}
                    >
                      {method.is_default && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Brand icon */}
                  {method.type === 'card' && (
                    <CardBrandIcon brand={method.card_brand} />
                  )}

                  {/* Details */}
                  <div className="flex flex-col flex-1 min-w-0">
                    {method.type === 'card' ? (
                      <>
                        <Text size="text-sm" weight="medium" colorType="primary">
                          {method.card_brand
                            ? method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)
                            : 'Card'}{' '}
                          ending in {method.card_last4}
                        </Text>
                        <Text size="text-xs" colorType={method.is_expired ? 'primary' : 'tertiary'} className={method.is_expired ? 'text-red-500' : ''}>
                          {method.is_expired ? t('checkout.card_expired') : expiry}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text size="text-sm" weight="medium" colorType="primary">PayPal</Text>
                        {method.paypal_email && (
                          <Text size="text-xs" colorType="tertiary">{method.paypal_email}</Text>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!method.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(method.payment_method_id)}
                        disabled={settingDefaultId !== null}
                        className="text-xs font-medium text-[#FDB022] hover:underline disabled:opacity-50"
                      >
                        {settingDefaultId === method.payment_method_id
                          ? '...'
                          : t('payments.set_as_default')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(method.payment_method_id)}
                      disabled={deletingId !== null}
                      className="text-xs font-medium text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === method.payment_method_id ? '...' : t('payments.remove')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 transition-colors py-1 pointer"
        >
          <Icon icon="plus" iconColor='#A4A7AE' iconWidth={16} iconHeight={16} />
          <Text colorType='tertiary' weight='semibold'>{t('payments.add_new_method').replace('+ ', '')}</Text>
        </button>
      </HorizontalInputContainer>

      {showAddModal && (
        <AddPaymentMethodModal
          accessToken={accessToken}
          lang={lang}
          onSuccess={handleAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};
