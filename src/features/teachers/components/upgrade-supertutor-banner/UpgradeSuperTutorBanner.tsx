import { Card } from "@/ui-library/components/ssr/card/Card";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { IconButton } from "@/ui-library/shared/icon-button";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";

export function UpgradeSuperTutorBanner() {
    return (
        <Card className="p-4">
            <div className="flex flex-row items-between">
                <IconButton icon="verified" size="sm" iconSize={20}/>
            </div>
            <Space size={12} direction="vertical"/>
            <Text size="text-sm" weight="semibold" colorType="primary">Upgrade to Super Tutor</Text>
            <Space size={4} direction="vertical"/>
            <Text size="text-sm" colorType="tertiary">Get your verified badge and start standing out today.</Text>
            <Space size={16} direction="vertical"/>
            <a href="/profile?tab=super_tutor" className="w-full">
                <Button colorType="primary" label="Upgrade Now" fullWidth/>
            </a>
        </Card>
    );
}