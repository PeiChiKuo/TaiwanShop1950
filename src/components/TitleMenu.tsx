import React, { useState } from 'react';
import { Play, BookOpen, Volume2, VolumeX, Shield, HelpCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface TitleMenuProps {
  onStartGame: () => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TitleMenu: React.FC<TitleMenuProps> = ({
  onStartGame,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="relative w-full h-full flex-1 flex items-center justify-center p-4 bg-[#14100c] text-[#f5ebd7] font-serif overflow-hidden select-none">
      {/* Background with vintage dark atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(65,45,30,0.4)_0%,rgba(10,8,6,0.95)_100%)] pointer-events-none" />

      {/* Decorative subtle streetlamp glow */}
      <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Title Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#231a13]/90 border-4 border-[#5a422d] rounded-lg shadow-2xl p-7 md:p-9 flex flex-col items-center text-center gap-5 backdrop-blur-sm">
        {/* Top Historical Badge */}
        <div className="flex items-center gap-2 text-xs text-[#a8957f] font-mono tracking-widest border-b border-[#4d3826] pb-2 w-full justify-center">
          <span>台灣省警備總司令部 戒嚴管轄區</span>
          <span>·</span>
          <span>民國四十三年</span>
        </div>

        {/* Title Lockup */}
        <div className="flex flex-col items-center gap-1.5 my-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.2em] text-[#fef3c7] drop-shadow-md">
              暗巷雜貨店
            </h1>
            <span className="px-2 py-0.5 text-base font-black text-[#dc2626] border-2 border-[#dc2626] bg-[#450a0a] rounded shadow-md rotate-3 font-serif">
              禁
            </span>
          </div>
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#d6c7b2] font-sans font-medium uppercase mt-1">
            Dark Alley Grocery Store · 1950s Taiwan
          </span>
        </div>

        {/* Premise Narrative */}
        <p className="text-xs md:text-sm text-[#c9bca9] leading-relaxed max-w-md">
          表面上是一間充滿明星香水皂、黑松汽水與油鹽醬醋的古舊柑仔店；實則暗藏動態滑軌貨架與避難密室。
          在憲警巡邏視線監視下，為街坊日常供貨，更需秘密協助異見人士與禁書脫困！
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full max-w-xs gap-2.5 pt-2">
          {/* Start Game */}
          <button
            onClick={() => {
              sound.playDoorBell();
              sound.startAtmosphericBgm();
              onStartGame();
            }}
            className="flex items-center justify-center gap-2.5 py-3 px-6 bg-[#92400e] hover:bg-[#b45309] text-[#fef3c7] rounded-md font-bold text-base shadow-xl border border-[#fbbf24] transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-[#fef3c7]" />
            <span>開門營業 (開始遊戲)</span>
          </button>

          {/* How to Play */}
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#35271c] hover:bg-[#453426] text-[#e8dfcf] rounded-md font-bold text-xs border border-[#5a422d] transition-all active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-[#facc15]" />
            <span>機關與玩法指南</span>
          </button>

          {/* History Dossier */}
          <button
            onClick={onOpenHistory}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#261d15] hover:bg-[#362a20] text-[#cfc1ad] rounded-md font-bold text-xs border border-[#483524] transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#a3937e]" />
            <span>時代歷史文獻密卷</span>
          </button>
        </div>

        {/* Footer controls: Audio & Version */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-[#3e2c1e] text-[11px] text-[#8c7b68]">
          <span>白色恐怖歷史原創模擬</span>
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-2 py-1 bg-[#1a140f] hover:bg-[#2c2017] rounded border border-[#3e2c1e] text-[#bdae9c] transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#34d399]" />
                <span>音樂音效：開啟</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#ef4444]" />
                <span>音樂音效：靜音</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* How to play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#221a14] border-2 border-[#5c422b] rounded-lg shadow-2xl p-6 text-[#f5ebd7] flex flex-col gap-4 font-serif">
            <div className="flex items-center justify-between border-b border-[#4d3723] pb-2">
              <h3 className="text-base font-bold text-[#fef3c7] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                店員掌櫃守則與機關操作指南
              </h3>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-[#a89985] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs leading-relaxed text-[#d6c7b3]">
              <div className="p-2.5 bg-[#1a130f] border border-[#3f2c1d] rounded">
                <span className="font-bold text-[#fde047]">1. 接待一般顧客：</span>
                <p className="mt-0.5">
                  民眾頭上會顯示肥皂、黑松汽水、火柴或罐頭需求。點擊顧客即可交付商品，收取舊台幣銀幣與提升滿意度。
                </p>
              </div>

              <div className="p-2.5 bg-[#1a130f] border border-[#3f2c1d] rounded">
                <span className="font-bold text-[#f87171]">2. 搬運貨架·阻擋警匪視線：</span>
                <p className="mt-0.5">
                  外頭憲兵巡邏時會探頭探照店面！點擊底部「搬運貨架」或直接點擊臨窗貨架1，將大貨架滑移至窗前，徹底阻絕手電筒視線！
                </p>
              </div>

              <div className="p-2.5 bg-[#1a130f] border border-[#3f2c1d] rounded">
                <span className="font-bold text-[#f87171]">3. 密道開啟·掩護避難：</span>
                <p className="mt-0.5">
                  當穿著風衣的文人或敏感學生進店發出「🚨 緊急避難」信號時，拉動收銀機密道連桿開啟旋轉書櫃，引導他們迅速隱入地下密道！
                </p>
              </div>

              <div className="p-2.5 bg-[#1a130f] border border-[#3f2c1d] rounded">
                <span className="font-bold text-[#4ade80]">4. 翻轉偽裝·瞞過搜查：</span>
                <p className="mt-0.5">
                  若貨架上藏有《自由中國》禁書，遇到突擊檢查時務必點擊「翻轉偽裝」，將暗格秒速旋轉為排骨罐頭與肥皂！
                </p>
              </div>

              <div className="p-2.5 bg-[#2c1313] border border-[#7f1d1d] text-[#fca5a5] rounded">
                <span className="font-bold text-[#ef4444]">⚠️ 警戒值達 100% 失敗條件：</span>
                <p className="mt-0.5">
                  被警察當場看見違禁品或抓獲避難者，店面將遭憲兵封條查封，店員遭帶走收押！
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#443021]">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-4 py-1.5 bg-[#854d0e] hover:bg-[#a16207] text-[#fef9c3] rounded text-xs font-bold"
              >
                明白，準備就緒！
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
