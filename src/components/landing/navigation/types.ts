
export interface NavigationItem {
  title: string;
  path: string;
}

export interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isMobile?: boolean;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavClick: (path: string) => void;
}

export interface DesktopMenuProps {
  navigationItems: NavigationItem[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavClick: (path: string) => void;
}
