import { Card } from "@/ui-library/components/ssr/card/Card";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { IconButton } from "@/ui-library/shared/icon-button";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";

type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

export function UpgradeSuperTutorBanner({
    translations
}: { 
    translations: TranslationFunction | Record<string, string> 
}) {
    // Función helper para manejar ambos casos
    const t = typeof translations === 'function' 
        ? translations 
        : (key: string) => translations[key] || key;

    return (
        <Card className="p-4">
            <div className="flex flex-row items-between">
                <IconButton icon="verified" size="sm" iconSize={20}/>
            </div>
            <Space size={12} direction="vertical"/>
            <Text size="text-sm" weight="semibold" colorType="primary">{t('subscription.upgrade_to_super_tutor')}</Text>
            <Space size={4} direction="vertical"/>
            <Text size="text-sm" colorType="tertiary">{t('subscription.get_verified_badge')}</Text>
            <Space size={16} direction="vertical"/>
            <a href="/profile?tab=super_tutor" className="w-full">
                <Button colorType="primary" label={t('subscription.upgrade_now')} fullWidth/>
            </a>
        </Card>
    );
}