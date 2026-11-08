import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bot, MapPin, Waves, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { t } = useApp();
  const location = useLocation();

  const tabs = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/assistant', label: t('navAssistant'), icon: Bot, isAi: true },
    { to: '/facilities', label: t('navFacilities'), icon: MapPin },
    { to: '/ghats', label: t('navGhats'), icon: Waves },
    { to: '/emergency', label: '112 Help', icon: ShieldAlert, isEmergency: true }
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a2540]/95 backdrop-blur-md border-t border-teal-500/20 shadow-lg px-2 py-1 safe-area-bottom"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.to;

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-xl transition-all duration-150 ${
                active
                  ? tab.isEmergency
                    ? 'text-red-400 font-bold'
                    : 'text-teal-300 font-bold'
                  : tab.isEmergency
                  ? 'text-red-400/80 hover:text-red-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  active
                    ? tab.isEmergency
                      ? 'bg-red-500/20 scale-110'
                      : 'bg-teal-500/20 scale-110'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${tab.isEmergency && !active ? 'text-red-400' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-[68px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
