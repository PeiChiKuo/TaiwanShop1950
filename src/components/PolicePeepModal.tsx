import React from 'react';
import { X, Eye, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { PolicePatrol, ShelfState } from '../types/game';

interface PolicePeepModalProps {
  isOpen: boolean;
  onClose: () => void;
  police: PolicePatrol;
  shelfState: ShelfState;
  suspicion: number;
}

export const PolicePeepModal: React.FC<PolicePeepModalProps> = ({
  isOpen,
  onClose,
  police,
  shelfState,
  suspicion,
}) => {
  if (!isOpen) return null;

  const isBlocked = shelfState.windowShelfPos === 'BLOCK_WINDOW';
  const isPeekingNow = police.state === 'PEEKING' || police.state === 'RAID_INSPECTING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#14181f] border-2 border-[#334155] rounded-lg shadow-2xl p-5 text-[#f1f5f9] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="font-serif text-lg font-bold text-[#f8fafc]">
              臨窗暗巷窺視孔 (警情監視)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94a3b8] hover:text-[#fff] hover:bg-[#1e293b] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Peephole Visual Viewport (Slats / Window Blind Effect) */}
        <div className="relative w-full h-56 bg-[#090d14] border-2 border-[#1e293b] rounded-md overflow-hidden flex flex-col items-center justify-center">
          {/* Wooden Window Blind Slats overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-40 z-20">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-full h-1 bg-[#020617] border-b border-black" />
            ))}
          </div>

          {/* Exterior Street Scene */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Dark alley rainy backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1320] via-[#050b14] to-[#020617]" />

            {/* Distant streetlamp glow */}
            <div className="absolute top-8 left-16 w-32 h-32 rounded-full bg-amber-300/10 blur-xl pointer-events-none" />

            {/* Rain Streaks */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Police Officer Silhouette */}
            <div
              className="relative z-10 flex flex-col items-center transition-all duration-700"
              style={{
                transform: `scale(${1.2 - (police.distance / 100) * 0.5}) translateY(${
                  (police.distance / 100) * 20
                }px)`,
              }}
            >
              {/* Peaked cap */}
              <div className="w-12 h-4 bg-[#0f172a] rounded-t-sm border-b border-amber-500" />
              {/* Head */}
              <div className="w-8 h-8 bg-[#fed7aa] rounded-full relative">
                {/* Eyes glowing / searching */}
                <div className="absolute top-3 left-1.5 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                <div className="absolute top-3 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
              </div>
              {/* Uniform Torso */}
              <div className="w-16 h-20 bg-[#1e293b] border border-[#334155] rounded-t-sm relative">
                {/* Flashlight in hand */}
                <div className="absolute -right-4 top-8 w-8 h-3 bg-slate-400 rotate-12 flex items-center justify-end">
                  <div className="w-3 h-4 bg-yellow-200 rounded-r shadow-[0_0_20px_#fef08a]" />
                </div>
              </div>
              {/* Legs */}
              <div className="flex gap-2">
                <div className="w-5 h-16 bg-[#0f172a]" />
                <div className="w-5 h-16 bg-[#0f172a]" />
              </div>
            </div>

            {/* Flashlight Beam Cone projecting towards viewer */}
            {isPeekingNow && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(254,240,138,0.35)_0%,rgba(239,68,68,0.2)_50%,transparent_80%)] pointer-events-none z-10 animate-pulse" />
            )}
          </div>

          {/* Live Status Overlay on Peep Screen */}
          <div className="absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between px-3 py-1.5 bg-black/80 backdrop-blur rounded text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              距離門口：{Math.round(police.distance)} 公尺
            </span>
            <span
              className={`font-bold ${
                isPeekingNow ? 'text-red-400 animate-pulse' : 'text-slate-300'
              }`}
            >
              {police.state === 'PEEKING'
                ? '⚠️ 正在貼近窗櫺探頭窺視！'
                : police.state === 'RAID_INSPECTING'
                ? '🚨 破門抽查進行中！'
                : '巡邏踱步中'}
            </span>
          </div>
        </div>

        {/* Protection Assessment */}
        <div className="p-3 bg-[#0f172a] border border-[#1e293b] rounded flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-serif">店內當前遮蔽狀況</span>
            {isBlocked ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> 貨架已就位 · 視線完全阻斷
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-rose-400 font-bold animate-pulse">
                <AlertOctagon className="w-4 h-4" /> 門窗敞開 · 易遭警察察覺！
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBlocked
              ? '臨窗大貨架已移至窗前，憲兵從暗巷只能看見普通木板架背板與合法肥皂罐頭，店內避難人士安全。'
              : '大貨架目前停在走道中央，一旦憲兵手電筒照射窗櫺，店內持有違禁品者將立即曝露！請迅速滑動貨架遮擋。'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#334155] hover:bg-[#475569] text-white rounded text-xs font-serif transition-colors"
          >
            返回店內掌櫃視角
          </button>
        </div>
      </div>
    </div>
  );
};
