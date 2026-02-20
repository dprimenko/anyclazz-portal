import { useState } from 'react';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Button } from '@/ui-library/shared/button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

interface PaymentMethodSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectCard: () => void;
  onSelectPayPal: () => void;
}

export function PaymentMethodSelector({ open, onClose, onSelectCard, onSelectPayPal }: PaymentMethodSelectorProps) {
  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose} width={400} fitContent>
      <div className="flex flex-col gap-6 p-6 bg-white">
        <div className="flex justify-between items-center">
          <Text size="text-lg" weight="semibold" colorType="primary">
            Add payment method
          </Text>
          <button 
            onClick={onClose} 
            className="text-tertiary hover:text-primary transition-colors"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <Text size="text-sm" colorType="tertiary">
          Choose how you want to pay
        </Text>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              onSelectCard();
            }}
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-tertiary">
              <Icon icon="wallet" iconWidth={24} iconHeight={24} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <Text weight="medium" colorType="primary">
                Credit or debit card
              </Text>
              <Text size="text-xs" colorType="tertiary">
                Visa, Mastercard, Amex
              </Text>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectPayPal();
            }}
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12">
              <Icon icon="paypal" iconWidth={48} iconHeight={32} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <Text weight="medium" colorType="primary">
                PayPal
              </Text>
              <Text size="text-xs" colorType="tertiary">
                Pay with your PayPal account
              </Text>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
