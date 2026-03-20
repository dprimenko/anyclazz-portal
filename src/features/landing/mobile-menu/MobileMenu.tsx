import { useState, useEffect, type FC } from 'react';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';

interface MobileMenuProps {
  isLoggedIn?: boolean;
}

const menuSections = [
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
    }
];

export const MobileMenu: FC<MobileMenuProps> = ({ isLoggedIn = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log('🚪 Logout button clicked');
    
    // Limpiar caché del usuario
    try {
      localStorage.removeItem('anyclazz_user_profile');
      localStorage.removeItem('anyclazz_user_profile_expiry');
      console.log('🗑️  User cache cleared');
    } catch (error) {
      console.error('Error clearing user cache:', error);
    }
    
    console.log('📍 Current location:', window.location.href);
    console.log('🍪 Current cookies:', document.cookie);
    console.log('➡️  Redirecting to: /api/auth/keycloak-logout');
    
    // Redirigir GET al endpoint
    window.location.href = '/api/auth/keycloak-logout';
    
    console.log('✅ Redirect initiated');
  };

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburguesa - solo visible en mobile */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 bg-transparent border-none cursor-pointer md:hidden"
        aria-label="Open menu"
      >
        <Icon icon="menu" iconWidth={24} iconHeight={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] animate-fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Drawer - solo renderizar cuando está abierto o en transición */}
      {isOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-full bg-white z-[1000] flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.1)]">
          <div className="container m-auto flex flex-row justify-between py-4.5 px-4">
            <a href="/" onClick={closeMenu}>
              <img src="/images/logo.svg" className="w-[139px] h-[44px]" alt="Anyclazz Logo" />
            </a>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center p-2 bg-transparent border-none cursor-pointer text-[var(--color-neutral-700)]"
              aria-label="Close menu"
            >
              <Icon icon="close" iconWidth={24} iconHeight={24} iconColor="#414651" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-5">
            {/* Footer sections */}
            <div className="grid grid-cols-1 md:grid-cols-[max-content_max-content_max-content] gap-12 md:gap-8 mb-16 md:justify-self-end">
                {menuSections.map((section) => (
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

          {/* Footer con botones */}
          <div className="flex flex-col gap-3 p-5 border-t border-[var(--color-neutral-200)] bg-white">
            {!isLoggedIn ? (
              <>
                <Button 
                  label="Get Started" 
                  colorType="primary" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/api/auth/keycloak-register?role=student';
                  }}
                />
                <Button 
                  label="Log In" 
                  colorType="secondary" 
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                />
              </>
            ) : (
              <>
                <Button 
                  label="Go to Dashboard" 
                  colorType="primary" 
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/dashboard';
                  }}
                />
                <Button 
                  label="Sign Out" 
                  colorType="secondary" 
                  size="lg"
                  className="w-full"
                  onClick={handleLogout}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
