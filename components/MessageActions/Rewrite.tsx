import { ArrowLeftRight } from 'lucide-react';
import { useTranslations } from 'use-intl'

const Rewrite = ({
  rewrite,
  messageId,
}: {
  rewrite: (messageId: string) => void;
  messageId: string;
}) => {
  const t = useTranslations();
  return (
    <button
      onClick={() => rewrite(messageId)}
      className="py-2 px-3 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white flex flex-row items-center space-x-1"
    >
      <ArrowLeftRight size={18} />
      <p className="text-xs font-medium">{t('ai.rewrite')}</p>
    </button>
  );
};

export default Rewrite;
