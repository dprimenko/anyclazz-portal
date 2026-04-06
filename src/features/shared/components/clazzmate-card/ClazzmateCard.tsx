import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Card } from "@/ui-library/components/ssr/card/Card";
import { useState } from "react";
import { useTranslations } from "@/i18n";
import type { ui } from "@/i18n/ui";
import { Button } from "@/ui-library/components/ssr/button/Button";

export interface ClazzmateCardProps {
    referralLink: string;
    friendsInvited: number;
    creditsEarned: number;
    lang?: keyof typeof ui;
}

export function ClazzmateCard({ referralLink, friendsInvited, creditsEarned, lang = 'en' }: ClazzmateCardProps) {
    const t = useTranslations({ lang });
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedCredits = `€${creditsEarned.toFixed(2).replace('.', ',')}`;

    return (
        <Card bgColor="#FFFFFF" className="p-4">
            {/* Header link */}
            <a href="/me/clazzmate" className="inline-flex items-center gap-1.5 mb-3 no-underline hover:opacity-80 transition-opacity">
                <Text size="text-lg" weight="medium" colorType="accent" className="underline underline-offset-2">
                    {t('clazzmate.title')}
                </Text>
                <span>
                    <Icon icon="log-in-02" iconColor="#F4A43A" iconWidth={18} iconHeight={18} />
                </span>
            </a>

            {/* Bold invite heading */}
            <Text textLevel="h3" size="text-sm" weight="semibold" colorType="primary" className="mb-2">
                {t('clazzmate.invite_friends_earn')}
            </Text>

            {/* Description */}
            <Text size="text-sm" colorType="tertiary" className="mb-4">
                {t('clazzmate.description')}
            </Text>

            {/* Referral link + copy button */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-2 px-3 bg-white min-w-0 flex-1">
                    <Text size="text-sm" colorType="secondary" className="flex-1 truncate min-w-0">
                        {referralLink}
                    </Text>

                    <Button icon={copied ? 'check' : 'copy'} colorType='primary' onClick={handleCopy}/>
                </div>
            </div>

            {/* Stats box */}
            <Card bgColor="#FFFFFF" className="flex flex-col gap-2 p-4">
                <div className="flex flex-col gap-1">
                    <Text size="text-sm" colorType="tertiary">
                        {t('clazzmate.friends_invited')}
                    </Text>
                    <Text size="text-2xl" weight="semibold" colorType="primary">
                        {friendsInvited}
                    </Text>
                </div>
                <div className="flex flex-col gap-1">
                    <Text size="text-sm" colorType="tertiary">
                        {t('clazzmate.credits_earned')}
                    </Text>
                    <Text size="text-2xl" weight="semibold" colorType="primary">
                        {formattedCredits}
                    </Text>
                </div>
            </Card>
        </Card>
    );
}
