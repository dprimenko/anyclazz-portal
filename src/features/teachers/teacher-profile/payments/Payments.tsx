import type { FC } from 'react';
import type { Teacher } from '../../domain/types';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { useTranslations } from '@/i18n';
import { StripeConnectSection } from '@/features/stripe-connect';

export interface PaymentsProps {
  teacher: Teacher;
  accessToken: string;
  lang?: 'es' | 'en';
}

export const Payments: FC<PaymentsProps> = ({ teacher, accessToken, lang }) => {
  const t = useTranslations(lang ? { lang } : undefined);

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="flex flex-col gap-[2px]">
        <Text size="text-lg" weight="semibold" colorType="primary">
          {t('teacher-profile.payments')}
        </Text>
        <Text size="text-md" colorType="tertiary">
          {t('teacher-profile.payments_description')}
        </Text>
      </div>

      <Divider margin={24} />

      <StripeConnectSection 
        accessToken={accessToken}
        country={teacher.teacherAddress?.country || 'US'}
        lang={lang}
      />
    </div>
  );
};
