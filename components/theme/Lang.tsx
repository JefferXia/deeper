'use client';
import { Globe } from 'lucide-react';
import { useState, useContext } from 'react';
import { useGlobalContext } from '@/app/globalcontext';
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

const LangSwitcher = () => {
  const { language, setLanguage } = useGlobalContext();
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Globe
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          <DropdownMenuRadioItem value="cn">{t('side_bar.cn_mode')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">{t('side_bar.en_mode')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangSwitcher;
