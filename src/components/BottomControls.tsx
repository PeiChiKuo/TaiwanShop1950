import React from 'react';
import { Hand, Compass, Eye, RefreshCw, Coins, BookOpen } from 'lucide-react';
import { ShelfState } from '../types/game';
import { sound } from '../utils/audio';

interface BottomControlsProps {
  shelfState: ShelfState;
  onToggleWindowShelf: () => void;
  onToggleCenterShelf: () => void;
  onToggleSecretPassage: () => void;
  onToggleCamouflage: () => void;
  onOpenPolicePeep: () => void;
  onOpenCashRegister: () => void;
  onOpenHistoryDossier: () => void;
  isPoliceNearby: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  shelfState,
  onToggleWindowShelf,
  onToggleCenterShelf,
  onToggleSecretPassage,
  onToggleCamouflage,
  onOpenPolicePeep,
  onOpenCashRegister,
  onOpenHistoryDossier,
  isPoliceNearby,
}) => {
  return (
    <footer className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#171412]/95 border-t border-[#44382c] shadow-2xl">
      {/* Primary Action Buttons (matching user mockup) */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {/* Button 1: 搬運貨架 (Move Window Shelf to block view or clear aisle) */}
        <button
          onClick={() => {
            sound.playShelfSlide();
            onToggleWindowShelf();
          }}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md font-serif text-xs md:text-sm font-bold border transition-all shadow-md active:scale-95 ${
            shelfState.windowShelfPos === 'BLOCK_WINDOW'
              ? 'bg-[#854d0e] border-[#facc15] text-[#fef9c3] shadow-[0_0_12px_rgba(250,204,21,0.3)]'
              : 'bg-[#352b22] border-[#5a4837] text-[#e0d3c1] hover:bg-[#43372c]'
          }`}
          title="滑動臨窗大貨架：封堵店門視線，阻擋門外憲兵手電筒！"
        >
          <Hand className="w-4 h-4 text-[#facc15]" />
          <span>
            {shelfState.windowShelfPos === 'BLOCK_WINDOW'
              ? '貨架：已遮蔽門窗'
              : '搬運貨架 (封鎖視線)'}
          </span>
        </button>

        {/* Central Shelf slide */}
        <button
          onClick={() => {
            sound.playShelfSlide();
            onToggleCenterShelf();
          }}
          className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-md font-serif text-xs md:text-sm font-bold border transition-all shadow-md active:scale-95 ${
            shelfState.centerShelfPos === 'RIGHT'
              ? 'bg-[#78350f] border-[#f59e0b] text-[#fef3c7]'
              : 'bg-[#2b241d] border-[#4b3c2e] text-[#c9bca9] hover:bg-[#382f25]'
          }`}
          title="滑動中央雙面貨架，為躲避者製造走道障礙與藏身死角"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>{shelfState.centerShelfPos === 'RIGHT' ? '走道：掩護右側' : '走道：掩護左側'}</span>
        </button>

        {/* Button 2: 密道開啟 (Lever mechanism for secret basement) */}
        <button
          onClick={() => {
            sound.playLeverPull();
            onToggleSecretPassage();
          }}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md font-serif text-xs md:text-sm font-bold border transition-all shadow-md active:scale-95 ${
            shelfState.secretPassagePos === 'OPEN'
              ? 'bg-[#7f1d1d] border-[#f87171] text-[#fee2e2] shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
              : 'bg-[#29221b] border-[#524132] text-[#d6cab8] hover:bg-[#382f25]'
          }`}
          title="拉動收銀機關桿！開啟旋轉書櫃後的地下秘密避難通道"
        >
          <Compass className="w-4 h-4 text-[#f87171]" />
          <span>
            {shelfState.secretPassagePos === 'OPEN'
              ? '密道：已敞開 (接應中)'
              : '密道開啟 (暗門機關)'}
          </span>
        </button>

        {/* Button 3: 觀察警察 (Dark alley peephole view) */}
        <button
          onClick={() => {
            onOpenPolicePeep();
          }}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-md font-serif text-xs md:text-sm font-bold border transition-all shadow-md active:scale-95 ${
            isPoliceNearby
              ? 'bg-[#451a03] border-[#f97316] text-[#ffedd5] animate-bounce'
              : 'bg-[#24292f] border-[#444d56] text-[#e1e4e8] hover:bg-[#2f363d]'
          }`}
          title="貼近窗櫺，窺視暗巷外巡邏憲兵的巡邏距離與手電筒死角"
        >
          <Eye className={`w-4 h-4 ${isPoliceNearby ? 'text-[#f97316]' : 'text-[#60a5fa]'}`} />
          <span>觀察警察 (窗外暗巷)</span>
        </button>
      </div>

      {/* Auxiliary Operations: Camouflage & Cash Register */}
      <div className="flex items-center gap-2">
        {/* Camouflage Toggle */}
        <button
          onClick={() => {
            sound.playLeverPull();
            onToggleCamouflage();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-serif font-bold transition-all shadow active:scale-95 ${
            shelfState.windowShelfCamouflage === 'NORMAL_GOODS'
              ? 'bg-[#1e3a1e] border-[#4ade80] text-[#dcfce7]'
              : 'bg-[#3b1212] border-[#f87171] text-[#fecaca]'
          }`}
          title="翻轉貨架暗層：將禁書偽裝成明星花露水與罐頭，或翻出禁書交付顧客"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#4ade80]" />
          <span>
            {shelfState.windowShelfCamouflage === 'NORMAL_GOODS'
              ? '已偽裝：一般罐頭'
              : '暗格：禁書露餡中！'}
          </span>
        </button>

        {/* Cash Register Ring up */}
        <button
          onClick={() => {
            onOpenCashRegister();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#312314] hover:bg-[#43311b] border border-[#a16207] text-[#fef08a] rounded text-xs font-serif font-bold transition-all shadow active:scale-95"
          title="開啟復古機械收銀機，點收新台幣硬幣與找零"
        >
          <Coins className="w-3.5 h-3.5 text-[#eab308]" />
          <span>收銀櫃檯</span>
        </button>

        {/* Historical Archive */}
        <button
          onClick={onOpenHistoryDossier}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 bg-[#221c17] hover:bg-[#322921] border border-[#483a2b] text-[#c9bba7] rounded text-xs transition-colors"
          title="閱讀1950年代柑仔店生活與白色恐怖歷史文獻檔案"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#a89985]" />
          <span>歷史密卷</span>
        </button>
      </div>
    </footer>
  );
};
