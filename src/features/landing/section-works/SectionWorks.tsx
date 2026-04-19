import { useEffect } from "react";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { getImageUrl } from "@/utils/getImageUrl";

import worksImage1WebP from "@/assets/images/landing/anyclazz-works-1.webp";
import worksImage2WebP from "@/assets/images/landing/anyclazz-works-2.webp";
import worksImage3WebP from "@/assets/images/landing/anyclazz-works-3.webp";

export function SectionWorks() {
    const steps = [
        {
            id: 1,
            label: "STEP 1",
            title: "Create your profile — free, takes 10 minutes",
            description: "Add your subject, experience, and rates. No approval wait. You're live as soon as you finish.",
            image: getImageUrl(worksImage1WebP)
        },
        {
            id: 2,
            label: "STEP 2",
            title: "Post your intro video",
            description: "30–60 seconds on your phone. Students browse teacher videos like a feed — yours is how they find and choose you.",
            image: getImageUrl(worksImage2WebP)
        },
        {
            id: 3,
            label: "STEP 3",
            title: "Teach and get paid — instantly",
            description: "Class ends. Payment hits your account. No pending, no chasing, no waiting. Every single time.",
            image: getImageUrl(worksImage3WebP)
        }
    ];
    
    useEffect(() => {
        const buttons = document.querySelectorAll('[data-step-id]');
        const image = document.querySelector('[data-works-image]') as HTMLImageElement;
        
        const handleClick = (e: Event) => {
            const button = (e.currentTarget as HTMLElement);
            const stepId = button.getAttribute('data-step-id');
            
            // Remove active class from all buttons
            buttons.forEach(btn => {
                btn.classList.remove('border-[var(--color-primary-700)]');
                btn.classList.add('border-gray-200', 'opacity-60');
            });
            
            // Add active class to clicked button
            button.classList.add('border-[var(--color-primary-700)]');
            button.classList.remove('border-gray-200', 'opacity-60');
            
            // Change image
            const step = steps.find(s => s.id === Number(stepId));
            if (step && image) {
                image.src = step.image;
            }
        };
        
        buttons.forEach(button => {
            button.addEventListener('click', handleClick);
        });
        
        return () => {
            buttons.forEach(button => {
                button.removeEventListener('click', handleClick);
            });
        };
    }, []);

    return (
        <div className="container m-auto flex flex-col w-full px-4 gap-12 py-16 md:py-24 md:gap-24" data-testid="section-works">
            <div className="flex flex-col">
                <Space size={12} direction="vertical" />
                <Text colorType="primary" weight="semibold" textLevel="h2" className="!text-3xl md:!text-4xl">
                    From sign-up to first booking — faster than you'd expect.
                </Text>
                <Space size={16} direction="vertical" />
                <Text colorType="tertiary" className="!text-base md:!text-lg max-w-[50ch]">
                    No approval process. No cold outreach. No waiting days to see your money. Here's how it works from the moment you join.
                </Text>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-16">
                <div className="flex flex-col w-full md:w-1/2">            
                    <div className="flex flex-col">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                data-step-id={step.id}
                                className={`flex flex-col gap-3 text-left border-l-4 pl-6 transition-all py-4 ${
                                    index === 0
                                        ? 'border-[var(--color-primary-700)]' 
                                        : 'border-gray-200 opacity-60 hover:opacity-80'
                                }`}
                            >
                                <Text colorType="accent" weight="semibold" size="text-md">
                                    {step.label}
                                </Text>
                                <Text colorType="primary" weight="semibold" size="text-lg">
                                    {step.title}
                                </Text>
                                <Text colorType="tertiary" size="text-md">
                                    {step.description}
                                </Text>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex w-full md:w-1/2 items-center justify-center">
                    <div className="relative w-full aspect-[432/461] rounded-2xl overflow-hidden bg-[#FFF9F2]">
                        <img 
                            data-works-image
                            src={steps[0].image} 
                            alt="How AnyClazz Works" 
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(0deg, rgba(244, 164, 58, 0.63) 0%, rgba(244, 164, 58, 0) 37.27%)"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}