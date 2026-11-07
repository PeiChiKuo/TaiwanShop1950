import React from 'react';
import { X, Coins, CheckCircle, ArrowDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface CashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedToday: number;
  onCollectCoin: (amount: number) => void;
  shelfSecretPos: 'CONCEALED' | 'OPEN';
  onToggleSecretLever: () => void;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({
  isOpen,
  onClose,
  earnedToday,
  onCollectCoin,
  shelfSecretPos,
  onToggleSecretLever,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#211a14] border-2 border-[#6d5138] rounded-lg shadow-2xl p-5 text-[#f5ebd7] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#4d3826] pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="font-serif text-lg font-bold text-[#fef3c7]">
              收銀櫃檯與機關操縱系統
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#a89985] hover:text-[#fff] hover:bg-[#382b20] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cash Register Display & Secret Levers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mechanical Register */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#18130f] border border-[#443223] rounded">
            <span className="text-xs text-[#a39480] mb-1 font-serif">收銀機即時結算</span>
            <div className="w-full py-2 bg-[#0d0a08] border border-[#2d2217] rounded text-center">
              <span className="font-mono text-2xl font-bold text-[#22c55e] tracking-widest tabular-nums">
                NT$ {earnedToday}.00
              </span>
            </div>
            <span className="text-[11px] text-[#8c7c68] mt-2">
              1950年代新台幣銀元與紙鈔
            </span>

            {/* Reference preview to uploaded sheet 2 */}
            <div className="mt-3 w-full p-2 bg-[#261c14] border border-[#3e2b1d] rounded flex items-center gap-2 text-xs text-[#cfc1ad]">
              <div className="w-2 h-2 rounded-full bg-[#eab308]" />
              <span>點擊抽屜硬幣即可響鈴清點找零</span>
            </div>
          </div>

          {/* Secret Dual Levers */}
          <div className="flex flex-col justify-between p-4 bg-[#1a140f] border border-[#443223] rounded">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b2a1c]">
              <span className="font-serif text-sm font-bold text-[#fef08a]">
                櫃檯隱藏機關連動桿
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#451212] text-[#fca5a5] rounded border border-[#7f1d1d]">
                密道聯動
              </span>
            </div>

            <p className="text-xs text-[#b8a792] leading-relaxed my-2">
              收銀機底部隱藏雙重齒輪連桿，往下拉動可釋放後方旋轉書櫃重錘，使秘密地下避難室暗門開啟。
            </p>

            <button
              onClick={() => {
                sound.playLeverPull();
                onToggleSecretLever();
              }}
              className={`w-full py-2.5 px-3 rounded font-serif font-bold text-xs flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-md ${
                shelfSecretPos === 'OPEN'
                  ? 'bg-[#7f1d1d] border-[#ef4444] text-[#fee2e2] shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                  : 'bg-[#3d2a1a] border-[#6b4728] text-[#fde047] hover:bg-[#4d3623]'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
              <span>
                {shelfSecretPos === 'OPEN'
                  ? '【機關桿：已扳下】地下暗室暢通'
                  : '【扳動機關桿】開啟旋轉書櫃密道'}
              </span>
            </button>
          </div>
        </div>

        {/* 1950s Coin Box Tray (Designed from Image 2: 1元, 5元, 10元, 50元 with plum blossom) */}
        <div className="flex flex-col gap-2 p-3 bg-[#17120e] border border-[#423122] rounded">
          <div className="flex items-center justify-between text-xs text-[#a89883] font-serif">
            <span>收銀木屜硬幣槽 (點擊硬幣進帳找零)</span>
            <span>梅花雙面鑄造舊台幣</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {[
              { amount: 1, label: '1元 鋁幣', color: 'bg-[#94a3b8] text-[#0f172a]' },
              { amount: 5, label: '5元 黃銅', color: 'bg-[#ca8a04] text-[#422006]' },
              { amount: 10, label: '10元 白銅', color: 'bg-[#cbd5e1] text-[#0f172a]' },
              { amount: 50, label: '50元 紀念幣', color: 'bg-[#b45309] text-[#fff]' },
            ].map((coin) => (
              <button
                key={coin.amount}
                onClick={() => {
                  sound.playCoinCheckout();
                  onCollectCoin(coin.amount);
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#241a12] hover:bg-[#34261b] border border-[#533c29] rounded transition-all active:scale-90 group"
              >
                <div
                  className={`w-11 h-11 rounded-full ${coin.color} font-serif font-bold text-xs flex flex-col items-center justify-center shadow-md border-2 border-black/20 group-hover:scale-105 transition-transform`}
                >
                  <span>{coin.amount}</span>
                  <span className="text-[8px] scale-75">圓</span>
                </div>
                <span className="text-[10px] text-[#cfc1ad]">{coin.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-[#3e2c1e]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3d2c1c] hover:bg-[#4d3824] border border-[#6d5138] text-[#fef3c7] rounded text-xs font-serif transition-colors"
          >
            關閉櫃檯抽屜
          </button>
        </div>
      </div>
    </div>
  );
};
