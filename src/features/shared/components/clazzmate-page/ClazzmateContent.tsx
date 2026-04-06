import { useState } from 'react';
import type { FC } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Breadcrumb } from '@/ui-library/components/breadcrumb';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import type { ReferralData } from '@/features/shared/domain/referralTypes';
import styles from './ClazzmateContent.module.css';

interface ClazzmateContentProps {
    referralData: ReferralData;
    inviteUrl: string;
    imageUrl: string;
}

export const ClazzmateContent: FC<ClazzmateContentProps> = ({ referralData, inviteUrl, imageUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="px-4 pt-8 pb-2 md:p-8">
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Clazzmate' }]} />
            <Space size={16} direction="vertical" />
            <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary">Clazzmate</Text>
            <Space size={16} direction="vertical" />
            <Divider />
            <Space size={24} direction="vertical" />

            {/* Banner card */}
            <div className={styles.bannerCard}>
                <div className={styles.bannerImage}>
                    <img src={imageUrl} alt="Invite friends and earn credits" />
                </div>
                <div className={styles.bannerMiddle}>
                    <Text size="text-base" weight="semibold" colorType="primary">
                        Invite friends and earn credits!
                    </Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-sm" colorType="secondary">
                        Invite your friends to AnyClazz and you'll both earn 10% in
                        credits when they book their first lesson. Use your credits
                        to book lessons with any teacher on the platform.
                    </Text>
                </div>
                <div className={styles.bannerRight}>
                    <Text size="text-sm" weight="semibold" colorType="primary">Your link!</Text>
                    <Space size={8} direction="vertical" />
                    <div className={styles.linkContainer}>
                        <Text size="text-sm" colorType="secondary" className={styles.linkText}>
                            {inviteUrl}
                        </Text>
                        <button
                            onClick={handleCopy}
                            className={styles.copyButton}
                            aria-label={copied ? 'Link copied' : 'Copy referral link'}
                        >
                            <Icon icon={copied ? 'check' : 'copy'} iconWidth={20} iconHeight={20} />
                        </button>
                    </div>
                </div>
            </div>

            <Space size={24} direction="vertical" />

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Text size="text-sm" colorType="tertiary">Friends Invited</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        {referralData.friends_invited}
                    </Text>
                </div>
                <div className={styles.statCard}>
                    <Text size="text-sm" colorType="tertiary">Your clazzmate's first booking</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        {referralData.first_booking_conversions}
                    </Text>
                </div>
                <div className={styles.statCard}>
                    <Text size="text-sm" colorType="tertiary">Available credit</Text>
                    <Space size={8} direction="vertical" />
                    <Text size="text-3xl" weight="semibold" colorType="primary">
                        €{referralData.available_credits}
                    </Text>
                </div>
            </div>
        </div>
    );
};
