import { useState } from 'react';
import type { FC } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Breadcrumb } from '@/ui-library/components/breadcrumb';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { useTranslations } from '@/i18n';
import type { ReferralData } from '@/features/shared/domain/referralTypes';
import { Button } from '@/ui-library/components/ssr/button/Button';

interface ClazzmateContentProps {
    referralData: ReferralData;
    inviteUrl: string;
    imageUrl: string;
    lang?: 'en' | 'es';
}

export const ClazzmateContent: FC<ClazzmateContentProps> = ({ referralData, inviteUrl, imageUrl, lang }) => {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="px-4 pt-8 pb-2 md:p-8">
            <Breadcrumb items={[{ label: t('common.dashboard'), href: '/dashboard' }, { label: t('clazzmate.title') }]} />
            <Space size={16} direction="vertical" />
            <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary">{t('clazzmate.title')}</Text>
            <Space size={16} direction="vertical" />
            <Divider />
            <Space size={24} direction="vertical" />

            {/* Banner card */}
            <Card className="flex flex-col md:flex-row overflow-hidden">
                <div className="relative w-full md:w-[200px] h-40 md:h-auto flex-shrink-0">
                    <img src={imageUrl} alt={t('clazzmate.invite_friends_earn')} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/80 md:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 md:hidden block" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                    <Text size="text-base" weight="semibold" colorType="primary">
                        {t('clazzmate.invite_friends_earn')}
                    </Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-sm" colorType="secondary">
                        {t('clazzmate.invite_description')}
                    </Text>
                </div>
                <div className="w-full md:flex-1 p-6 flex items-center justify-center">
                    <div className="w-full border border-neutral-200 rounded-md p-4 flex flex-col justify-center bg-[#FFF9F3]">
                        <Text size="text-sm" weight="semibold" colorType="primary">{t('clazzmate.your_link')}</Text>
                        <Space size={8} direction="vertical" />
                        <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-2 px-3 bg-white">
                            <Text size="text-sm" colorType="secondary" className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                                {inviteUrl}
                            </Text>

                            <Button icon={copied ? 'check' : 'copy'} colorType='primary' onClick={handleCopy}/>
                        </div>
                    </div>
                </div>
            </Card>

            <Space size={24} direction="vertical" />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                    <Text size="text-sm" colorType="tertiary">{t('clazzmate.friends_invited')}</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        {referralData.friends_invited}
                    </Text>
                </Card>
                <Card className="p-6">
                    <Text size="text-sm" colorType="tertiary">{t('clazzmate.first_booking_conversions')}</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        {referralData.first_booking_conversions}
                    </Text>
                </Card>
                <Card className="p-6">
                    <Text size="text-sm" colorType="tertiary">{t('clazzmate.available_credits')}</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        ${(referralData.available_credit_amount ?? 0).toFixed(2)}
                    </Text>
                </Card>
            </div>
        </div>
    );
};
