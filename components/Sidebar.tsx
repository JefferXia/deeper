'use client';

import { cn } from '@/lib/utils';
import { Crown, BotMessageSquare, FileVideo, Sparkles, CircleUserRound, Flame, Shovel, BookOpenText, Home, Search, SquarePen, Settings, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';
import ThemeSwitcher from './theme/Switcher';
import LangSwitcher from './theme/Lang';
import { useTranslations } from 'use-intl'
import { useTheme } from 'next-themes'
import { useGlobalContext } from '@/app/globalcontext'
import Login from "@/components/Login"
import { AvatarDropdown } from './avatar-dropdown'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = useTranslations();
  const { theme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState(theme) 
  const {
    userInfo,
    loginModalOpen,
    setLoginModalOpen,
    language,
    setLanguage
  } = useGlobalContext()

  const navLinks = [
    {
      icon: FileVideo,
      href: '/',
      active: segments.length === 0,
      label: t('side_bar.home_btn')
    },
    {
      icon: Sparkles,
      href: '/hot',
      active: segments.includes('hot') || segments.includes('video-analysis'),
      label: t('side_bar.hot_btn')
    },
    {
      icon: BotMessageSquare,
      href: '/ask',
      active: segments.includes('ask') || segments.includes('c'),
      label: t('side_bar.ask_btn')
    },
    // {
    //   icon: BookOpenText,
    //   href: '/library',
    //   active: segments.includes('library'),
    //   label: '记录',
    // },
  ];

  return (
    <div>
      <div className="group hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col hover:w-[230px] overflow-hidden transition-[width] duration-500 ease-in-out">
        <div className="w-[230px] flex grow flex-col items-start justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary py-8">
          <div className='w-full transition-[padding] duration-500 px-5 group-hover:px-8'>
            <a className='flex items-center mb-10 transition-all duration-500 whitespace-nowrap' href="/">
              <div className='flex justify-center items-center mr-[10px] w-[40px] h-[40px] rounded-full bg-[#24A0ED]'>
                <Clapperboard />
              </div>
              <div className='text-xl font-medium invisible group-hover:visible'>TopMind</div>
            </a>
            <VerticalIconContainer>
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={cn(
                    'relative flex items-center justify-start cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-500 transition-all w-full px-2 group-hover:px-3 py-2 rounded-lg',
                    link.active
                      ? 'text-black dark:text-white'
                      : 'text-black/70 dark:text-white/70',
                  )}
                >
                  <link.icon />
                  <div className='text-base ml-3 font-medium invisible group-hover:visible'>{link.label}</div>
                  {/* {link.active && (
                    <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white" />
                  )} */}
                </Link>
              ))}
            </VerticalIconContainer>
          </div>
          <div className='w-full transition-all duration-500 px-7'>
            <div className='w-full invisible group-hover:visible'>
              {/* 登录 */}
              {!userInfo?.email ? (
                <AlertDialog
                  open={loginModalOpen}
                  onOpenChange={setLoginModalOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full mb-3 py-2.5 rounded-xl text-[#FFFFFF] animate-[fadeIn_500ms_ease-in-out] bg-[#24A0ED] hover:bg-[#24A0ED]/90 flex items-center justify-center"
                    >
                      {t('side_bar.btn_login')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="p-0 w-auto overflow-hidden">
                    <AlertDialogHeader className="hidden">
                      <AlertDialogTitle>Login</AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel
                      className="absolute top-0 right-0 border-0 pt-4 hover:bg-none dark:bg-[#272727]"
                      onClick={() => setLoginModalOpen(false)}
                    >
                      <X className="text-close-login" />
                    </AlertDialogCancel>
                    <Login 
                      theme={currentTheme}
                      darkMainColor={'#FF2E4D'}
                      locale={language}
                    />
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <>
                  <div className='flex justify-around items-center mb-2'>
                    <AvatarDropdown />
                    <p className='text-xs'>
                      {t('side_bar.credits_label')}
                      <span>10</span>
                      {t('side_bar.credits_unit')}
                    </p>
                  </div>
                  <Button 
                    className="w-full mb-3 py-2.5 rounded-xl text-[#FFFFFF] animate-[fadeIn_500ms_ease-in-out] bg-[#24A0ED] hover:bg-[#24A0ED]/90 flex items-center justify-center"
                  >
                    <Crown className="text-[#F8da51] mr-2 h-4 w-4" />
                    {t('side_bar.upgrade')}
                  </Button>
                </>
              )}
              <div className='flex justify-around'>
                <LangSwitcher />
                <span>|</span>
                <ThemeSwitcher />
              </div>
            </div>
            <CircleUserRound className='cursor-pointer visible group-hover:invisible' />
          </div>
          {/* <Settings
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="cursor-pointer"
          />

          <SettingsDialog
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
          /> */}
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-black dark:text-white'
                : 'text-black dark:text-white/70',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white" />
            )}
            <link.icon />
            <div className="text-xs block">{link.label}</div>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
