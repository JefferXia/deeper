'use client';
import React, { useEffect, useState } from 'react';
import { Crown, CalendarDays, Info } from 'lucide-react';
import { useGlobalContext } from '@/app/globalcontext'
import { useTranslations } from 'use-intl'
import { getFirstLetterAndUpperCase } from '@/lib/utils'
import { Button } from './ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function AccountInfo() {
  const { userInfo } = useGlobalContext()
  const t = useTranslations()

  useEffect(() => {}, []);

  return (
    <div className="p-5 rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <div className="flex">
          <span className="flex items-center justify-center text-xl font-medium rounded-full w-12 h-12 mr-4 text-white bg-[linear-gradient(225deg,_rgb(255,_58,_212)_0%,_rgb(151,_107,_255)_33%,_rgb(67,_102,_255)_66%,_rgb(89,_187,_252)_100%)]">
            {getFirstLetterAndUpperCase(userInfo?.email)}
          </span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{userInfo?.email}</h4>
            <p className="text-sm text-muted-foreground">
              {t('profile.no_vip')}
            </p>
            <div className="flex items-center pt-1">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {userInfo?.createdAt}
              </span>
            </div>
          </div>
        </div>
        <Button 
          className="text-[#79402e] bg-[#F8da51] hover:bg-[#ffefd1] flex items-center justify-center"
        >
          <Crown className="mr-2 h-4 w-4" />
          {t('profile.upgrade')}
        </Button>
      </div>
      <div className='flex items-center mt-5 pt-5 border-t border-tbborder text-sm'>
        <span className='text-muted-foreground'>{t('profile.credits_label')}</span>
        <span className='text-4xl font-semibold mr-1'>{userInfo?.totalBalance}</span>
        <span className='text-muted-foreground mr-2'>{t('profile.credits_unit')}</span>       
        <HoverCard>
          <HoverCardTrigger asChild>             
            <Info size={18} />
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-[150px]">
            <div className="text-sm space-y-2">
              <p>{t('profile.gift_credits')}{userInfo?.giftTokens}</p>
              <p>{t('profile.recharge_credits')}{userInfo?.rechargeTokens}</p>
              <p>{t('profile.earn_credits')}{userInfo?.earnedTokens}</p>
            </div>
          </HoverCardContent>
        </HoverCard> 
      </div>
    </div>
  );
}
