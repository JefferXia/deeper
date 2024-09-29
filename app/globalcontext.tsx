'use client'
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
  useRef
} from 'react'
import { usePathname } from 'next/navigation'
import { IntlProvider } from 'use-intl'
import { en } from '@/lib/local/en-US'
import { zh } from '@/lib/local/zh-CN'
import useLanguage from '@/lib/hooks/useLanguage'
interface UserInfo {
  uid: string
  name?: string
  email?: string
  picture?: string
}
const GlobalContext = createContext<any>({})
export const useGlobalContext = () => useContext<any>(GlobalContext)

export const GlobalContextProvider = function ({
  children,
  userInfo
}: {
  children: ReactNode
  userInfo?: UserInfo
}) {
  const path = usePathname()
  const [language, setLanguage] = useLanguage('zh')
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const localeMessages = useMemo(() => {
    return language === 'en' ? en : zh
  }, [language])

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
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
    </GlobalContext.Provider>
  )
}