import { useEffect } from "react";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { getImageUrl } from "@/utils/getImageUrl";

import worksImage1WebP from "@/assets/images/landing/anyclazz-works-1.webp";
import worksImage2WebP from "@/assets/images/landing/anyclazz-works-2.webp";
import worksImage3WebP from "@/assets/images/landing/anyclazz-works-3.webp";
import worksImage1Jpg from "@/assets/images/landing/anyclazz-works-1-optimized.jpg";
import worksImage2Jpg from "@/assets/images/landing/anyclazz-works-2-optimized.jpg";
import worksImage3Jpg from "@/assets/images/landing/anyclazz-works-3-optimized.jpg";

interface SectionWorksProps {
    worksImage1Url?: string;
    worksImage2Url?: string;
    worksImage3Url?: string;
}

export function SectionWorks({ worksImage1Url, worksImage2Url, worksImage3Url }: SectionWorksProps = {}) {
    const steps = [
        {
            id: 1,
            label: "Step 1",
            title: "Choose Your Subject",
            description: "Browse our extensive catalog of subjects and find the perfect match for your learning goals.",
            image: worksImage1Url || getImageUrl(worksImage1WebP),
            fallback: getImageUrl(worksImage1Jpg)
        },
        {
            id: 2,
            label: "Step 2",
            title: "Connect with a Teacher",
            description: "Review teacher profiles, ratings, and experience to select the perfect educator for your needs.",
            image: worksImage2Url || getImageUrl(worksImage2WebP),
            fallback: getImageUrl(worksImage2Jpg)
        },
        {
            id: 3,
            label: "Step 3",
            title: "Start Learning",
            description: "Begin your personalized learning journey with flexible scheduling and interactive lessons.",
            image: worksImage3Url || getImageUrl(worksImage3WebP),
            fallback: getImageUrl(worksImage3Jpg)
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
                <Text colorType="accent" weight="semibold" className="!text-sm md:!text-base">
                    How AnyClazz Works
                </Text>
                <Space size={12} direction="vertical" />
                <Text colorType="primary" weight="semibold" textLevel="h2" className="!text-3xl md:!text-4xl">
                    From Choosing a Subject to Your First Lesson
                </Text>
                <Space size={16} direction="vertical" />
                <Text colorType="tertiary" className="!text-base md:!text-lg max-w-[50ch]">
                    Spend smarter, lower your bills, get cashback on everything you buy, and unlock credit to grow your business.
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