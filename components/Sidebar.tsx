'use client';
import { cn } from '@/lib/utils';
import { MessageCircleQuestion, BotMessageSquare, FileVideo, Sparkles, Clapperboard, LayoutDashboard, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
// import SettingsDialog from './SettingsDialog';
import { useTranslations } from 'use-intl'
import { useGlobalContext } from '@/app/globalcontext'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const {
    userInfo
  } = useGlobalContext()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = useTranslations();

  const myNavLinks = [
    {
      icon: LayoutDashboard,
      href: '/dashboard',
      active: segments.includes('dashboard'),
      label: t('side_bar.dashboard_btn')
    },
    {
      icon: UserRound,
      href: '/profile',
      active: segments.includes('profile'),
      label: t('side_bar.profile_btn')
    }
  ];
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
              {userInfo?.uid && myNavLinks.map((link, i) => (
                <Link
                  key={`my-${i}`}
                  href={link.href}
                  className={cn(
                    'relative flex items-center justify-start cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-500 transition-all w-full px-2 group-hover:px-3 py-2 rounded-lg',
                    link.active
                      ? 'text-black dark:text-white'
                      : 'text-black/70 dark:text-white/70',
                  )}
                >
                  {link.active ? <link.icon color="#24A0ED" /> : <link.icon />} 
                  <div className='text-base ml-3 font-medium invisible group-hover:visible'>{link.label}</div>
                </Link>
              ))}
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
                  {link.active ? <link.icon color="#24A0ED" /> : <link.icon />} 
                  <div className='text-base ml-3 font-medium invisible group-hover:visible'>{link.label}</div>
                </Link>
              ))}
            </VerticalIconContainer>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>              
              <div className='flex transition-all duration-500 px-7 cursor-pointer'>                
                <MessageCircleQuestion />
                <div className='text-base ml-3 font-medium invisible group-hover:visible'>{t('side_bar.join_group')}</div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="right" className="w-[208px]">
              <div className="bg-white rounded-lg flex items-center justify-center flex-col relative overflow-hidden">
                <Image
                  src={
                    '/images/wechat-group.jpg'
                  }
                  alt={'join wechat group'}
                  width={208}
                  height={208}
                />
              </div>
            </HoverCardContent>
          </HoverCard> 

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
