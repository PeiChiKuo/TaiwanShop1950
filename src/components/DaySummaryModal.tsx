import React from 'react';
import { GameStats, DayConfig } from '../types/game';
import { Award, ArrowRight, Star, ShieldCheck, Newspaper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DaySummaryModalProps {
  isOpen: boolean;
  stats: GameStats;
  dayConfig: DayConfig;
  onNextDay: () => void;
  isFinalDay: boolean;
  onRestartGame: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  isOpen,
  stats,
  dayConfig,
  onNextDay,
  isFinalDay,
  onRestartGame,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#f5ebd7] border-4 border-[#3c2a1a] rounded shadow-2xl p-6 text-[#291b10] flex flex-col gap-4 font-serif">
        {/* Vintage Newspaper / Case File Header */}
        <div className="border-b-2 border-double border-[#3c2a1a] pb-3 text-center">
          <div className="flex items-center justify-between text-xs text-[#78593a] border-b border-[#3c2a1a] pb-1 mb-2 font-mono">
            <span>台灣省保安司令部 · 機密卷宗備忘錄</span>
            <span>中華民國四十年初秋 · 台北城南特刊</span>
          </div>

          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest text-[#1c1209]">
              【 柑仔店暗夜順利歇業 】
            </h1>
            {/* Red Approval Stamp */}
            <div className="absolute -right-10 -top-2 transform rotate-12 border-2 border-[#b91c1c] text-[#b91c1c] text-xs font-bold px-2 py-0.5 rounded shadow-sm">
              特務未察·合格
            </div>
          </div>
          <p className="text-xs text-[#6e4e2f] mt-1">
            {dayConfig.yearTitle} · {dayConfig.subTitle}
          </p>
        </div>

        {/* Satisfaction Rating Stars */}
        <div className="flex items-center justify-center gap-1 py-1 bg-[#ecd9bc] rounded border border-[#c7af8d]">
          <span className="text-xs font-bold text-[#4a321d] mr-2">今日店譽評等：</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= stats.satisfactionStars
                  ? 'text-[#d97706] fill-[#d97706]'
                  : 'text-[#a89073]'
              }`}
            />
          ))}
        </div>

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">一般顧客滿意服務</div>
            <div className="text-base font-bold text-[#1e293b] font-mono mt-0.5">
              {stats.regularServed} 人
            </div>
            <div className="text-[10px] text-[#16a34a]">+{stats.regularServed * 100} 分</div>
          </div>

          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">違禁文存隱密交付</div>
            <div className="text-base font-bold text-[#b91c1c] font-mono mt-0.5">
              {stats.contrabandDelivered} 冊
            </div>
            <div className="text-[10px] text-[#16a34a]">+{stats.contrabandDelivered * 200} 分</div>
          </div>

          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">敏感人士秘密避難</div>
            <div className="text-base font-bold text-[#0284c7] font-mono mt-0.5">
              {stats.dissidentsSheltered} 人次
            </div>
            <div className="text-[10px] text-[#16a34a]">+{stats.dissidentsSheltered * 300} 分</div>
          </div>

          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">瞞過憲警突擊檢查</div>
            <div className="text-base font-bold text-[#d97706] font-mono mt-0.5">
              {stats.inspectionsEvaded} 回
            </div>
            <div className="text-[10px] text-[#16a34a]">+{stats.inspectionsEvaded * 200} 分</div>
          </div>

          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">今日累計營業額</div>
            <div className="text-base font-bold text-[#b45309] font-mono mt-0.5">
              NT$ {stats.moneyEarned}
            </div>
            <div className="text-[10px] text-[#854d0e]">梅花舊台幣硬幣</div>
          </div>

          <div className="p-2.5 bg-[#fbf6ec] border border-[#d6be9f] rounded">
            <div className="text-[11px] text-[#735334]">總計得分</div>
            <div className="text-lg font-bold text-[#166534] font-mono mt-0.5">
              {stats.score.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#15803d]">最高連擊 x{stats.maxCombo}</div>
          </div>
        </div>

        {/* Historical Context Narrative */}
        <div className="p-3 bg-[#e8d7bd] border-l-4 border-[#78593a] rounded-r text-xs leading-relaxed text-[#3a2818]">
          <div className="font-bold mb-1 flex items-center gap-1 text-[#22170e]">
            <Newspaper className="w-3.5 h-3.5 text-[#78593a]" />
            歷史文獻摘要：
          </div>
          {dayConfig.historicalContext}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#cbb393]">
          <button
            onClick={onRestartGame}
            className="px-4 py-2 bg-[#d4c1a5] hover:bg-[#c2ab8b] text-[#291b10] rounded text-xs font-bold transition-colors"
          >
            返回主選單
          </button>

          {isFinalDay ? (
            <button
              onClick={onRestartGame}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>全破通關！再玩一次</span>
            </button>
          ) : (
            <button
              onClick={onNextDay}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#854d0e] hover:bg-[#713f12] text-[#fef9c3] rounded font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>打烊結算 · 迎接下一日</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
