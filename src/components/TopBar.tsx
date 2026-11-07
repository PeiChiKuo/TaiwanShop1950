import React from 'react';
import { Eye, Clock, Star, ShieldAlert } from 'lucide-react';

interface TopBarProps {
  score: number;
  combo: number;
  suspicion: number;
  timeRemaining: number;
  satisfactionStars: number;
  currentDayTitle: string;
  policeStatusText: string;
  isPoliceAlarm: boolean;
  activeTasks: Array<{
    id: string;
    customerName: string;
    description: string;
    isContraband: boolean;
    isShelter: boolean;
    completed: boolean;
  }>;
}

export const TopBar: React.FC<TopBarProps> = ({
  score,
  combo,
  suspicion,
  timeRemaining,
  satisfactionStars,
  currentDayTitle,
  policeStatusText,
  isPoliceAlarm,
  activeTasks,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="relative z-20 flex flex-wrap items-start justify-between gap-3 px-4 py-2.5 bg-[#181614]/90 backdrop-blur-md border-b border-[#3e3428] shadow-lg text-[#e6ded1]">
      {/* Brand & Theme Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2 px-3 py-1 bg-[#26211a] border border-[#524434] rounded">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-widest text-[#f5ebd7]">
                暗巷雜貨店
              </span>
              <span className="inline-block px-1.5 py-0.2 text-xs font-bold text-[#b91c1c] border border-[#b91c1c] bg-[#3a1313] rounded font-serif shadow-sm rotate-2">
                禁
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[#a89a85] font-sans">
              Dark Alley Grocery Store · {currentDayTitle}
            </span>
          </div>
        </div>

        {/* Score & Combo */}
        <div className="hidden sm:flex flex-col px-3 py-1 bg-[#201c17] border border-[#44382c] rounded">
          <div className="text-[10px] text-[#9c8e7c] tracking-wider">營業額 / 得分</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-[#f0cf75] tabular-nums">
              {score.toLocaleString()} 分
            </span>
            {combo > 1 && (
              <span className="text-[11px] font-bold text-[#34d399] animate-pulse">
                x{(1 + (combo - 1) * 0.1).toFixed(1)} 連擊
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Alert Gauge & Timer */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Suspicion / Alert Gauge */}
        <div
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
            isPoliceAlarm
              ? 'bg-[#3c1313] border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
              : 'bg-[#211c16] border-[#4a3d2e]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Eye
              className={`w-4 h-4 ${
                suspicion > 60
                  ? 'text-[#ef4444] animate-bounce'
                  : suspicion > 30
                  ? 'text-[#f59e0b]'
                  : 'text-[#9ca3af]'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#a69986] font-medium leading-none">
                警戒等級
              </span>
              <span
                className={`font-mono text-xs font-bold tabular-nums leading-tight ${
                  suspicion > 60
                    ? 'text-[#ef4444]'
                    : suspicion > 30
                    ? 'text-[#f59e0b]'
                    : 'text-[#d1c7b7]'
                }`}
              >
                {Math.round(suspicion)}%
              </span>
            </div>
          </div>

          {/* Vertical progress bar */}
          <div className="w-2.5 h-7 bg-[#110e0c] border border-[#3e3224] rounded-sm overflow-hidden flex flex-col justify-end">
            <div
              className={`w-full transition-all duration-300 ${
                suspicion > 60
                  ? 'bg-gradient-to-t from-[#b91c1c] to-[#ef4444]'
                  : suspicion > 30
                  ? 'bg-gradient-to-t from-[#d97706] to-[#f59e0b]'
                  : 'bg-gradient-to-t from-[#059669] to-[#10b981]'
              }`}
              style={{ height: `${Math.min(100, Math.max(0, suspicion))}%` }}
            />
          </div>

          {/* Status text badge */}
          <div className="hidden lg:flex flex-col pl-1 border-l border-[#3a3024]">
            <span className="text-[11px] font-semibold text-[#d4c6b2]">
              {policeStatusText}
            </span>
          </div>
        </div>

        {/* Level Remaining Time */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#211c16] border border-[#4a3d2e] rounded">
          <Clock className="w-4 h-4 text-[#d97706]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#a69986] leading-none">
              關卡剩餘時間
            </span>
            <span className="font-mono text-sm font-bold text-[#f5ebd7] tabular-nums leading-tight">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Satisfaction & Active Tasks Panel */}
      <div className="flex items-center gap-3">
        {/* Customer Satisfaction */}
        <div className="hidden sm:flex flex-col px-3 py-1 bg-[#201c17] border border-[#44382c] rounded">
          <span className="text-[10px] text-[#a69986]">顧客滿意度</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= satisfactionStars
                    ? 'text-[#f59e0b] fill-[#f59e0b]'
                    : 'text-[#4b3e2f]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Task Mini-List */}
        <div className="flex flex-col min-w-[170px] max-w-[240px] px-2.5 py-1 bg-[#241f19] border border-[#4c3f30] rounded text-xs shadow-inner">
          <div className="flex items-center justify-between pb-0.5 border-b border-[#3c3124] text-[10px] text-[#b3a490]">
            <span className="font-medium">目前任務 (待辦)</span>
            <span className="text-[9px] text-[#91816e]">
              {activeTasks.filter((t) => t.completed).length}/{activeTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-1 pt-1 max-h-12 overflow-hidden">
            {activeTasks.length === 0 ? (
              <span className="text-[11px] text-[#786b59] italic">暫無顧客，等待門鈴中...</span>
            ) : (
              activeTasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-1 text-[11px]"
                >
                  <span className="truncate max-w-[150px] text-[#d6cab8]">
                    • {task.customerName}:{' '}
                    <span
                      className={
                        task.isShelter || task.isContraband
                          ? 'text-[#f87171] font-semibold'
                          : 'text-[#e2d7c5]'
                      }
                    >
                      {task.description}
                    </span>
                  </span>
                  {task.completed ? (
                    <span className="text-[#34d399] font-bold">✓</span>
                  ) : task.isShelter ? (
                    <span className="text-[#ef4444] font-bold text-[9px] px-1 bg-[#451212] rounded">避難</span>
                  ) : (
                    <span className="text-[#d97706] text-[10px]">待取</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
