import { cn } from '@/lib/utils';
import { useSelectedLayoutSegments } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  return (
    <main className='lg:pl-20 bg-light-primary dark:bg-dark-primary min-h-screen'>
      <div className={cn(
        'lg:mx-auto mx-4',
        segments.includes('hot')
        ? 'max-w-screen-xl'
        : 'max-w-screen-lg',
      )}>{children}</div>
    </main>
  );
};

export default Layout;
