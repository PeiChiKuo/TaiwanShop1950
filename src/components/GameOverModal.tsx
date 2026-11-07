import React from 'react';
import { GameStats } from '../types/game';
import { AlertOctagon, RotateCcw, ShieldX } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  failureReason: string;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  failureReason,
  onRestart,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      sound.playPoliceWhistle();
      setTimeout(() => sound.playStamp(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#1f1614] border-4 border-[#7f1d1d] rounded shadow-2xl p-6 text-[#fee2e2] flex flex-col gap-4 font-serif">
        {/* Giant Red "查封" Seal */}
        <div className="absolute right-6 top-6 transform rotate-[-15deg] border-4 border-[#ef4444] bg-[#450a0a]/90 text-[#ef4444] font-black text-2xl px-4 py-1.5 rounded shadow-lg select-none">
          查封·收押
        </div>

        {/* Header */}
        <div className="border-b border-[#7f1d1d] pb-3">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <ShieldX className="w-6 h-6 animate-pulse" />
            <span className="text-xs tracking-widest font-mono">
              保安司令部 · 突擊查抄通報
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#fecaca] tracking-wide">
            雜貨店遭到查封！店員遭押走調查
          </h1>
          <p className="text-xs text-[#fca5a5] mt-1 font-mono">
            警戒值已達 100% · 戒嚴軍法審訊
          </p>
        </div>

        {/* Reason card */}
        <div className="p-3 bg-[#361313] border border-[#991b1b] rounded text-xs text-[#fed7d7] leading-relaxed">
          <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            搜查查獲紀錄：
          </div>
          {failureReason ||
            '巡邏憲兵自臨窗玻璃瞥見敏感出版物與地下傳單，動態貨架未能及時封阻視線，特務當場踢門破獲秘密據點。'}
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#2b1614] border border-[#5c1d1d] rounded">
            <div className="text-[11px] text-[#fca5a5]">累計服務民眾</div>
            <div className="text-base font-bold text-white font-mono">
              {stats.regularServed} 人
            </div>
          </div>
          <div className="p-2.5 bg-[#2b1614] border border-[#5c1d1d] rounded">
            <div className="text-[11px] text-[#fca5a5]">秘密避難護送</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {stats.dissidentsSheltered} 人次
            </div>
          </div>
          <div className="p-2.5 bg-[#2b1614] border border-[#5c1d1d] rounded">
            <div className="text-[11px] text-[#fca5a5]">營業結算金</div>
            <div className="text-base font-bold text-amber-300 font-mono">
              NT$ {stats.moneyEarned}
            </div>
          </div>
          <div className="p-2.5 bg-[#2b1614] border border-[#5c1d1d] rounded">
            <div className="text-[11px] text-[#fca5a5]">最終獲得積分</div>
            <div className="text-base font-bold text-white font-mono">
              {stats.score.toLocaleString()} 分
            </div>
          </div>
        </div>

        {/* Footer & Restart Button */}
        <div className="flex items-center justify-end pt-2 border-t border-[#7f1d1d]">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#991b1b] hover:bg-[#b91c1c] text-white rounded font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新開張營運 (再試一次)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
