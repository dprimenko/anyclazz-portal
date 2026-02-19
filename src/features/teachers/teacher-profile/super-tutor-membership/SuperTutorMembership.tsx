import type { Teacher, TeacherRepository } from "../../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { useTranslations } from "@/i18n";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Card } from "@/ui-library/components/ssr/card/Card";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Button } from "@/ui-library/components/ssr/button/Button";

export function SuperTutorMembership({ teacher, accessToken, repository }: { teacher: Teacher; accessToken: string; repository: TeacherRepository; }) {
    const t = useTranslations();

    const pricingOptions = [
        {
            id: 'weekly',
            label: 'Weekly',
            price: 4.99,
            currency: 'USD',
        },
        {
            id: 'monthly',
            label: 'Monthly',
            price: 7.99,
            currency: 'USD',
        },
        {
            id: 'annually',
            label: 'Annually',
            price: 34.99,
            currency: 'USD',
        },
    ];  

    return (
        <div className="mt-6 flex flex-col gap-8">
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">Boost your profile</Text>
                <Text size="text-md" colorType="tertiary">Supertutors increase their chance of getting new students by a 78%</Text>
            </div>
            <Divider />
            <div>
                <div className="flex flex-col gap-[2px]">
                    <Text size="text-md" weight="medium" colorType="primary">Stand out and attract more students</Text>
                    <Text size="text-md" colorType="tertiary">By becoming a Super Tutor, you’ll get a verified badge, higher visibility, and exclusive features to grow your teaching career.</Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-6">
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="verified" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">Verified Badge</Text>
                            <Text size="text-sm" colorType="tertiary">Build trust with students and show your professionalism.</Text>
                        </div>
                    </Card>
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="rocket-02" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">Priority Listing</Text>
                            <Text size="text-sm" colorType="tertiary">Your profile appears higher in search results.</Text>
                        </div>
                    </Card>
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="annotation-check" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">Priority Listing</Text>
                            <Text size="text-sm" colorType="tertiary">Your profile appears higher in search results.</Text>
                        </div>
                    </Card>
                </div>
            </div>
            <Divider />
            <div>
                <div className="flex flex-col">
                    <Text size="text-sm" weight="medium" colorType="secondary">Pricing</Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-6">
                    {pricingOptions.map(option => (
                        <Card key={option.id} className="p-4 md:p-6 flex flex-col items-center border-1 !border-[var(--color-primary-200)] bg-[var(--color-primary-100)]">
                            <Text size="text-md" weight="semibold" colorType="primary">{option.label}</Text>
                            <Space size={20} direction="vertical" />
                            <Text size="text-3xl" weight="semibold" colorType="primary">$ {option.price}</Text>
                            <Space size={12} direction="vertical" />
                            <Text size="text-sm" colorType="tertiary">(You can cancel anytime)</Text>
                            <Space size={20} direction="vertical" />
                            <Space size={16} direction="vertical" />
                            <Button colorType="primary" label="Boost your profile" fullWidth onClick={() => alert(`Subscribed to ${option.label} plan`)} />
                        </Card>
                    ))}
                </div>
            </div>
            <Space size={48} />
        </div>
    );
}
