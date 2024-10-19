import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import cache from '@/lib/cache';
import { getUser } from '@/lib/user';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import { GlobalContextProvider } from './globalcontext';
import { GoogleAnalytics } from '@next/third-parties/google'

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'TopMind for video',
  description:
    'TopMind is an AI powered chatbot that can help you create popular videos.',
};
// cache.set(`user:token:test`, JSON.stringify({uid:'test',name:'test',email:'test@126.com',picture:''}))
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUser();

  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className={cn('h-full', montserrat.className)}>
        <GoogleAnalytics gaId="G-DDJKD745FB" />
        <ThemeProvider>
          <GlobalContextProvider userInfo={userInfo}>
            <Header />
            <Sidebar>{children}</Sidebar>
            <Toaster
              position="bottom-center"
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast:
                    'bg-light-primary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg ml-[100px] p-4 flex flex-row items-center',
                },
              }}
            />
          </GlobalContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
