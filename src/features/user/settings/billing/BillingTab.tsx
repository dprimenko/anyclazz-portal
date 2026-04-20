import type { FC } from 'react';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PaymentMethodsManager } from './PaymentMethodsManager';
import { PaginatedStudentPayments } from '@/features/students/components/billing/PaginatedStudentPayments';
import type { GetStudentPaymentsResponse } from '@/features/students/domain/paymentTypes';

interface BillingTabStudentProps {
  role: 'student';
  accessToken: string;
  lang?: 'en' | 'es';
  initialPayments?: GetStudentPaymentsResponse;
}

interface BillingTabTeacherProps {
  role: 'teacher';
  accessToken: string;
  lang?: 'en' | 'es';
}

type BillingTabProps = BillingTabStudentProps | BillingTabTeacherProps;

export const BillingTab: FC<BillingTabProps> = (props) => {
  const { accessToken, lang = 'en', role } = props;

  return (
    <div className="flex flex-col mt-6">
      <PaymentMethodsManager accessToken={accessToken} lang={lang} />

      {role === 'student' && (props as BillingTabStudentProps).initialPayments && (
        <>
          <Space size={32} direction="vertical" />
          <Divider />
          <Space size={32} direction="vertical" />
          <PaginatedStudentPayments
            initialPayments={(props as BillingTabStudentProps).initialPayments!}
            accessToken={accessToken}
            lang={lang}
          />
        </>
      )}
    </div>
  );
};
