'use client'
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode
} from 'react'
import { usePathname } from 'next/navigation'
import { IntlProvider } from 'use-intl'
import { en } from '@/lib/local/en-US'
import { zh } from '@/lib/local/zh-CN'
import useLanguage from '@/lib/hooks/useLanguage'
import { UserInfo } from '@/lib/user'
import { Next13ProgressBar } from 'next13-progressbar';

const GlobalContext = createContext<any>({})
export const useGlobalContext = () => useContext<any>(GlobalContext)

export const GlobalContextProvider = function ({
  children,
  userData
}: {
  children: ReactNode
  userData?: UserInfo
}) {
  const path = usePathname()
  const [userInfo, setUserInfo] = useState(userData)
  const [language, setLanguage] = useLanguage('zh')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const localeMessages = useMemo(() => {
    return language === 'en' ? en : zh
  }, [language])

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        language,
        setLanguage,
        loginModalOpen,
        setLoginModalOpen
      }}
    >
      <IntlProvider
        messages={localeMessages}
        locale={language}
        timeZone="Europe/London"
      >
        {children}
      </IntlProvider>
      <Next13ProgressBar height="4px" color="#24A0ED" options={{ showSpinner: true }} showOnShallow />
    </GlobalContext.Provider>
  )
}