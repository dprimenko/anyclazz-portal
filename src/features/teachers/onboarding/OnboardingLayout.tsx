import { useTranslations } from '@/i18n';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Space } from '@/ui-library/components/ssr/space/Space';

interface OnboardingLayoutProps {
    currentStep: number;
    totalSteps?: number;
    children: React.ReactNode;
}

export default function OnboardingLayout({ totalSteps = 4, children }: OnboardingLayoutProps) {
    const currentStep = 2;
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
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#FFFDFB]">
            {/* Left Sidebar - Desktop only */}
            <div className="hidden md:flex md:w-64 lg:w-80 bg-[var(--color-bg-active)] p-8">
                <div className="flex flex-col w-full">
                    {/* Logo */}
                    <div>
                        <img src="/images/logo.svg" alt="Anyclazz" className="w-[139px]" />
                    </div>

                    <Space size={80} direction="vertical" />

                    {/* Steps */}
                    <div className="flex flex-col gap-4">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;

                            return (
                                <div key={index} className={`flex items-start gap-4 ${!isActive && 'opacity-60'}`}>
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
                                    <div className="flex-1">
                                        <p className={`text-md font-semibold text-[var(--color-neutral-700)]`}>
                                            {step.title}
                                        </p>
                                        <p className={`text-md text-[var(--color-neutral-600)]`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md lg:max-w-lg">
                    {/* Mobile Header with Logo */}
                    <div className="md:hidden mb-8">
                        <img src="/images/logo.svg" alt="Anyclazz" className="h-8 mb-6" />
                        <div className="flex gap-1.5 mb-6">
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`h-1 flex-1 rounded-full ${
                                        index + 1 <= currentStep ? 'bg-[#F4A43A]' : 'bg-[#E9EAEB]'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Step Icon - Mobile */}
                    <div className="md:hidden mb-6 flex justify-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#FEF8F0]">
                            <span className="text-[#F4A43A]">
                                {steps[currentStep - 1]?.icon}
                            </span>
                        </div>
                    </div>

                    {/* Step Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
