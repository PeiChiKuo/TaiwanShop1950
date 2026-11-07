import React, { useState, useEffect, useRef } from 'react';
import { LevelConfig, GridCoord, Crate } from '../data/dadaochengLevels';
import { findPath } from '../utils/pathfinding';
import { sound } from '../utils/audio';

interface DadaochengBoardProps {
  level: LevelConfig;
  crates: Crate[];
  onMoveCrate: (crateId: string, dx: number, dy: number) => void;
  regularDone: number;
  mysteriousDone: number;
  onCustomerReachedCounter: () => void;
  onMysteriousReachedBackDoor: () => void;
  isPaused: boolean;
  onSuspicionChange: (delta: number) => void;
  suspicionPercent: number;
}

export const DadaochengBoard: React.FC<DadaochengBoardProps> = ({
  level,
  crates,
  onMoveCrate,
  regularDone,
  mysteriousDone,
  onCustomerReachedCounter,
  onMysteriousReachedBackDoor,
  isPaused,
  onSuspicionChange,
  suspicionPercent,
}) => {
  // Currently selected crate
  const [selectedCrateId, setSelectedCrateId] = useState<string>(crates[2]?.id || crates[0]?.id || 'c3');

  // Customer dynamic positions
  const [regularPos, setRegularPos] = useState<GridCoord>(level.regularStartPos);
  const [mysteriousPos, setMysteriousPos] = useState<GridCoord>(level.mysteriousStartPos);
  const [isRegularWalking, setIsRegularWalking] = useState(false);
  const [isMysteriousWalking, setIsMysteriousWalking] = useState(false);

  // Police Patrol Simulation
  const [police1Pos, setPolice1Pos] = useState<{ x: number; y: number; angle: number }>({ x: 2, y: 8.2, angle: 0 });
  const [police2Pos, setPolice2Pos] = useState<{ x: number; y: number; angle: number }>({ x: 9.8, y: 7.5, angle: -90 });

  // Reset positions on level change
  useEffect(() => {
    setRegularPos(level.regularStartPos);
    setMysteriousPos(level.mysteriousStartPos);
    setSelectedCrateId(crates[2]?.id || crates[0]?.id || 'c1');
    setIsRegularWalking(false);
    setIsMysteriousWalking(false);
  }, [level.id]);

  // Compute all blocked tiles (crates + fixed obstacles)
  const blockedTiles: GridCoord[] = [
    ...level.fixedObstacles,
    ...crates.map((c) => ({ x: c.x, y: c.y })),
  ];

  // Dynamic Pathfinding
  // 1. Regular customer path to counter
  const regularPath = findPath(
    regularPos,
    level.counterPos,
    level.gridWidth,
    level.gridHeight,
    blockedTiles
  );

  // 2. Mysterious customer path to back door
  const mysteriousPath = findPath(
    mysteriousPos,
    level.backDoorPos,
    level.gridWidth,
    level.gridHeight,
    blockedTiles
  );

  // Check path completion and trigger automatic walking if connected
  useEffect(() => {
    if (isPaused) return;

    // If regular path exists and customer not already at counter
    if (
      regularPath &&
      regularPath.length > 1 &&
      !isRegularWalking &&
      regularDone < level.regularTarget
    ) {
      sound.playPathConnect();
      setIsRegularWalking(true);

      let step = 0;
      const walkInterval = window.setInterval(() => {
        step++;
        if (step < regularPath.length) {
          setRegularPos(regularPath[step]);
        } else {
          window.clearInterval(walkInterval);
          setIsRegularWalking(false);
          sound.playCoinCheckout();
          onCustomerReachedCounter();
          // Reset regular customer to entrance for next one if target not yet reached
          setTimeout(() => {
            setRegularPos(level.regularStartPos);
          }, 1000);
        }
      }, 350);

      return () => window.clearInterval(walkInterval);
    }
  }, [regularPath?.length, isPaused, regularDone, level.regularTarget]);

  // If mysterious path exists and dissident not yet escaped
  useEffect(() => {
    if (isPaused) return;

    if (
      mysteriousPath &&
      mysteriousPath.length > 1 &&
      !isMysteriousWalking &&
      mysteriousDone < level.mysteriousTarget
    ) {
      sound.playPathConnect();
      setIsMysteriousWalking(true);

      let step = 0;
      const walkInterval = window.setInterval(() => {
        step++;
        if (step < mysteriousPath.length) {
          setMysteriousPos(mysteriousPath[step]);
        } else {
          window.clearInterval(walkInterval);
          setIsMysteriousWalking(false);
          sound.playSuccessEscape();
          onMysteriousReachedBackDoor();
        }
      }, 380);

      return () => window.clearInterval(walkInterval);
    }
  }, [mysteriousPath?.length, isPaused, mysteriousDone, level.mysteriousTarget]);

  // Police Patrol Animation Loop
  useEffect(() => {
    if (isPaused) return;

    let tick = 0;
    const patrolInterval = window.setInterval(() => {
      tick++;

      // Police 1 (Bottom Street: moves left to right and back)
      const p1Progress = (Math.sin(tick * 0.06) + 1) / 2; // 0 to 1
      const p1X = 1 + p1Progress * 6; // x: 1 to 7
      setPolice1Pos({
        x: p1X,
        y: 8.2,
        angle: Math.sin(tick * 0.06) > 0 ? 0 : 180,
      });

      // Police 2 (Right Alley: moves bottom to top and back)
      const p2Progress = (Math.cos(tick * 0.05) + 1) / 2;
      const p2Y = 2 + p2Progress * 5.5; // y: 2 to 7.5
      setPolice2Pos({
        x: 9.8,
        y: p2Y,
        angle: -90, // facing up
      });

      // Check if police cone spots the mysterious customer or back door
      // If police 2 is near y: 5 (where back door is at y: 5)
      const isPolice2NearBackDoor = Math.abs(p2Y - 5) < 1.4;
      const isMysteriousNearDoor = mysteriousPos.x >= 8 && mysteriousPos.y === 5;

      if (isPolice2NearBackDoor && isMysteriousNearDoor) {
        onSuspicionChange(8);
        sound.playSuspicionSpike();
      } else {
        // Natural cool-down
        onSuspicionChange(-0.5);
      }
    }, 150);

    return () => window.clearInterval(patrolInterval);
  }, [isPaused, mysteriousPos]);

  // Keyboard navigation for pushing selected crate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      const selectedCrate = crates.find((c) => c.id === selectedCrateId);
      if (!selectedCrate) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        onMoveCrate(selectedCrate.id, 0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onMoveCrate(selectedCrate.id, 0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        onMoveCrate(selectedCrate.id, -1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onMoveCrate(selectedCrate.id, 1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCrateId, crates, isPaused, onMoveCrate]);

  // Coordinate Conversion Helper (Grid tile to SVG pixel coords)
  const TILE_W = 74;
  const TILE_H = 48;
  const ORIGIN_X = 145;
  const ORIGIN_Y = 125;

  const toPx = (gx: number, gy: number) => ({
    x: ORIGIN_X + gx * TILE_W,
    y: ORIGIN_Y + gy * TILE_H,
  });

  const selectedCrate = crates.find((c) => c.id === selectedCrateId) || crates[0];
  const selectedPx = selectedCrate ? toPx(selectedCrate.x, selectedCrate.y) : { x: 0, y: 0 };

  return (
    <div className="relative w-full h-full flex-1 flex items-center justify-center p-1 md:p-3 bg-[#0d0704] select-none overflow-hidden">
      {/* SVG Canvas depicting the authentic pixel art Dadaocheng Grocery shophouse and streets */}
      <svg
        viewBox="0 0 1060 620"
        className="w-full h-full object-contain max-h-[96vh] drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Traditional Taiwanese Floral Tile (磨石子綠花地磚) */}
          <pattern id="dadaochengFloralTile" width="74" height="48" patternUnits="userSpaceOnUse">
            <rect width="74" height="48" fill="#ebe4d3" />
            {/* Fine tile grid seams */}
            <path d="M0,0 L74,0 L74,48 L0,48 Z" fill="none" stroke="#d5c8b2" strokeWidth="1" />
            {/* Elegant Floral Cross Motifs */}
            <circle cx="37" cy="24" r="5" fill="#477353" opacity="0.8" />
            <ellipse cx="37" cy="15" rx="3" ry="5" fill="#5f8c6b" opacity="0.7" />
            <ellipse cx="37" cy="33" rx="3" ry="5" fill="#5f8c6b" opacity="0.7" />
            <ellipse cx="26" cy="24" rx="5" ry="3" fill="#5f8c6b" opacity="0.7" />
            <ellipse cx="48" cy="24" rx="5" ry="3" fill="#5f8c6b" opacity="0.7" />
            {/* Red accents in flower corners */}
            <circle cx="16" cy="12" r="1.5" fill="#b91c1c" opacity="0.6" />
            <circle cx="58" cy="12" r="1.5" fill="#b91c1c" opacity="0.6" />
            <circle cx="16" cy="36" r="1.5" fill="#b91c1c" opacity="0.6" />
            <circle cx="58" cy="36" r="1.5" fill="#b91c1c" opacity="0.6" />
          </pattern>

          {/* Red Brick Street Pattern */}
          <pattern id="redBrickStreet" width="24" height="14" patternUnits="userSpaceOnUse">
            <rect width="24" height="14" fill="#66271c" />
            <rect x="0" y="0" width="11" height="6" fill="#803224" />
            <rect x="12" y="0" width="11" height="6" fill="#752c20" />
            <rect x="6" y="7" width="11" height="6" fill="#8a3728" />
            <rect x="18" y="7" width="11" height="6" fill="#752c20" />
            <line x1="0" y1="7" x2="24" y2="7" stroke="#4a1a12" strokeWidth="0.8" />
            <line x1="12" y1="0" x2="12" y2="7" stroke="#4a1a12" strokeWidth="0.8" />
          </pattern>

          {/* Police Vision Cone Light Gradient */}
          <radialGradient id="policeVisionGlow" cx="0%" cy="50%" r="100%">
            <stop offset="0%" stopColor="rgba(253, 224, 71, 0.9)" />
            <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </radialGradient>
        </defs>

        {/* ================= 1. OUTSIDE SURROUNDINGS & STREETS ================= */}
        {/* Bottom Street (Red Brick Paved) */}
        <rect x="0" y="500" width="1060" height="120" fill="url(#redBrickStreet)" />
        {/* Right Alley (Red Brick Paved) */}
        <rect x="910" y="0" width="150" height="620" fill="url(#redBrickStreet)" />

        {/* Curb Stones */}
        <line x1="0" y1="500" x2="910" y2="500" stroke="#33140d" strokeWidth="4" />
        <line x1="910" y1="0" x2="910" y2="620" stroke="#33140d" strokeWidth="4" />

        {/* Orange Patrol Route Track (🟠---> 警察巡邏路線) */}
        <g opacity="0.85">
          {/* Bottom street patrol track */}
          <line
            x1="80"
            y1="540"
            x2="945"
            y2="540"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeDasharray="8 6"
          />
          {/* Turn corner into right alley */}
          <path
            d="M945,540 Q965,540 965,510 L965,50"
            fill="none"
            stroke="#f97316"
            strokeWidth="3.5"
            strokeDasharray="8 6"
          />
          {/* Route Arrowheads */}
          {[180, 320, 460, 600, 740, 880].map((ax) => (
            <polygon key={`ax-${ax}`} points={`${ax},534 ${ax + 10},540 ${ax},546`} fill="#ea580c" />
          ))}
          {[480, 400, 320, 240, 160, 80].map((ay) => (
            <polygon key={`ay-${ay}`} points={`959,${ay} 965,${ay - 10} 971,${ay}`} fill="#ea580c" />
          ))}
        </g>

        {/* Horse carriage / Black Vintage Carriage (Bottom-Left) */}
        <g transform="translate(20, 520)">
          <rect x="0" y="0" width="75" height="48" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <rect x="10" y="10" width="22" height="18" fill="#38bdf8" opacity="0.6" />
          <rect x="42" y="10" width="22" height="18" fill="#38bdf8" opacity="0.6" />
          {/* Wheels */}
          <circle cx="18" cy="48" r="14" fill="#27272a" stroke="#71717a" strokeWidth="2" />
          <circle cx="62" cy="48" r="14" fill="#27272a" stroke="#71717a" strokeWidth="2" />
        </g>

        {/* Wooden Pushcart with Sacks (Bottom-Right near corner) */}
        <g transform="translate(680, 530)">
          <rect x="0" y="12" width="65" height="18" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          {/* Spoked Wheels */}
          <circle cx="18" cy="30" r="13" fill="#2d170b" stroke="#a16207" strokeWidth="2" />
          <circle cx="52" cy="30" r="13" fill="#2d170b" stroke="#a16207" strokeWidth="2" />
          {/* Burlap Sacks */}
          <ellipse cx="22" cy="8" rx="14" ry="9" fill="#ca8a04" />
          <ellipse cx="44" cy="6" rx="15" ry="10" fill="#eab308" />
        </g>

        {/* Street Lamps (Casting warm glow) */}
        {[
          { x: 50, y: 480 },
          { x: 670, y: 480 },
        ].map((lamp, i) => (
          <g key={`lamp-${i}`} transform={`translate(${lamp.x}, ${lamp.y})`}>
            {/* Pole */}
            <line x1="0" y1="0" x2="0" y2="40" stroke="#18181b" strokeWidth="4" />
            {/* Lantern head */}
            <polygon points="-8,-12 8,-12 10,0 -10,0" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
            <rect x="-6" y="-10" width="12" height="8" fill="#fef08a" />
            <circle cx="0" cy="-6" r="14" fill="#fef08a" opacity="0.3" className="animate-pulse" />
          </g>
        ))}

        {/* ================= 2. STOREFRONT FACADE (BAROQUE ARCHITECTURE) ================= */}
        {/* Main Building Body */}
        <rect x="30" y="15" width="875" height="485" fill="#4a1a12" stroke="#2a0d08" strokeWidth="4" rx="4" />

        {/* Shop Interior Floor (Floral Terrazzo Pattern) */}
        <rect x="80" y="115" width="775" height="345" fill="url(#dadaochengFloralTile)" />

        {/* Top Backwall Apothecary / Grocery Wall Cabinets */}
        <g transform="translate(80, 20)">
          {/* Cabinet Wood Frame */}
          <rect x="0" y="0" width="775" height="98" fill="#543018" stroke="#31190b" strokeWidth="3" />
          {/* Dividers */}
          <line x1="0" y1="48" x2="775" y2="48" stroke="#31190b" strokeWidth="2.5" />
          {[180, 360, 540].map((dx) => (
            <line key={`div-${dx}`} x1={dx} y1="0" x2={dx} y2="98" stroke="#31190b" strokeWidth="2.5" />
          ))}

          {/* Plaque: 大稻埕雜貨店 */}
          <g transform="translate(240, 10)">
            <rect x="0" y="0" width="180" height="34" rx="3" fill="#190e07" stroke="#d97706" strokeWidth="2" />
            <text x="90" y="24" fill="#fef3c7" fontSize="18" fontWeight="900" textAnchor="middle" letterSpacing="3">
              大稻埕雜貨店
            </text>
          </g>

          {/* Red Lanterns flanking sign */}
          <g transform="translate(215, 14)">
            <ellipse cx="0" cy="12" rx="9" ry="12" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <line x1="0" y1="24" x2="0" y2="32" stroke="#eab308" strokeWidth="2" />
          </g>
          <g transform="translate(445, 14)">
            <ellipse cx="0" cy="12" rx="9" ry="12" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <line x1="0" y1="24" x2="0" y2="32" stroke="#eab308" strokeWidth="2" />
          </g>

          {/* Couplet: 貨真價實 */}
          <g transform="translate(680, 10)">
            <rect x="0" y="0" width="28" height="80" fill="#fef2f2" stroke="#b91c1c" strokeWidth="1.5" />
            <text x="14" y="20" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">貨</text>
            <text x="14" y="38" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">真</text>
            <text x="14" y="56" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">價</text>
            <text x="14" y="74" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">實</text>
          </g>

          {/* Couplet: 南北雜貨 百貨齊全 */}
          <g transform="translate(10, 10)">
            <rect x="0" y="0" width="30" height="80" fill="#fef2f2" stroke="#b91c1c" strokeWidth="1.5" />
            <text x="15" y="24" fill="#b91c1c" fontSize="9" fontWeight="bold" textAnchor="middle">南北雜貨</text>
            <text x="15" y="52" fill="#b91c1c" fontSize="8" fontWeight="bold" textAnchor="middle">百貨齊全</text>
          </g>

          {/* Shelved wares: Ceramic urns, tea canisters, rice bags */}
          {/* Top shelf urns */}
          {[60, 95, 130, 480, 515, 550, 590, 625].map((ux, i) => (
            <g key={`urn-${i}`} transform={`translate(${ux}, 12)`}>
              <rect x="0" y="4" width="24" height="28" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" opacity="0.9" />
              <circle cx="12" cy="4" r="5" fill="#fef08a" />
            </g>
          ))}

          {/* Rice sacks: "米" */}
          <g transform="translate(100, 52)">
            <rect x="0" y="4" width="32" height="38" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="16" y="28" fill="#854d0e" fontSize="16" fontWeight="bold" textAnchor="middle">米</text>
          </g>
          <g transform="translate(140, 52)">
            <rect x="0" y="4" width="32" height="38" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="16" y="28" fill="#854d0e" fontSize="16" fontWeight="bold" textAnchor="middle">米</text>
          </g>
        </g>

        {/* ================= 3. CASHIER COUNTER & CLERK (TOP-RIGHT) ================= */}
        {/* Counter at grid (7, 1) to (8, 2) */}
        <g transform="translate(680, 120)">
          {/* Long Mahogany Counter */}
          <rect x="0" y="25" width="150" height="48" rx="3" fill="#451a03" stroke="#290e02" strokeWidth="2.5" />
          <rect x="10" y="32" width="130" height="8" fill="#2d1203" />

          {/* Clerk standing behind counter (vest & white shirt) */}
          <g transform="translate(60, -8)">
            {/* Clerk hair & head */}
            <circle cx="15" cy="12" r="9" fill="#fed7aa" />
            <path d="M6,10 Q15,0 24,10" fill="#18181b" />
            {/* White collar & red vest */}
            <polygon points="5,22 25,22 27,38 3,38" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <polygon points="10,22 20,22 15,30" fill="#ffffff" />
          </g>

          {/* Mechanical Cash Register */}
          <g transform="translate(15, 0)">
            <rect x="0" y="0" width="38" height="28" rx="3" fill="#71717a" stroke="#3f3f46" strokeWidth="1.5" />
            <rect x="5" y="4" width="28" height="8" fill="#18181b" />
            <text x="19" y="11" fill="#22c55e" fontSize="7" font-family="monospace" textAnchor="middle">
              $195
            </text>
            <circle cx="34" cy="14" r="3" fill="#ef4444" />
          </g>
        </g>

        {/* ================= 4. BACK DOOR "後門" (RIGHT WALL EXIT) ================= */}
        <g transform="translate(855, 345)">
          {/* Door Frame */}
          <rect x="0" y="0" width="25" height="75" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* Sign: 後門 */}
          <rect x="2" y="10" width="21" height="55" fill="#334155" />
          <text x="12" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">後</text>
          <text x="12" y="52" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">門</text>

          {/* Red lantern above back door */}
          <g transform="translate(12, -12)">
            <ellipse cx="0" cy="0" rx="8" ry="10" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="0" cy="0" r="14" fill="#f87171" opacity="0.3" className="animate-pulse" />
          </g>
        </g>

        {/* Couplet on right alley wall: 茶米南北貨 */}
        <g transform="translate(890, 410)">
          <rect x="0" y="0" width="32" height="100" fill="#fef2f2" stroke="#b91c1c" strokeWidth="2" />
          <text x="16" y="24" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">茶</text>
          <text x="16" y="48" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">米</text>
          <text x="16" y="72" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">南</text>
          <text x="16" y="94" fill="#b91c1c" fontSize="11" fontWeight="bold" textAnchor="middle">北</text>
        </g>

        {/* ================= 5. FIXED INTERIOR OBSTACLES ================= */}
        {/* Tea table with teapot and teacups at (1, 4) and (1, 5) */}
        <g transform={`translate(${toPx(1, 4).x}, ${toPx(1, 4).y})`}>
          <rect x="0" y="0" width="130" height="42" rx="3" fill="#543018" stroke="#31190b" strokeWidth="2" />
          {/* Ceramic Teapot and Cups */}
          <circle cx="25" cy="18" r="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="50" cy="14" r="5" fill="#f8fafc" />
          <circle cx="65" cy="22" r="5" fill="#f8fafc" />
          <circle cx="85" cy="14" r="5" fill="#f8fafc" />
          <circle cx="100" cy="22" r="5" fill="#f8fafc" />
        </g>

        {/* Burlap Sack with "茶" at (1, 3) */}
        <g transform={`translate(${toPx(1, 3).x + 10}, ${toPx(1, 3).y + 5})`}>
          <path d="M0,35 Q0,10 25,6 Q50,10 50,35 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1.5" />
          <text x="25" y="26" fill="#18181b" fontSize="18" fontWeight="bold" textAnchor="middle">茶</text>
        </g>

        {/* Burlap Sack with "福" at (3, 5) */}
        <g transform={`translate(${toPx(3, 5).x + 10}, ${toPx(3, 5).y + 5})`}>
          <path d="M0,35 Q0,10 25,6 Q50,10 50,35 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          <text x="25" y="26" fill="#fef08a" fontSize="18" fontWeight="bold" textAnchor="middle">福</text>
        </g>

        {/* ================= 6. DYNAMIC PATHS (動線) ================= */}
        {/* 🟢 購物動線 (Shopping Route for regular customer to counter) */}
        {regularPath && regularPath.length > 1 && (
          <g>
            <polyline
              points={regularPath
                .map((pt) => {
                  const p = toPx(pt.x, pt.y);
                  return `${p.x + TILE_W / 2},${p.y + TILE_H / 2}`;
                })
                .join(' ')}
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray="6 5"
              className="animate-pulse"
            />
            {/* Path arrow at destination */}
            {(() => {
              const last = regularPath[regularPath.length - 1];
              const p = toPx(last.x, last.y);
              return (
                <polygon
                  points={`${p.x + TILE_W / 2 - 6},${p.y + 14} ${p.x + TILE_W / 2 + 6},${p.y + 14} ${p.x + TILE_W / 2},${p.y + 6}`}
                  fill="#22c55e"
                />
              );
            })()}
          </g>
        )}

        {/* 🟣 秘密出口 (Secret Exit Route for mysterious dissident to back door) */}
        {mysteriousPath && mysteriousPath.length > 1 && (
          <g>
            <polyline
              points={mysteriousPath
                .map((pt) => {
                  const p = toPx(pt.x, pt.y);
                  return `${p.x + TILE_W / 2},${p.y + TILE_H / 2}`;
                })
                .join(' ')}
              fill="none"
              stroke="#a855f7"
              strokeWidth="4"
              strokeDasharray="6 5"
              className="animate-pulse"
            />
            {/* Arrow leading right towards Back Door */}
            {(() => {
              const last = mysteriousPath[mysteriousPath.length - 1];
              const p = toPx(last.x, last.y);
              return (
                <polygon
                  points={`${p.x + TILE_W - 14},${p.y + TILE_H / 2 - 6} ${p.x + TILE_W - 14},${p.y + TILE_H / 2 + 6} ${p.x + TILE_W - 4},${p.y + TILE_H / 2}`}
                  fill="#a855f7"
                />
              );
            })()}
          </g>
        )}

        {/* ================= 7. PUSHABLE CRATES (可推貨櫃) ================= */}
        {crates.map((crate) => {
          const cp = toPx(crate.x, crate.y);
          const isSelected = crate.id === selectedCrateId;

          return (
            <g
              key={crate.id}
              transform={`translate(${cp.x}, ${cp.y})`}
              className="cursor-pointer transition-transform duration-200 group"
              onClick={() => {
                setSelectedCrateId(crate.id);
                sound.playDoorBell();
              }}
            >
              {/* Wooden Crate Body */}
              <rect
                x="8"
                y="4"
                width={TILE_W - 16}
                height={TILE_H - 8}
                rx="3"
                fill="#854d0e"
                stroke="#451a03"
                strokeWidth="2.5"
              />
              {/* Diagonal Cross Bracing (X) */}
              <line x1="8" y1="4" x2={TILE_W - 8} y2={TILE_H - 4} stroke="#451a03" strokeWidth="2" />
              <line x1={TILE_W - 8} y1="4" x2="8" y2={TILE_H - 4} stroke="#451a03" strokeWidth="2" />
              <rect x="14" y="8" width={TILE_W - 28} height={TILE_H - 16} fill="none" stroke="#a16207" strokeWidth="1.5" />

              {/* Yellow Highlight & 4 Directional Arrows when Selected (Matches image!) */}
              {isSelected && (
                <g>
                  {/* Yellow Bracket Frame */}
                  <rect
                    x="2"
                    y="-2"
                    width={TILE_W - 4}
                    height={TILE_H + 4}
                    rx="4"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="3.5"
                    className="animate-pulse"
                  />

                  {/* 4 Yellow Arrow Buttons (UP, DOWN, LEFT, RIGHT) */}
                  {/* UP Arrow */}
                  <g
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCrate(crate.id, 0, -1);
                    }}
                  >
                    <polygon
                      points={`${TILE_W / 2}, -10 ${TILE_W / 2 - 8}, -2 ${TILE_W / 2 + 8}, -2`}
                      fill="#facc15"
                      stroke="#854d0e"
                      strokeWidth="1"
                    />
                  </g>

                  {/* DOWN Arrow */}
                  <g
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCrate(crate.id, 0, 1);
                    }}
                  >
                    <polygon
                      points={`${TILE_W / 2}, ${TILE_H + 10} ${TILE_W / 2 - 8}, ${TILE_H + 2} ${TILE_W / 2 + 8}, ${TILE_H + 2}`}
                      fill="#facc15"
                      stroke="#854d0e"
                      strokeWidth="1"
                    />
                  </g>

                  {/* LEFT Arrow */}
                  <g
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCrate(crate.id, -1, 0);
                    }}
                  >
                    <polygon
                      points={`-8, ${TILE_H / 2} 0, ${TILE_H / 2 - 8} 0, ${TILE_H / 2 + 8}`}
                      fill="#facc15"
                      stroke="#854d0e"
                      strokeWidth="1"
                    />
                  </g>

                  {/* RIGHT Arrow */}
                  <g
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCrate(crate.id, 1, 0);
                    }}
                  >
                    <polygon
                      points={`${TILE_W + 8}, ${TILE_H / 2} ${TILE_W}, ${TILE_H / 2 - 8} ${TILE_W}, ${TILE_H / 2 + 8}`}
                      fill="#facc15"
                      stroke="#854d0e"
                      strokeWidth="1"
                    />
                  </g>
                </g>
              )}
            </g>
          );
        })}

        {/* ================= 8. CHARACTERS ================= */}
        {/* Regular Customer (Farmer straw hat & basket) */}
        {regularDone < level.regularTarget && (
          <g
            transform={`translate(${toPx(regularPos.x, regularPos.y).x + 18}, ${toPx(regularPos.x, regularPos.y).y + 6})`}
            className="transition-transform duration-300"
          >
            {/* Straw Hat */}
            <ellipse cx="18" cy="6" rx="14" ry="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="18" cy="4" r="6" fill="#eab308" />
            {/* Head */}
            <circle cx="18" cy="12" r="6" fill="#fed7aa" />
            {/* Green shirt & dark shorts */}
            <rect x="10" y="18" width="16" height="15" fill="#15803d" />
            <rect x="12" y="33" width="5" height="9" fill="#1e293b" />
            <rect x="19" y="33" width="5" height="9" fill="#1e293b" />
            {/* Handwoven Bamboo Basket */}
            <rect x="25" y="24" width="10" height="10" fill="#a16207" rx="2" />
            <path d="M25,24 Q30,18 35,24" fill="none" stroke="#78350f" strokeWidth="1.5" />
          </g>
        )}

        {/* Mysterious Customer (Dark trench coat, fedora, carrying purple box) */}
        {mysteriousDone < level.mysteriousTarget && (
          <g
            transform={`translate(${toPx(mysteriousPos.x, mysteriousPos.y).x + 18}, ${toPx(mysteriousPos.x, mysteriousPos.y).y + 6})`}
            className="transition-transform duration-300"
          >
            {/* Dark Fedora Hat with Red Ribbon */}
            <ellipse cx="18" cy="6" rx="14" ry="4" fill="#0f172a" />
            <rect x="10" y="0" width="16" height="6" fill="#1e293b" />
            <rect x="10" y="4" width="16" height="2" fill="#ef4444" />
            {/* Head */}
            <circle cx="18" cy="11" r="5.5" fill="#fed7aa" />
            {/* Dark Trench Coat */}
            <polygon points="8,17 28,17 30,36 6,36" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <rect x="10" y="36" width="6" height="7" fill="#020617" />
            <rect x="20" y="36" width="6" height="7" fill="#020617" />
            {/* Purple Wrapped Contraband Box (Matches image!) */}
            <rect x="25" y="20" width="14" height="14" rx="2" fill="#9333ea" stroke="#581c87" strokeWidth="1.5" />
            <line x1="32" y1="20" x2="32" y2="34" stroke="#fef08a" strokeWidth="1" />
            <line x1="25" y1="27" x2="39" y2="27" stroke="#fef08a" strokeWidth="1" />
          </g>
        )}

        {/* ================= 9. STREET PATROL POLICE & VISION CONES ================= */}
        {/* Police 1 (Bottom Street) */}
        <g transform={`translate(${toPx(police1Pos.x, 8).x}, 540)`}>
          {/* Vision Cone (Triangular Yellow Light) */}
          <polygon
            points={
              police1Pos.angle === 0
                ? "14,0 160,-40 160,40"
                : "-14,0 -160,-40 -160,40"
            }
            fill="url(#policeVisionGlow)"
            opacity="0.8"
          />
          {/* Peaked cap & uniform */}
          <circle cx="0" cy="-22" r="7" fill="#fed7aa" />
          <ellipse cx="0" cy="-28" rx="10" ry="4" fill="#1e3a8a" />
          <polygon points="-8,-28 8,-28 6,-33 -6,-33" fill="#0f172a" />
          {/* Dark Blue Police Uniform */}
          <polygon points="-10,-15 10,-15 12,5 -12,5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
          <rect x="-8" y="5" width="6" height="12" fill="#0f172a" />
          <rect x="2" y="5" width="6" height="12" fill="#0f172a" />
        </g>

        {/* Police 2 (Right Alley Corner, Facing Upwards towards Back Door) */}
        <g transform={`translate(965, ${toPx(0, police2Pos.y).y})`}>
          {/* Vision Cone (Triangular Yellow Light Facing UP) */}
          <polygon
            points="0,-14 -60,-140 60,-140"
            fill="url(#policeVisionGlow)"
            opacity="0.85"
          />
          {/* Peaked cap & uniform */}
          <circle cx="0" cy="-4" r="7" fill="#fed7aa" />
          <ellipse cx="0" cy="-10" rx="10" ry="4" fill="#1e3a8a" />
          <polygon points="-8,-10 8,-10 6,-15 -6,-15" fill="#0f172a" />
          {/* Uniform */}
          <polygon points="-10,3 10,3 12,23 -12,23" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
          <rect x="-8" y="23" width="6" height="12" fill="#0f172a" />
          <rect x="2" y="23" width="6" height="12" fill="#0f172a" />
        </g>

        {/* ================= 10. LOWER FRONT STORE ENTRANCES ================= */}
        {/* Arches: "南北雜貨", "永久號", "大稻埕" */}
        <g transform="translate(100, 465)">
          {/* Entrance 1: 南北雜貨 */}
          <rect x="20" y="0" width="130" height="35" rx="3" fill="#2d140a" stroke="#78350f" strokeWidth="2" />
          <text x="85" y="22" fill="#fef3c7" fontSize="13" fontWeight="bold" textAnchor="middle">
            南北雜貨
          </text>
          {/* Bicycle leaning on wall */}
          <g transform="translate(170, 0)">
            <circle cx="10" cy="20" r="12" fill="none" stroke="#64748b" strokeWidth="2" />
            <circle cx="45" cy="20" r="12" fill="none" stroke="#64748b" strokeWidth="2" />
            <line x1="10" y1="20" x2="30" y2="8" stroke="#334155" strokeWidth="2" />
            <line x1="30" y1="8" x2="45" y2="20" stroke="#334155" strokeWidth="2" />
          </g>

          {/* Entrance 2 (Center): 永久號 */}
          <rect x="250" y="-8" width="150" height="42" rx="4" fill="#1c1917" stroke="#ca8a04" strokeWidth="2.5" />
          <text x="325" y="20" fill="#fde047" fontSize="17" fontWeight="900" textAnchor="middle" letterSpacing="4">
            永久號
          </text>

          {/* Entrance 3: 大稻埕 */}
          <rect x="430" y="0" width="130" height="35" rx="3" fill="#2d140a" stroke="#78350f" strokeWidth="2" />
          <text x="495" y="22" fill="#fef3c7" fontSize="14" fontWeight="bold" textAnchor="middle">
            大稻埕
          </text>
        </g>
      </svg>
    </div>
  );
};
