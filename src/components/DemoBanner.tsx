import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DemoBanner: React.FC = () => {
  const { t } = useApp();

  return (
    <aside aria-label="Demonstration Notice" className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 text-xs text-amber-900 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 mx-auto text-center font-medium">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-bold tracking-wide text-amber-800">{t('demoBadge')}</span>
        <span className="hidden sm:inline text-amber-900/80">— {t('demoNotice')}</span>
      </div>
    </aside>
  );
};
