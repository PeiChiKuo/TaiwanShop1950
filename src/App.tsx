import React, { useState, useEffect, useCallback } from 'react';
import { DADAOCHENG_LEVELS, LevelConfig, Crate } from './data/dadaochengLevels';
import { sound } from './utils/audio';

import { DadaochengBoard } from './components/DadaochengBoard';
import { DadaochengSidebar } from './components/DadaochengSidebar';
import { HistoryDossierModal } from './components/HistoryDossierModal';
import { GameOverModal } from './components/GameOverModal';
import { Award, ArrowRight, RotateCcw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Start on Level 3 by default to match the user's uploaded screenshot!
  const [currentLevelId, setCurrentLevelId] = useState<number>(3);
  const currentLevel: LevelConfig =
    DADAOCHENG_LEVELS.find((lvl) => lvl.id === currentLevelId) || DADAOCHENG_LEVELS[2];

  // Dynamic Crates state
  const [crates, setCrates] = useState<Crate[]>(currentLevel.crates);

  // Score, coins, and timers
  const [coins, setCoins] = useState<number>(currentLevel.initialCoins);
  const [score, setScore] = useState<number>(1280);
  const [timeRemaining, setTimeRemaining] = useState<number>(currentLevel.initialTime);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Mission Progress
  const [regularDone, setRegularDone] = useState<number>(currentLevel.regularInitialDone);
  const [mysteriousDone, setMysteriousDone] = useState<number>(currentLevel.mysteriousInitialDone);
  const [suspicionPercent, setSuspicionPercent] = useState<number>(20);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Reset / Load Level
  const loadLevel = useCallback((lvlId: number) => {
    const lvl = DADAOCHENG_LEVELS.find((l) => l.id === lvlId) || DADAOCHENG_LEVELS[0];
    setCurrentLevelId(lvl.id);
    setCrates([...lvl.crates]);
    setCoins(lvl.initialCoins);
    setTimeRemaining(lvl.initialTime);
    setRegularDone(lvl.regularInitialDone);
    setMysteriousDone(lvl.mysteriousInitialDone);
    setSuspicionPercent(20);
    setIsPaused(false);
    setIsGameOver(false);
    setIsLevelCleared(false);
    sound.playDoorBell();
    sound.startAtmosphericBgm();
  }, []);

  // Restart Current Level
  const restartLevel = useCallback(() => {
    loadLevel(currentLevelId);
    showToast(`關卡 ${currentLevel.levelNumberStr} 已重置！`);
  }, [currentLevelId, currentLevel.levelNumberStr, loadLevel, showToast]);

  // Handle Level Selection
  const handleSelectLevel = (lvlId: number) => {
    loadLevel(lvlId);
  };

  // Move Crate Handler (Pushing crate by dx, dy)
  const handleMoveCrate = useCallback(
    (crateId: string, dx: number, dy: number) => {
      if (isPaused || isGameOver || isLevelCleared) return;

      setCrates((prevCrates) => {
        const targetCrate = prevCrates.find((c) => c.id === crateId);
        if (!targetCrate) return prevCrates;

        const nextX = targetCrate.x + dx;
        const nextY = targetCrate.y + dy;

        // Check grid boundary (inside room bounds: x: 0..9, y: 0..6)
        if (
          nextX < 0 ||
          nextX >= currentLevel.gridWidth ||
          nextY < 0 ||
          nextY >= currentLevel.gridHeight
        ) {
          return prevCrates;
        }

        // Check collision with other crates
        const isCrateCollision = prevCrates.some(
          (c) => c.id !== crateId && c.x === nextX && c.y === nextY
        );
        if (isCrateCollision) return prevCrates;

        // Check collision with fixed obstacles
        const isObstacleCollision = currentLevel.fixedObstacles.some(
          (o) => o.x === nextX && o.y === nextY
        );
        if (isObstacleCollision) return prevCrates;

        // Check collision with cashier counter or back door
        if (
          (nextX === currentLevel.counterPos.x && nextY === currentLevel.counterPos.y) ||
          (nextX === currentLevel.backDoorPos.x && nextY === currentLevel.backDoorPos.y)
        ) {
          return prevCrates;
        }

        // Successfully pushed!
        sound.playCratePush();
        return prevCrates.map((c) =>
          c.id === crateId ? { ...c, x: nextX, y: nextY } : c
        );
      });
    },
    [isPaused, isGameOver, isLevelCleared, currentLevel]
  );

  // When Regular Customer reaches counter
  const handleCustomerReachedCounter = () => {
    setRegularDone((prev) => {
      const nextVal = Math.min(currentLevel.regularTarget, prev + 1);
      setCoins((c) => c + 80);
      setScore((s) => s + 200);
      showToast('🛍️ 一般顧客順利結帳！營業額進帳 80 元');

      // Check victory
      if (nextVal >= currentLevel.regularTarget && mysteriousDone >= currentLevel.mysteriousTarget) {
        triggerVictory();
      }
      return nextVal;
    });
  };

  // When Mysterious Customer reaches Back Door ("後門")
  const handleMysteriousReachedBackDoor = () => {
    setMysteriousDone((prev) => {
      const nextVal = Math.min(currentLevel.mysteriousTarget, prev + 1);
      setCoins((c) => c + 150);
      setScore((s) => s + 500);
      showToast('🗝️ 神秘顧客攜帶敏感文件順利由【後門】避難！');

      // Check victory
      if (regularDone >= currentLevel.regularTarget && nextVal >= currentLevel.mysteriousTarget) {
        triggerVictory();
      }
      return nextVal;
    });
  };

  // Trigger Victory Modal
  const triggerVictory = () => {
    setIsLevelCleared(true);
    sound.playSuccessEscape();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // Suspicion adjustment
  const handleSuspicionChange = useCallback((delta: number) => {
    setSuspicionPercent((prev) => {
      const next = Math.max(0, Math.min(100, prev + delta));
      if (next >= 100) {
        setIsGameOver(true);
      }
      return next;
    });
  }, []);

  // Main Timer Countdown
  useEffect(() => {
    if (isPaused || isGameOver || isLevelCleared) return;

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused, isGameOver, isLevelCleared]);

  // Global Key listeners (R for restart, Space for pause/resume)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        restartLevel();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [restartLevel]);

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  return (
    <div className="relative flex flex-col lg:flex-row w-screen h-screen overflow-hidden bg-[#0d0704] text-[#f5ebd7] font-serif select-none">
      {/* 1. Left Main Game View (Dadaocheng Shophouse & Grid Board) */}
      <main className="relative flex-1 h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#2d1208]/95 text-[#fef08a] border-2 border-[#ca8a04] rounded shadow-2xl text-xs md:text-sm font-bold animate-in slide-in-from-top-3 duration-200">
            {toastMessage}
          </div>
        )}

        <DadaochengBoard
          level={currentLevel}
          crates={crates}
          onMoveCrate={handleMoveCrate}
          regularDone={regularDone}
          mysteriousDone={mysteriousDone}
          onCustomerReachedCounter={handleCustomerReachedCounter}
          onMysteriousReachedBackDoor={handleMysteriousReachedBackDoor}
          isPaused={isPaused}
          onSuspicionChange={handleSuspicionChange}
          suspicionPercent={suspicionPercent}
        />
      </main>

      {/* 2. Right Side Control Panel (Pixel-perfect recreation of uploaded UI!) */}
      <DadaochengSidebar
        currentLevelNumStr={currentLevel.levelNumberStr}
        coins={coins}
        timeRemaining={timeRemaining}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        onRestartLevel={restartLevel}
        onSelectLevel={handleSelectLevel}
        regularDone={regularDone}
        regularTarget={currentLevel.regularTarget}
        mysteriousDone={mysteriousDone}
        mysteriousTarget={currentLevel.mysteriousTarget}
        suspicionPercent={suspicionPercent}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 3. Level Complete / Victory Modal */}
      {isLevelCleared && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#24130b] border-4 border-[#8c4922] rounded shadow-2xl p-6 text-[#fef3c7] flex flex-col gap-4 font-serif">
            {/* Stamp */}
            <div className="absolute right-6 top-6 transform rotate-12 border-2 border-[#22c55e] text-[#22c55e] text-xs font-bold px-3 py-1 rounded shadow-md">
              順利脫困·全數通關
            </div>

            <div className="border-b border-[#5c3016] pb-3">
              <h2 className="text-2xl font-extrabold text-[#fde047] tracking-wider">
                【 關卡 {currentLevel.levelNumberStr} · 圓滿達成 】
              </h2>
              <p className="text-xs text-[#d6c2a8] mt-1 font-mono">
                {currentLevel.title} · {currentLevel.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1 py-1.5 bg-[#190d07] rounded border border-[#4d2813]">
              <span className="text-xs text-[#a3907a] mr-2">總評等：</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#170c07] border border-[#3e1f0e] rounded">
                <div className="text-[11px] text-[#a89580]">一般顧客服務</div>
                <div className="text-base font-bold text-white font-mono">
                  {regularDone} / {currentLevel.regularTarget} 位
                </div>
              </div>
              <div className="p-2.5 bg-[#170c07] border border-[#3e1f0e] rounded">
                <div className="text-[11px] text-[#a89580]">神秘人士避難</div>
                <div className="text-base font-bold text-[#a855f7] font-mono">
                  {mysteriousDone} / {currentLevel.mysteriousTarget} 位
                </div>
              </div>
              <div className="p-2.5 bg-[#170c07] border border-[#3e1f0e] rounded">
                <div className="text-[11px] text-[#a89580]">剩餘營業額金幣</div>
                <div className="text-base font-bold text-[#fef08a] font-mono">
                  🟡 {coins}
                </div>
              </div>
              <div className="p-2.5 bg-[#170c07] border border-[#3e1f0e] rounded">
                <div className="text-[11px] text-[#a89580]">最終得分</div>
                <div className="text-base font-bold text-[#22c55e] font-mono">
                  {score.toLocaleString()} 分
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#5c3016]">
              <button
                onClick={restartLevel}
                className="px-4 py-2 bg-[#422212] hover:bg-[#572d18] text-[#fef3c7] rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新挑戰</span>
              </button>

              {currentLevelId < DADAOCHENG_LEVELS.length ? (
                <button
                  onClick={() => loadLevel(currentLevelId + 1)}
                  className="px-5 py-2.5 bg-[#854d0e] hover:bg-[#a16207] text-[#fef9c3] rounded font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>下一關卡</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => loadLevel(1)}
                  className="px-5 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>全部破關！重頭開始</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          isOpen={isGameOver}
          stats={{
            score,
            combo: 1,
            maxCombo: 1,
            regularServed: regularDone,
            contrabandDelivered: 1,
            dissidentsSheltered: mysteriousDone,
            inspectionsEvaded: 2,
            moneyEarned: coins,
            currentDay: currentLevelId,
            suspicion: suspicionPercent,
            satisfactionStars: 4,
          }}
          failureReason={
            suspicionPercent >= 100
              ? '警戒值達到 100%！憲警手電筒探照察覺後門避難人士，大稻埕雜貨店遭到突擊查抄！'
              : '營業時間結束！未能於時限前完成調度！'
          }
          onRestart={restartLevel}
        />
      )}

      {/* 5. Historical Dossier Modal */}
      <HistoryDossierModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
