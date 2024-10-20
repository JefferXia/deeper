'use client'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getFirstLetterAndUpperCase } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { useGlobalContext } from '@/app/globalcontext'
import { useTranslations } from 'use-intl'

interface AvatarDropdownProps {
  setOpenMobileWeChat?: (openMobileWeChat: boolean) => void
  setOpentHistorySheet?: (open: boolean) => void
}

export function AvatarDropdown(props: AvatarDropdownProps) {
  const { setOpenMobileWeChat, setOpentHistorySheet } = props
  const router = useRouter()
  const { userInfo } = useGlobalContext()
  const t = useTranslations()

  const signOut = useCallback(() => {
    fetch('/api/signOut', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      window.location.replace('/')
    })
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-auto mr-0 hover:border-0 hover:bg-transparent active:border-0 active:bg-transparent focus-visible:ring-0 max-md:ml-[8px]"
          >
            <div className="flex items-center justify-center text-base rounded-full w-8 h-8 cursor-pointer text-main-color dark:bg-avatar-dropdown-dark-bg dark:text-white bg-avatar-dropdown-bg max-md:w-6 max-md:h-6">
              {getFirstLetterAndUpperCase(userInfo?.email)}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-md:dark:bg-mobile-dark-header-dropdown"
        >
          <DropdownMenuItem className="focus:bg-transparent py-2">
            <div className="flex items-center">
              <span className="flex items-center justify-center text-base rounded-full w-8 h-8 bg-avatar-dropdown-bg text-main-color mr-4 dark:bg-avatar-dropdown-dark-bg dark:text-white">
                {getFirstLetterAndUpperCase(userInfo?.email)}
              </span>
              <span>{userInfo?.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-0 pl-5 border-t border-avatar-dropdown dark:border-avatar-dropdown-dark-bg max-md:bg-white max-md:border-0 max-md:dark:bg-mobile-dark-header-dropdown"
          >
            <Link href="/profile" className='block w-full py-2'>
              {t('login.profile_txt')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={signOut}
            className="py-2 pl-5 cursor-pointer border-t border-avatar-dropdown dark:border-avatar-dropdown-dark-bg max-md:bg-white max-md:border-0 max-md:dark:bg-mobile-dark-header-dropdown"
          >
            {t('login.signout_txt')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}