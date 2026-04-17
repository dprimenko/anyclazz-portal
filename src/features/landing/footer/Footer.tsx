import { Text } from "@/ui-library/components/ssr/text/Text";

const footerSections = [
    {
        title: "For Students",
        links: [
            { label: "Find Teachers", href: "/teachers" },
            { label: "How it Works", href: "/how-it-works" }
        ]
    },
    {
        title: "For Teachers",
        links: [
            { label: "Become a Teacher", href: "/api/auth/keycloak-register?role=teacher" },
            { label: "Teacher Resources", href: "/resources" },
            { label: "Teacher Support", href: "/support" }
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/legal/privacy-policy" },
            { label: "Terms & Conditions", href: "/legal/terms-and-conditions" },
            { label: "Cookie Policy", href: "/legal/cookie-policy" },
            { label: "Legal Notice", href: "/legal/legal-notice" }
        ]
    }
];

export function Footer() {
    return (
        <footer className="relative w-full overflow-hidden">
            {/* Dot pattern background */}
            <div 
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle, var(--color-primary-700) 2px, transparent 2px)`,
                    backgroundSize: '28px 28px',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)'
                }}
            />
            
            <div className="container m-auto px-4 md:px-12 pt-16 pb-5 md:pb-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                    {/* Logo */}
                    <div>
                        <img 
                            src="/images/logo.svg" 
                            alt="Anyclazz" 
                            className="h-12"
                        />
                    </div>
                    
                    {/* Footer sections */}
                    <div className="grid grid-cols-1 md:grid-cols-[max-content_max-content_max-content] gap-12 md:gap-8 mb-16 md:justify-self-end">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <Text 
                                    colorType="tertiary" 
                                    weight="semibold" 
                                    size="text-sm"
                                    className="mb-6"
                                >
                                    {section.title}
                                </Text>
                                <ul className="flex flex-col gap-4">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a 
                                                href={link.href}
                                            >
                                                <Text colorType="secondary" size="text-md" weight="semibold" className="hover:underline">
                                                    {link.label}
                                                </Text>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="pt-8 border-t border-[var(--color-neutral-200)] w-full flex flex-row justify-center">
                    <Text colorType="tertiary" size="text-base" className="text-center">
                        © 2025 Anyclazz, All rights reserved.
                    </Text>
                </div>
            </div>
        </footer>
    );
}
