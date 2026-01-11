import { useTranslations } from '@/i18n';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Space } from '@/ui-library/components/ssr/space/Space';

interface OnboardingLayoutProps {
    currentStep: number;
    totalSteps?: number;
    children: React.ReactNode;
}

export default function OnboardingLayout({ currentStep, totalSteps = 4, children }: OnboardingLayoutProps) {
    const t = useTranslations();

    const steps = [
        {
            icon: 'book-closed',
            title: t('onboarding.sidebar.teaching_info.title'),
            description: t('onboarding.sidebar.teaching_info.description'),
        },
        {
            icon: 'laptop',
            title: t('onboarding.sidebar.class_modality.title'),
            description: t('onboarding.sidebar.class_modality.description'),
        },
        {
            icon: 'layout-alt-02',
            title: t('onboarding.sidebar.profile_basics.title'),
            description: t('onboarding.sidebar.profile_basics.description'),
        },
        {
            icon: 'image-user',
            title: t('onboarding.sidebar.quick_intro.title'),
            description: t('onboarding.sidebar.quick_intro.description'),
        },
    ];

    return (
        <div className="flex flex-col md:flex-row w-full h-screen md:min-h-screen bg-[#FFFDFB]">
            {/* Left Sidebar - Desktop only */}
            <div className="hidden md:flex md:w-64 lg:w-80 bg-[var(--color-bg-active)] p-8">
                <div className="flex flex-col w-full">
                    {/* Logo */}
                    <div>
                        <img src="/images/logo.svg" alt="Anyclazz" className="w-[139px]" />
                    </div>

                    <Space size={80} direction="vertical" />

                    {/* Steps */}
                    <div className="flex flex-col gap-4 overflow-y-auto flex-1">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={index} className="relative">
                                    <div className={`flex items-start gap-4 ${!isActive && 'opacity-60'}`}>
                                        <div className="relative flex flex-col items-center">
                                            <div className={`p-3 flex items-center justify-center rounded-lg flex-shrink-0 ${
                                                isActive 
                                                    ? 'bg-[#FFF4E7] border-2 border-[var(--color-primary-700)]' 
                                                    : isCompleted 
                                                        ? 'bg-[#FFF4E7]' 
                                                        : 'bg-[var(--color-bg-tertiary)] border border-[#E9EAEB]'
                                            }`}>
                                                {isActive && (
                                                    <Icon icon={step.icon} iconWidth={24} iconHeight={24} iconColor={'#F4A43A'} />
                                                )}

                                                {!isActive && !isCompleted && (
                                                    <Icon icon={step.icon} iconWidth={24} iconHeight={24} iconColor={'#717680'} />
                                                )}

                                                {!isActive && isCompleted && (
                                                    <Icon icon={step.icon} iconWidth={24} iconHeight={24} iconColor={'#F4A43A'} />
                                                )}
                                            </div>
                                            
                                            {/* Línea vertical conectora */}
                                            {!isLast && (
                                                <div className="w-[2px] h-[48px] bg-[#E9EAEB] mt-2"></div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className={`text-md font-semibold text-[var(--color-neutral-700)]`}>
                                                {step.title}
                                            </p>
                                            <p className={`text-md text-[var(--color-neutral-600)]`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex md:items-center md:justify-center p-6 md:p-12 overflow-y-auto">
                <div className="w-full max-w-md lg:max-w-lg my-auto md:my-0">
                    {/* Mobile Header with Logo */}
                    <div className="md:hidden h-24 flex items-center">
                        <img src="/images/logo.svg" alt="Anyclazz" className="w-[139px]" />
                    </div>

                    <div className="md:hidden flex gap-2 mt-5 mb-10 justify-center">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`w-2.5 h-2.5 rounded-full ${
                                    index + 1 <= currentStep ? 'bg-[#F4A43A]' : 'bg-[#E9EAEB]'
                                }`}
                            ></div>
                        ))}
                    </div>

                    {/* Step Icon - Mobile */}
                    <div className="md:hidden mb-6 flex justify-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#FEF8F0]">
                            <Icon 
                                icon={steps[currentStep - 1]?.icon} 
                                iconWidth={32} 
                                iconHeight={32} 
                                iconColor={'#F4A43A'} 
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
