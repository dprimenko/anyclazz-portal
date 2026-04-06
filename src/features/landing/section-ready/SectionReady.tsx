import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useTranslations } from "@/i18n";

interface SectionReadyProps {
    lang?: 'en' | 'es';
}

export function SectionReady({ lang }: SectionReadyProps) {
    const t = useTranslations({ lang });

    return (
        <div className="container m-auto flex flex-col w-full px-4 py-16 md:py-24" data-testid="section-ready">
            <div className="flex flex-col items-center gap-5">
                <Text weight="semibold" textLevel="h1" className="!text-3xl md:!text-7xl !text-[#FFFDFB]" textalign="center">
                    {t('landing.ready.title')}
                </Text>
                <Text textalign="center" className="!text-lg md:!text-xl !text-[#FFEACF]">
                    {t('landing.ready.subtitle')}
                </Text>
            </div>
            <div className="flex justify-center mt-11">
                <a href="/api/auth/keycloak-register?role=student">
                    <Button label={t('landing.ready.cta')} colorType="secondary" size="lg" />
                </a>
            </div>
        </div>
    );
}