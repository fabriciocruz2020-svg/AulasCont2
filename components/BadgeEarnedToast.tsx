
import React, { useEffect, useState } from 'react';
import { Badge } from '../types';

interface BadgeEarnedToastProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeEarnedToast: React.FC<BadgeEarnedToastProps> = ({ badge, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Allow fade-out animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [badge, onClose]);

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
      <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 min-w-[320px]">
        <div className="text-4xl animate-bounce">{badge.icon}</div>
        <div>
          <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest">Nova Conquista!</h4>
          <h3 className="text-lg font-bold">{badge.name}</h3>
          <p className="text-xs text-slate-400">{badge.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeEarnedToast;
