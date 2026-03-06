import { useEffect } from "react";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";

const testimonials = [
    {
        id: 1,
        name: "Emily Thompson",
        role: "Student",
        subject: "Maths",
        rating: 5,
        quote: "Super intuitive and easy to use. I love how I can connect with teachers that truly understand my goals. Makes studying feel less like a chore and more like an adventure.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"
    },
    {
        id: 2,
        name: "Javier Morales",
        role: "Student",
        subject: "Español",
        rating: 5,
        quote: "Super intuitive and easy to use. I love how I can connect with teachers that truly understand my goals. Makes studying feel less like a chore and more like an adventure.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
    },
    {
        id: 3,
        name: "Aisha Patel",
        role: "Student",
        subject: "Sciences",
        rating: 5,
        quote: "The platform has completely transformed my learning experience. Finding qualified teachers in my area was never this easy before.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop"
    },
    {
        id: 4,
        name: "Lucas Nguyen",
        role: "Student",
        subject: "Photography",
        rating: 5,
        quote: "Amazing platform with incredible teachers. The flexibility and quality of instruction exceeded all my expectations.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop"
    }
];

export function SectionTestimonials() {
    useEffect(() => {
        const prevBtn = document.querySelector('[data-testimonial-prev]');
        const nextBtn = document.querySelector('[data-testimonial-next]');
        const container = document.querySelector('[data-testimonials-container]') as HTMLElement;
        
        if (!container) {
            return;
        }
        
        const handlePrev = () => {
            const cardWidth = container.querySelector('[data-testimonial-card]')?.getBoundingClientRect().width || 0;
            const gap = 24; // 6 * 4px (gap-6)
            container.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        };
        
        const handleNext = () => {
            const cardWidth = container.querySelector('[data-testimonial-card]')?.getBoundingClientRect().width || 0;
            const gap = 24; // 6 * 4px (gap-6)
            container.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        };
        
        prevBtn?.addEventListener('click', handlePrev);
        nextBtn?.addEventListener('click', handleNext);
        
        return () => {
            prevBtn?.removeEventListener('click', handlePrev);
            nextBtn?.removeEventListener('click', handleNext);
        };
    }, []);

    return (
        <div className="w-full py-16 md:py-24" data-testid="section-testimonials">
            <div className="container m-auto px-4">
                <div className="flex flex-col gap-4 mb-12">
                    <Text colorType="primary" weight="semibold" textLevel="h2" className="!text-3xl md:!text-4xl">
                        What Our Students Say
                    </Text>
                    <Text colorType="tertiary" className="!text-base md:!text-lg">
                        Real stories from students who achieved their goals
                    </Text>
                </div>
                
                <div className="relative">
                    <div 
                        data-testimonials-container
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    data-testimonial-card
                                    className="flex-shrink-0 w-[calc(83.33%-12px)] md:w-[calc(40%-12px)] lg:w-[calc(28.57%-12px)] snap-start group"
                                >
                                    <div className="relative h-[420px] md:h-[460px] rounded-2xl overflow-hidden">
                                        <img 
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                        
                                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3 backdrop-blur-xl m-6 rounded-xl border border-white/10">
                                            <div className="flex gap-1">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1">
                                                <Text weight="semibold" size="text-xl" className="!text-[var(--color-neutral-100)]">
                                                    {testimonial.name}
                                                </Text>
                                                <Text size="text-sm" className="!text-[var(--color-neutral-100)]">
                                                    {testimonial.role}
                                                </Text>
                                                <Text size="text-sm" className="!text-[var(--color-neutral-100)]">
                                                    {testimonial.subject}
                                                </Text>
                                            </div>
                                            
                                            <div className="max-h-[200px] md:max-h-0 group-hover:max-h-[200px] overflow-hidden transition-all duration-500 ease-out">
                                                <Text size="text-sm" className="!text-[var(--color-neutral-100)] leading-relaxed">
                                                    "{testimonial.quote}"
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    
                    <div className="flex gap-8 mt-8">
                        <button
                            data-testimonial-prev
                            className="w-14 h-14 flex items-center justify-center rounded-full border border-[var(--color-neutral-200)] hover:border-[var(--color-primary-700)] transition-all cursor-pointer"
                        >
                            <Icon icon="arrow-left" iconWidth={24} iconHeight={24} />
                        </button>
                        <button
                            data-testimonial-next
                            className="w-14 h-14 flex items-center justify-center rounded-full border border-[var(--color-neutral-200)] hover:border-[var(--color-primary-700)] transition-all cursor-pointer"
                        >
                            <Icon icon="arrow-right" iconWidth={24} iconHeight={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
