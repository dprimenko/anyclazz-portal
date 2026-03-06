import { Space } from "@/ui-library/components/ssr/space/Space";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { OptimizedLandingImage } from "@/ui-library/components/ssr/optimized-landing-image/OptimizedLandingImage";
import { getImageUrl } from "@/utils/getImageUrl";
import heroImageWebP from "@/assets/images/landing/hero.webp";

export function Hero() {
    const imageUrl = getImageUrl(heroImageWebP);
    
    return (
        <div className="container m-auto flex flex-col w-full px-4" data-testid="landing-hero">
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="max-w-[72ch]">
                    <Text colorType="primary" weight="semibold" textLevel="h1" className="!text-3xl md:!text-6xl" textalign="center">
                        Master Any Subject With Expert Teachers
                    </Text>
                </div>
                <div className="max-w-[64ch]">
                    <Text colorType="tertiary" textLevel="h3" textalign="center" className="!text-lg md:!text-xl">Connect with passionate educators across all subjects. Learn online, in-person, or in groups with personalized attention.</Text>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-3 mt-5 w-full md:w-auto md:mt-6">
                    <Button label='Start Learning Today' colorType='primary' size='xl' className="shrink-0 w-full md:w-auto" />
                    <Button label='Watch Demo' colorType='secondary' size='xl' className="shrink-0 w-full md:w-auto" icon="play-circle" />
                </div>
            </div>
            <Space size={64} direction="vertical" />
            <div 
                className="relative w-full h-[240px] md:h-[520px] rounded-xl p-5 overflow-hidden"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${imageUrl}')`,
                        transform: "scaleX(-1)"
                    }}
                />
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(-94.99deg, rgba(244, 164, 58, 0) 51.85%, var(--color-primary-700) 87.14%)"
                    }}
                />
                <div className="absolute bottom-0 left-[20px] md:left-[53px] z-2 w-[120px] md:w-[261.52px] h-auto">
                    <OptimizedLandingImage image="booking-preview-1" />
                </div>
                
                <div className="absolute bottom-0 left-[90px] md:left-[185px] z-3 w-[120px] md:w-[261.52px] h-auto">
                    <OptimizedLandingImage image="booking-preview-2" />
                </div>
            </div>
            <Space size={96} direction="vertical" />
            <div className="flex flex-col-reverse md:flex-row w-full gap-12 md:gap-24 md:mt-[104px]">
                <div className="relative w-full aspect-[592/560] bg-[var(--color-primary-700)] rounded-2xl overflow-visible">
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%]">
                        <OptimizedLandingImage image="growing-preview" />
                    </div>
                </div>
                <div className="grow-1 flex flex-col w-full">
                    <Text colorType="primary" weight="semibold" textLevel="h2" className="!text-3xl md:!text-5xl max-w-[18ch]">
                        A Growing Global Learning Community
                    </Text>
                    <Space size={20} direction="vertical" />
                    <Text colorType="tertiary" textLevel="h4" size="text-lg">
                        Thousands of students and teachers around the world are already connecting through AnyClazz to share knowledge, skills, and experiences — one lesson at a time.
                    </Text>
                    <Space size={64} direction="vertical" />
                    <div className="grid md:grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-x-20 md:gap-y-12">
                        <div className="flex flex-col gap-2">
                            <Text colorType="accent" weight="semibold" className="!text-4xl md:!text-5xl">
                                50,000+
                            </Text>
                            <Text colorType="primary" weight="medium" className="!text-sm md:!text-base">
                                Expert Teachers
                            </Text>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text colorType="accent" weight="semibold" className="!text-4xl md:!text-5xl">
                                500,000+
                            </Text>
                            <Text colorType="primary" weight="medium" className="!text-sm md:!text-base">
                                Happy Students
                            </Text>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text colorType="accent" weight="semibold" className="!text-4xl md:!text-5xl">
                                180+
                            </Text>
                            <Text colorType="primary" weight="medium" className="!text-sm md:!text-base">
                                Subjects Taught
                            </Text>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Text colorType="accent" weight="semibold" className="!text-4xl md:!text-5xl">
                                95%
                            </Text>
                            <Text colorType="primary" weight="medium" className="!text-sm md:!text-base">
                                Success Rate
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            <Space size={96} direction="vertical" />
        </div>
    );
}