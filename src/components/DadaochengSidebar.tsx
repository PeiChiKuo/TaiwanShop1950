import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BookOpen, Clock } from 'lucide-react';

interface DadaochengSidebarProps {
  currentLevelNumStr: string;
  coins: number;
  timeRemaining: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestartLevel: () => void;
  onSelectLevel: (lvlId: number) => void;
  regularDone: number;
  regularTarget: number;
  mysteriousDone: number;
  mysteriousTarget: number;
  suspicionPercent: number; // 0 to 100
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
}

export const DadaochengSidebar: React.FC<DadaochengSidebarProps> = ({
  currentLevelNumStr,
  coins,
  timeRemaining,
  isPaused,
  onTogglePause,
  onRestartLevel,
  onSelectLevel,
  regularDone,
  regularTarget,
  mysteriousDone,
  mysteriousTarget,
  suspicionPercent,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
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

  // Convert suspicion to 8 segments
  const totalSegments = 8;
  const filledSegments = Math.round((suspicionPercent / 100) * totalSegments);

  return (
    <aside className="w-full lg:w-[360px] xl:w-[410px] h-full flex flex-col justify-between p-3.5 bg-[#120a06] border-2 border-[#543018] shadow-2xl text-[#f3e5cb] font-serif select-none overflow-y-auto">
      {/* 1. Header Banner: Title & Dadaocheng Wharf Silhouette (Matches image top!) */}
      <div className="relative w-full border-2 border-[#69391a] rounded p-2.5 bg-[#1a0e08] flex flex-col items-center shadow-md">
        {/* Ornate corner flourishes */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#d97706]" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#d97706]" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#d97706]" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#d97706]" />

        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-[0.25em] text-[#ffdd88] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          大稻埕雜貨店
        </h1>

        {/* Pixel Dadaocheng Wharf Skyline (Steamships, Junk boat, Sunset, Historical Buildings) */}
        <div className="w-full h-14 mt-1.5 border border-[#4a2612] rounded bg-[#2b140b] relative overflow-hidden flex items-end justify-center">
          {/* Sunset sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a2810] via-[#8c3b17] to-[#d97706] opacity-90" />
          {/* Setting Sun */}
          <div className="absolute top-2 right-8 w-6 h-6 rounded-full bg-[#fde047] shadow-[0_0_12px_#fde047]" />

          {/* Silhouette skyline */}
          <svg
            viewBox="0 0 300 50"
            className="w-full h-11 relative z-10"
            preserveAspectRatio="none"
          >
            {/* Shophouses and Customs Wharf Buildings */}
            <rect x="5" y="15" width="25" height="35" fill="#140a05" />
            <polygon points="5,15 17,5 30,15" fill="#140a05" />
            <rect x="35" y="20" width="30" height="30" fill="#140a05" />
            <rect x="70" y="8" width="40" height="42" fill="#140a05" />
            <polygon points="70,8 90,0 110,8" fill="#140a05" />
            <rect x="115" y="22" width="25" height="28" fill="#140a05" />
            <rect x="145" y="18" width="35" height="32" fill="#140a05" />

            {/* Masts and Steamships in Tamsui River */}
            <line x1="195" y1="50" x2="195" y2="10" stroke="#140a05" strokeWidth="2" />
            <line x1="188" y1="20" x2="202" y2="20" stroke="#140a05" strokeWidth="1.5" />
            <ellipse cx="205" cy="44" rx="20" ry="6" fill="#140a05" />

            {/* Chinese Sail Junk Boat */}
            <polygon points="245,46 275,46 280,40 240,40" fill="#140a05" />
            <line x1="260" y1="40" x2="260" y2="12" stroke="#140a05" strokeWidth="1.5" />
            <polygon points="260,14 275,25 260,35" fill="#140a05" />

            {/* Water reflections */}
            <rect x="0" y="46" width="300" height="4" fill="#0f0703" />
            <line x1="50" y1="47" x2="80" y2="47" stroke="#b45309" strokeWidth="0.8" />
            <line x1="140" y1="48" x2="190" y2="48" stroke="#d97706" strokeWidth="0.8" />
          </svg>
        </div>
      </div>

      {/* 2. Stats Row: Level [關卡 03] & Coins [🟡 320] & Timer [02:45] [⏸] */}
      <div className="flex flex-col gap-2 my-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Level box */}
          <div className="flex-1 py-1.5 px-3 bg-[#42150f] border-2 border-[#802a1e] rounded shadow flex items-center justify-center">
            <span className="font-serif text-base font-extrabold text-[#fecaca] tracking-widest">
              關卡 {currentLevelNumStr}
            </span>
          </div>

          {/* Coin box */}
          <div className="flex-1 py-1.5 px-3 bg-[#24130b] border-2 border-[#69391a] rounded shadow flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#eab308] border border-[#fef08a] flex items-center justify-center shadow">
              <div className="w-2.5 h-2.5 rounded-full border border-[#854d0e] bg-[#ca8a04]" />
            </div>
            <span className="font-mono text-lg font-bold text-[#fef08a] tabular-nums">
              {coins}
            </span>
          </div>
        </div>

        {/* Time and Pause button */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#190e08] border-2 border-[#543018] rounded shadow-inner">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#f59e0b]" />
            <span className="font-mono text-2xl font-bold text-[#fff] tracking-wider tabular-nums">
              {formatTime(timeRemaining)}
            </span>
          </div>

          <button
            onClick={onTogglePause}
            className="w-9 h-8 bg-[#2d180d] hover:bg-[#422212] border-2 border-[#8c4922] rounded flex items-center justify-center text-[#ffdd88] transition-colors shadow active:scale-95"
            title={isPaused ? '繼續遊戲' : '暫停遊戲'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>
        </div>
      </div>

      {/* 3. 今日任務 Panel (Today's Missions) */}
      <div className="border-2 border-[#5c341b] rounded bg-[#1a0e08] p-3 shadow-md flex flex-col gap-2 my-1">
        <h2 className="text-center font-bold text-sm tracking-widest text-[#ffdd88] border-b border-[#4d2913] pb-1">
          今日任務
        </h2>

        {/* General Customer */}
        <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {/* Farmer Straw Hat Avatar */}
            <div className="w-6 h-6 rounded bg-[#2d1a0e] border border-[#6b4122] flex items-center justify-center">
              <span className="text-xs">👨‍🌾</span>
            </div>
            <span className="text-[#e2d5be] font-medium">一般顧客</span>
          </div>
          <span className="font-mono text-base font-bold text-[#fef08a] tabular-nums">
            {regularDone}/{regularTarget}
          </span>
        </div>

        {/* Mysterious Dissident Customer */}
        <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {/* Fedora & Trench Coat Avatar */}
            <div className="w-6 h-6 rounded bg-[#2d1a0e] border border-[#6b4122] flex items-center justify-center">
              <span className="text-xs">🕵️</span>
            </div>
            <span className="text-[#e2d5be] font-medium">神秘顧客</span>
          </div>
          <span className="font-mono text-base font-bold text-[#f87171] tabular-nums">
            {mysteriousDone}/{mysteriousTarget}
          </span>
        </div>

        {/* Alert / Suspicion Level Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-[#4d2913] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1e293b] border border-[#334155] flex items-center justify-center">
              <span className="text-xs">👮</span>
            </div>
            <span className="text-[#e2d5be] font-medium">警戒值</span>
          </div>

          {/* Segmented Progress Bar matching image: [■■□□□□□□] */}
          <div className="flex items-center gap-1 p-1 bg-[#0f0704] border border-[#522b14] rounded">
            {Array.from({ length: totalSegments }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3 rounded-xs transition-colors duration-300 ${
                  idx < filledSegments
                    ? idx > 5
                      ? 'bg-[#ef4444] shadow-[0_0_6px_#ef4444]'
                      : idx > 3
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#22c55e]'
                    : 'bg-[#2b160b]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. 圖示說明 (Legend / Instructions) */}
      <div className="border-2 border-[#5c341b] rounded bg-[#1a0e08] p-3 shadow-md flex flex-col gap-1.5 my-1 text-xs">
        <h2 className="text-center font-bold text-xs tracking-widest text-[#ffdd88] border-b border-[#4d2913] pb-1">
          圖示說明
        </h2>

        {/* Pushable crate icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 bg-[#78350f] border-2 border-[#facc15] rounded flex items-center justify-center text-[10px] shadow">
            📦
          </div>
          <span className="text-[#e6d8c3]">可推貨櫃 (點選後移動)</span>
        </div>

        {/* Shopping route */}
        <div className="flex items-center gap-2.5">
          <span className="text-emerald-400 font-bold font-mono tracking-tighter">🟢 ───▶</span>
          <span className="text-[#e6d8c3]">購物動線 (引導至收銀台)</span>
        </div>

        {/* Secret exit route */}
        <div className="flex items-center gap-2.5">
          <span className="text-purple-400 font-bold font-mono tracking-tighter">🟣 ───▶</span>
          <span className="text-[#e6d8c3]">秘密出口 (引導至後門)</span>
        </div>

        {/* Police vision */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center text-[10px]">
            <span>👮</span>
            <div className="w-3 h-2 bg-amber-400/80 clip-triangle" />
          </div>
          <span className="text-[#e6d8c3]">警察視野（街道巡邏）</span>
        </div>

        {/* Police patrol line */}
        <div className="flex items-center gap-2.5">
          <span className="text-amber-500 font-bold font-mono tracking-tighter">🟠 ───▶</span>
          <span className="text-[#e6d8c3]">警察巡邏路線</span>
        </div>
      </div>

      {/* 5. Key Shortcuts Guide */}
      <div className="flex items-center justify-around py-1.5 px-2 bg-[#170c07] border border-[#4d2813] rounded text-[11px] text-[#bdae99] font-mono my-1">
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 bg-[#2d180d] border border-[#6b3819] rounded text-[10px] text-white">❖</span>
          <span>移動</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 bg-[#2d180d] border border-[#6b3819] rounded text-[10px] text-white">Space</span>
          <span>推動</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 bg-[#2d180d] border border-[#6b3819] rounded text-[10px] text-white">R</span>
          <span>重來</span>
        </div>
      </div>

      {/* 6. Action Buttons at Bottom */}
      <div className="flex items-center justify-between gap-2.5 pt-2">
        {/* Restart Button (Reddish Brown matching mockup) */}
        <button
          onClick={onRestartLevel}
          className="flex-1 py-2.5 px-3 bg-[#692418] hover:bg-[#832d1e] border-2 border-[#b84531] rounded font-bold text-xs text-[#fee2e2] shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>重新開始</span>
        </button>

        {/* Pause / Resume Button (Dark Green matching mockup) */}
        <button
          onClick={onTogglePause}
          className="flex-1 py-2.5 px-3 bg-[#1e4028] hover:bg-[#285737] border-2 border-[#3d7a50] rounded font-bold text-xs text-[#dcfce7] shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          <span>{isPaused ? '繼續遊戲' : '暫停'}</span>
        </button>
      </div>

      {/* Secondary Quick Toggles */}
      <div className="flex items-center justify-between pt-2 border-t border-[#3e1f0e] text-[10px] text-[#9c8975] mt-1">
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1 hover:text-[#fef08a] transition-colors"
        >
          <BookOpen className="w-3 h-3 text-[#d97706]" />
          <span>大稻埕歷史密卷</span>
        </button>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-1 hover:text-[#fef08a] transition-colors"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>音效開</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-rose-400" />
              <span>音效關</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
