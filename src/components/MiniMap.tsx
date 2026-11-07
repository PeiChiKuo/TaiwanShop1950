import React from 'react';
import { Eye, Shield, Users } from 'lucide-react';
import { ShelfState, Customer, PolicePatrol } from '../types/game';

interface MiniMapProps {
  shelfState: ShelfState;
  customers: Customer[];
  police: PolicePatrol;
  isPoliceAlarm: boolean;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  shelfState,
  customers,
  police,
  isPoliceAlarm,
}) => {
  return (
    <div className="relative w-44 h-32 md:w-52 md:h-36 bg-[#161311] border-2 border-[#4a3d2e] rounded-md shadow-2xl p-2 flex flex-col justify-between overflow-hidden">
      {/* Header label */}
      <div className="flex items-center justify-between text-[10px] text-[#a1927e] font-mono border-b border-[#34291e] pb-1">
        <span className="flex items-center gap-1 font-bold text-[#cfc2ae]">
          <Shield className="w-3 h-3 text-[#d97706]" /> 店內俯視戰術圖
        </span>
        <span
          className={`text-[9px] px-1 rounded ${
            isPoliceAlarm ? 'bg-[#5c1313] text-[#fca5a5] animate-pulse' : 'text-[#877866]'
          }`}
        >
          {police.state === 'PEEKING' ? '視線掃描' : police.state === 'RAID_INSPECTING' ? '突擊搜查' : '巡邏監視'}
        </span>
      </div>

      {/* Floorplan Layout */}
      <div className="relative flex-1 my-1 bg-[#231c15] border border-[#3e3124] rounded-sm overflow-hidden">
        {/* Exterior dark alley with police */}
        <div className="absolute top-0 left-0 w-3 h-full bg-[#120f0d] border-r border-[#421d1d] flex flex-col items-center justify-center">
          {/* Police marker on outer alley */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 flex items-center justify-center ${
              police.state === 'PEEKING'
                ? 'bg-[#ef4444] shadow-[0_0_8px_#ef4444] animate-ping'
                : 'bg-[#3b82f6]'
            }`}
            style={{
              transform: `translateY(${((police.distance / 100) * 40 - 20).toFixed(0)}px)`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>

          {/* Flashlight cone when peeking or inspecting */}
          {(police.state === 'PEEKING' || police.state === 'RAID_INSPECTING') && (
            <div
              className={`absolute left-2.5 w-14 h-12 pointer-events-none transition-opacity ${
                shelfState.windowShelfPos === 'BLOCK_WINDOW' ? 'opacity-30' : 'opacity-90'
              }`}
              style={{
                background:
                  shelfState.windowShelfPos === 'BLOCK_WINDOW'
                    ? 'radial-gradient(circle at 0% 50%, rgba(239, 68, 68, 0.4) 0%, transparent 60%)'
                    : 'radial-gradient(circle at 0% 50%, rgba(239, 68, 68, 0.8) 0%, transparent 80%)',
                clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
              }}
            />
          )}
        </div>

        {/* Front Door */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3 w-1 h-6 bg-[#10b981]" title="大門入口" />

        {/* Shelf 1: Window Shelf (blocks doorway/window) */}
        <div
          className={`absolute transition-all duration-300 border border-[#78593a] text-[8px] flex items-center justify-center font-bold shadow-sm ${
            shelfState.windowShelfPos === 'BLOCK_WINDOW'
              ? 'left-4.5 top-2 w-3.5 h-16 bg-[#a16207] text-[#fef3c7]'
              : 'left-10 top-2 w-3.5 h-16 bg-[#78350f] text-[#fed7aa]'
          }`}
          title="臨窗大貨架 (可移動遮擋視線)"
        >
          <span className="rotate-90 scale-75 text-[7px]">貨架1</span>
        </div>

        {/* Shelf 2: Center Aisle Shelf */}
        <div
          className={`absolute top-6 transition-all duration-300 border border-[#78593a] text-[8px] flex items-center justify-center font-bold ${
            shelfState.centerShelfPos === 'LEFT'
              ? 'left-16 w-4 h-14 bg-[#78350f] text-[#fed7aa]'
              : 'left-24 w-4 h-14 bg-[#78350f] text-[#fed7aa]'
          }`}
          title="中央雙面貨架"
        >
          <span className="rotate-90 scale-75 text-[7px]">貨架2</span>
        </div>

        {/* Shelf 3 / Secret Passage (Rear wall) */}
        <div
          className={`absolute top-2 right-2 w-7 h-10 border transition-all duration-300 flex flex-col items-center justify-center ${
            shelfState.secretPassagePos === 'OPEN'
              ? 'bg-[#450a0a] border-[#ef4444] shadow-[0_0_6px_#ef4444]'
              : 'bg-[#523e2b] border-[#856645]'
          }`}
          title="旋轉書櫃與地下密道"
        >
          {shelfState.secretPassagePos === 'OPEN' ? (
            <span className="text-[7px] text-[#fca5a5] font-bold">密道開</span>
          ) : (
            <span className="text-[7px] text-[#c9b79c]">暗門</span>
          )}
        </div>

        {/* Cash Register / Counter */}
        <div className="absolute bottom-2 left-6 w-8 h-4 bg-[#422006] border border-[#a16207] rounded-xs flex items-center justify-center text-[7px] text-[#fef08a]">
          櫃檯
        </div>

        {/* Clerk marker */}
        <div className="absolute bottom-7 left-8 w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-white shadow flex items-center justify-center" title="店員掌櫃">
          <div className="w-1 h-1 rounded-full bg-[#78350f]" />
        </div>

        {/* Customers inside store */}
        {customers.map((c, i) => (
          <div
            key={c.id}
            className={`absolute w-2.5 h-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
              c.request.isShelter || c.request.itemId?.includes('banned') || c.request.itemId?.includes('leaflet')
                ? 'bg-[#ef4444] border-white shadow-[0_0_4px_#ef4444]'
                : 'bg-[#3b82f6] border-[#bfdbfe]'
            }`}
            style={{
              left: `${c.standingGrid.x * 2.2 + 35}px`,
              top: `${c.standingGrid.y * 1.8 + 22}px`,
            }}
            title={`${c.name} (${c.request.isShelter ? '待避難' : '購物'})`}
          >
            <span className="text-[6px] text-white font-bold leading-none">
              {c.request.isShelter ? '!' : i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-between text-[8px] text-[#8c7e6b] font-mono pt-0.5">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />掌櫃
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />民眾
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />敏感
        </span>
        <span className="flex items-center gap-0.5 text-[#ef4444]">
          <Eye className="w-2.5 h-2.5" /> 憲警視線
        </span>
      </div>
    </div>
  );
};
