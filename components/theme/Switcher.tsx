'use client';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, MonitorIcon, SunMoon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Select } from '../SettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'use-intl'

type Theme = 'dark' | 'light' | 'system';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isTheme = useCallback((t: Theme) => t === theme, [theme]);
  const t = useTranslations();

  const handleThemeSwitch = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isTheme('system')) {
      const preferDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );

      const detectThemeChange = (event: MediaQueryListEvent) => {
        const theme: Theme = event.matches ? 'dark' : 'light';
        setTheme(theme);
      };

      preferDarkScheme.addEventListener('change', detectThemeChange);

      return () => {
        preferDarkScheme.removeEventListener('change', detectThemeChange);
      };
    }
  }, [isTheme, setTheme, theme]);

  // Avoid Hydration Mismatch
  if (!mounted) {
    return null;
  }

  return (
    // <Select
    //   className={className}
    //   value={theme}
    //   onChange={(e) => handleThemeSwitch(e.target.value as Theme)}
    //   options={[
    //     { value: 'light', label: 'Light' },
    //     { value: 'dark', label: 'Dark' },
    //   ]}
    // />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SunMoon
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="dark">{t('side_bar.dark_mode')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">{t('side_bar.light_mode')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
