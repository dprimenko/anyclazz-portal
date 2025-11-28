import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useState } from "react";
import classNames from "classnames";
import styles from "./ClazzmateCard.module.css";

export interface ClazzmateCardProps {
    referralLink: string;
    friendsInvited: number;
    creditsEarned: number;
}

export function ClazzmateCard({ referralLink, friendsInvited, creditsEarned }: ClazzmateCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={classNames("rounded-lg p-6 bg-white border border-neutral-200", styles.clazzmateCard)}>
            <div className="flex flex-row items-center gap-2 mb-4">
                <div className={styles.clazzmateIcon}>
                    <Icon icon="users" iconWidth={20} iconHeight={20} />
                </div>
                <Text textLevel="h3" size="text-lg" weight="semibold" colorType="primary">
                    Clazzmate
                </Text>
            </div>

            <Text size="text-sm" colorType="tertiary" className="mb-6">
                Invite your friends to AnyClazz and you'll both earn 10% in credits when they book their first lesson.
            </Text>

            <div className={classNames("flex flex-row items-center gap-2 p-3 rounded-md mb-6", styles.referralLinkContainer)}>
                <Text size="text-sm" colorType="secondary" className="flex-1 truncate">
                    {referralLink}
                </Text>
                <button onClick={handleCopy} className={styles.copyButton}>
                    <Icon icon={copied ? "check" : "copy"} iconWidth={16} iconHeight={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <Text size="text-xs" colorType="tertiary">
                        Friend Invited
                    </Text>
                    <Text size="text-xl" weight="semibold" colorType="primary">
                        {friendsInvited}
                    </Text>
                </div>
                <div className="flex flex-col gap-1">
                    <Text size="text-xs" colorType="tertiary">
                        Credits Earned
                    </Text>
                    <Text size="text-xl" weight="semibold" colorType="primary">
                        €{creditsEarned.toFixed(2)}
                    </Text>
                </div>
            </div>
        </div>
    );
}
