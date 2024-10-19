'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { X } from 'lucide-react'
import { Crown } from 'lucide-react';
import Login from "@/components/Login"
import { AvatarDropdown } from './AvatarDropdown'
import { Button } from "@/components/ui/button"
import ThemeSwitcher from './theme/Switcher';
import LangSwitcher from './theme/Lang';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { useTheme } from 'next-themes'
import { useTranslations } from 'use-intl'
import { useGlobalContext } from '@/app/globalcontext'

const Header = () => {
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

  return (
    <header
      className="fixed top-0 w-full h-20 px-7 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-white dark:bg-[rgba(0,0,0,0.1)] max-md:h-12 max-md:py-2 max-md:pl-[10px] max-md:pr-[10px] max-md:border-header-bottom-border max-md:dark:border-1 max-md:bg-white max-md:dark:bg-chat-box"
    >
      <div className=''></div>
      <div className="h-full flex gap-8 items-center max-md:ml-4">
        <LangSwitcher />
        <ThemeSwitcher />
        {/* 登录 */}
        {!userInfo?.uid ? (
          <AlertDialog
            open={loginModalOpen}
            onOpenChange={setLoginModalOpen}
          >
            <AlertDialogTrigger asChild>
              <Button 
                className="text-[#FFFFFF] animate-[fadeIn_500ms_ease-in-out] bg-[#24A0ED] hover:bg-[#24A0ED]/90 flex items-center justify-center"
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
                className="absolute top-0 right-0 border-0 pt-4 hover:bg-none dark:bg-[#272727] focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
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
              {/* <p className='text-xs'>
                {t('side_bar.credits_label')}
                <span>{userInfo.totalBalance}</span>
                {t('side_bar.credits_unit')}
              </p> */}
            <AvatarDropdown />
            <Button 
              className="w-full py-2.5 rounded-xl text-[#FFFFFF] animate-[fadeIn_500ms_ease-in-out] bg-[#24A0ED] hover:bg-[#24A0ED]/90 flex items-center justify-center"
            >
              <Crown className="text-[#F8da51] mr-2 h-4 w-4" />
              {t('side_bar.upgrade')}
            </Button>
          </>
        )}
      </div>
      
                {/* <div className="w-screen h-screen bg-slogan-text fixed left-0 top-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center flex-col relative">
                    <Image
                      src={
                        'https://img.alicdn.com/imgextra/i3/O1CN01JfeuCh1P9X6EMJjiw_!!6000000001798-0-tps-1125-1125.jpg'
                      }
                      alt={'mobile-wechat'}
                      width={208}
                      height={208}
                    />
                    <div className="mt-4 text-base text-default-search-content-color">
                      {t('xanswer.weChat_group')}
                    </div>
                    <CircleX
                      size={28}
                      color={'#fff'}
                      className="absolute left-[106px] bottom-[-44px]"
                      onClick={() => setOpenMobileWeChat(false)}
                    />
                  </div>
                </div> */}
    </header>
  )
}

export default Header