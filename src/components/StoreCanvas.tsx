import React, { useState } from 'react';
import {
  ShelfState,
  Customer,
  PolicePatrol,
  GroceryItem,
} from '../types/game';
import { sound } from '../utils/audio';
import { GROCERY_ITEMS } from '../data/items';
import {
  ShieldAlert,
  ArrowRight,
  Check,
  AlertTriangle,
  MoveHorizontal,
  RefreshCw,
  DoorOpen,
} from 'lucide-react';

interface StoreCanvasProps {
  shelfState: ShelfState;
  customers: Customer[];
  police: PolicePatrol;
  isPoliceAlarm: boolean;
  onFulfillCustomerItem: (customerId: string) => void;
  onGuideCustomerToShelter: (customerId: string) => void;
  onToggleWindowShelf: () => void;
  onToggleCenterShelf: () => void;
  onToggleSecretPassage: () => void;
  onToggleCamouflage: () => void;
  onOpenCashRegister: () => void;
  heldItem: GroceryItem | null;
  onPickUpItem: (item: GroceryItem) => void;
}

export const StoreCanvas: React.FC<StoreCanvasProps> = ({
  shelfState,
  customers,
  police,
  isPoliceAlarm,
  onFulfillCustomerItem,
  onGuideCustomerToShelter,
  onToggleWindowShelf,
  onToggleCenterShelf,
  onToggleSecretPassage,
  onToggleCamouflage,
  onOpenCashRegister,
  heldItem,
  onPickUpItem,
}) => {
  const [hoveredShelf, setHoveredShelf] = useState<string | null>(null);

  // Check if police can see inside the store
  const isSightBlockedByShelf = shelfState.windowShelfPos === 'BLOCK_WINDOW';
  const isPolicePeeking = police.state === 'PEEKING' || police.state === 'RAID_INSPECTING';

  return (
    <div className="relative w-full flex-1 min-h-[480px] bg-[#12100e] overflow-hidden select-none flex items-center justify-center p-2">
      {/* Background ambient texture / subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,32,24,0.4)_0%,rgba(10,8,7,0.95)_100%)] pointer-events-none" />

      {/* Emergency Red Alert Screen Vignette when police is alarmed */}
      {isPoliceAlarm && (
        <div className="absolute inset-0 border-4 border-red-600/80 shadow-[inset_0_0_50px_rgba(220,38,38,0.5)] pointer-events-none z-30 animate-pulse" />
      )}

      {/* Main Isometric Playfield Container */}
      <div className="relative w-full max-w-[1080px] aspect-[16/9] min-h-[440px] max-h-[640px] bg-[#1d1813] border-4 border-[#3c3124] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
        {/* Isometric SVG / Scene Render */}
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Terrazzo Floor Pattern */}
            <pattern id="terrazzoPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#2d261e" />
              <circle cx="8" cy="12" r="2.5" fill="#3f352a" />
              <circle cx="28" cy="24" r="3" fill="#241e17" />
              <circle cx="16" cy="32" r="2" fill="#4a3f32" />
              <circle cx="34" cy="8" r="1.5" fill="#57493a" />
              <path d="M0,0 L40,0 L40,40 L0,40 Z" fill="none" stroke="#221c15" strokeWidth="0.8" />
            </pattern>

            {/* Wood Floor Planks */}
            <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#452f1e" />
              <stop offset="50%" stopColor="#382517" />
              <stop offset="100%" stopColor="#2c1d12" />
            </linearGradient>

            {/* Dark alley outside */}
            <linearGradient id="alleyNight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#080b10" />
              <stop offset="70%" stopColor="#101721" />
              <stop offset="100%" stopColor="#182230" />
            </linearGradient>

            {/* Flashlight Beam Cone */}
            <radialGradient id="flashlightCone" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.85)" />
              <stop offset="40%" stopColor="rgba(239, 68, 68, 0.45)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Shadow Filter */}
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* ================= 1. ROOM SHELL & ARCHITECTURE ================= */}

          {/* Exterior Dark Alley (Left strip outside the door & windows) */}
          <polygon points="0,0 160,0 160,620 0,620" fill="url(#alleyNight)" />

          {/* Dark Alley details: rain puddles, cobblestone curb */}
          <line x1="160" y1="0" x2="160" y2="620" stroke="#2a3848" strokeWidth="3" />
          <ellipse cx="60" cy="420" rx="40" ry="12" fill="#15202b" opacity="0.7" />
          <ellipse cx="110" cy="200" rx="30" ry="8" fill="#15202b" opacity="0.6" />

          {/* Alley Streetlamp / dim bulb */}
          <circle cx="50" cy="70" r="14" fill="#fbbf24" opacity="0.2" />
          <circle cx="50" cy="70" r="6" fill="#fef08a" />
          <line x1="50" y1="70" x2="50" y2="140" stroke="#334155" strokeWidth="3" />

          {/* Police Officer in Dark Alley */}
          <g
            transform={`translate(${80}, ${180 + (police.distance / 100) * 220})`}
            className="transition-all duration-700"
          >
            {/* Police shadow */}
            <ellipse cx="0" cy="42" rx="18" ry="6" fill="#000" opacity="0.7" />

            {/* Peaked military cap (憲警大盤帽) */}
            <ellipse cx="0" cy="0" rx="14" ry="5" fill="#1e293b" />
            <polygon points="-12,-2 12,-2 10,-8 -10,-8" fill="#0f172a" />
            <rect x="-8" y="-3" width="16" height="2" fill="#eab308" />

            {/* Head & Face */}
            <circle cx="0" cy="8" r="8" fill="#fbd38d" />

            {/* Dark 1950s Uniform & Coat */}
            <polygon points="-14,16 14,16 18,40 -18,40" fill="#1e293b" />
            <rect x="-13" y="16" width="26" height="20" fill="#0f172a" />
            <line x1="0" y1="16" x2="0" y2="36" stroke="#475569" strokeWidth="1.5" />
            {/* Belt & brass buckle */}
            <rect x="-12" y="28" width="24" height="3" fill="#451a03" />
            <rect x="-3" y="27" width="6" height="5" fill="#eab308" />

            {/* Legs & Boots */}
            <rect x="-10" y="38" width="8" height="14" fill="#0f172a" />
            <rect x="2" y="38" width="8" height="14" fill="#0f172a" />

            {/* Flashlight in hand */}
            <rect x="10" y="22" width="12" height="5" fill="#64748b" transform="rotate(15 10 22)" />
            <polygon points="20,18 25,16 25,29 20,27" fill="#cbd5e1" />

            {/* Police Alert Speech Bubble or Question Mark */}
            {isPoliceAlarm && (
              <g transform="translate(14, -25)">
                <rect x="-5" y="-12" width="55" height="18" rx="4" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                <text x="22" y="1" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  有異狀？！
                </text>
              </g>
            )}
          </g>

          {/* Flashlight Beam Penetration through Window/Door */}
          {isPolicePeeking && (
            <g>
              {/* Beam Polygon */}
              <polygon
                points={
                  isSightBlockedByShelf
                    ? `160,${220 + (police.distance / 100) * 120} 270,180 270,360 160,${280 + (police.distance / 100) * 120}`
                    : `160,${220 + (police.distance / 100) * 120} 800,100 850,550 160,${280 + (police.distance / 100) * 120}`
                }
                fill="url(#flashlightCone)"
                opacity={isSightBlockedByShelf ? 0.35 : 0.75}
                className="transition-all duration-300"
              />
              {/* Flashlight source flare */}
              <circle
                cx="160"
                cy={250 + (police.distance / 100) * 120}
                r="18"
                fill="#fef08a"
                opacity="0.8"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Store Interior Floor (Isometric Polygon) */}
          <polygon
            points="160,130 960,130 960,620 160,620"
            fill="url(#terrazzoPattern)"
          />

          {/* Back Wall (1950s wooden paneling & retro posters) */}
          <polygon points="160,0 960,0 960,130 160,130" fill="#201a14" />
          <line x1="160" y1="130" x2="960" y2="130" stroke="#3d3023" strokeWidth="4" />

          {/* Slogan poster on back wall: 「保密防諜 人人有責」 */}
          <g transform="translate(260, 25)">
            <rect x="0" y="0" width="70" height="95" fill="#fef2f2" stroke="#991b1b" strokeWidth="2" />
            <rect x="4" y="4" width="62" height="87" fill="#fff" stroke="#b91c1c" strokeWidth="1" />
            <text x="35" y="24" fill="#991b1b" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
              保密
            </text>
            <text x="35" y="40" fill="#991b1b" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">
              防諜
            </text>
            <text x="35" y="60" fill="#1e3a8a" fontSize="7" fontWeight="bold" textAnchor="middle">
              人人有責
            </text>
            <rect x="15" y="72" width="40" height="12" fill="#b91c1c" />
            <text x="35" y="81" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle">
              嚴防密報
            </text>
          </g>

          {/* Permanent Background Wall Cabinets (stocked with retro wares) */}
          <g transform="translate(360, 10)">
            {/* Shelf Frame */}
            <rect x="0" y="0" width="380" height="118" fill="#4a3726" stroke="#2c1e14" strokeWidth="3" />
            {/* Shelves dividers */}
            <line x1="0" y1="40" x2="380" y2="40" stroke="#2c1e14" strokeWidth="2.5" />
            <line x1="0" y1="80" x2="380" y2="80" stroke="#2c1e14" strokeWidth="2.5" />
            <line x1="120" y1="0" x2="120" y2="118" stroke="#2c1e14" strokeWidth="2" />
            <line x1="240" y1="0" x2="240" y2="118" stroke="#2c1e14" strokeWidth="2" />

            {/* Rows of retro goods */}
            {/* Top row: Glass candy jars & tea tins */}
            {[20, 50, 80, 140, 170, 200, 260, 290, 320, 350].map((x, i) => (
              <g key={`jar-${i}`} transform={`translate(${x}, 14)`}>
                <rect x="0" y="0" width="18" height="24" rx="2" fill={i % 2 === 0 ? '#38bdf8' : '#ca8a04'} opacity="0.8" />
                <rect x="2" y="-3" width="14" height="4" fill="#94a3b8" />
                <rect x="4" y="6" width="10" height="10" fill="#fef3c7" opacity="0.7" />
              </g>
            ))}

            {/* Middle row: HeySong Soda bottles & canned goods */}
            {[15, 38, 62, 85, 135, 160, 185, 210, 255, 280, 305, 335].map((x, i) => (
              <g key={`can-${i}`} transform={`translate(${x}, 52)`}>
                {i % 3 === 0 ? (
                  // Soda Bottle
                  <g>
                    <rect x="3" y="0" width="8" height="25" rx="3" fill="#047857" />
                    <rect x="5" y="-5" width="4" height="6" fill="#065f46" />
                    <circle cx="7" cy="-5" r="2.5" fill="#dc2626" />
                  </g>
                ) : (
                  // Tin Can
                  <g>
                    <rect x="0" y="4" width="16" height="20" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                    <rect x="2" y="8" width="12" height="12" fill="#f97316" />
                  </g>
                )}
              </g>
            ))}

            {/* Bottom row: Flour sacks and soap boxes */}
            {[20, 60, 140, 180, 260, 300, 340].map((x, i) => (
              <g key={`soap-${i}`} transform={`translate(${x}, 88)`}>
                {i % 2 === 0 ? (
                  // Star Soap Green Box
                  <rect x="0" y="4" width="28" height="22" rx="1" fill="#15803d" stroke="#166534" strokeWidth="1" />
                ) : (
                  // Flour Sack
                  <path d="M0,26 Q0,8 15,6 Q30,8 30,26 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                )}
              </g>
            ))}
          </g>

          {/* Left Wall Partition & Green Door / Windows */}
          <polygon points="160,0 160,620 185,620 185,0" fill="#1f3b2b" stroke="#14261c" strokeWidth="2" />

          {/* Green Wooden Windows & Door Panes */}
          <g transform="translate(162, 140)">
            {/* Double Door Frame */}
            <rect x="0" y="0" width="22" height="240" fill="#1b4d3e" stroke="#0f2e25" strokeWidth="2" />
            {/* Glass Panels looking out to the street */}
            {[20, 70, 130, 180].map((y, i) => (
              <rect
                key={`pane-${i}`}
                x="3"
                y={y}
                width="16"
                height="35"
                fill="#38bdf8"
                opacity="0.3"
                stroke="#0f2e25"
                strokeWidth="1.5"
              />
            ))}
            {/* Door Knobs */}
            <circle cx="6" cy="120" r="3" fill="#eab308" />
            <circle cx="16" cy="120" r="3" fill="#eab308" />
          </g>

          {/* Red Welcome Rug inside the door */}
          <ellipse cx="230" cy="380" rx="42" ry="22" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
          <text x="230" y="384" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle" fontStyle="italic">
            歡迎光臨
          </text>

          {/* Floor Brass Sliding Rails for Dynamic Shelves */}
          {/* Rail 1 (Front Window shelf track) */}
          <line x1="210" y1="200" x2="310" y2="200" stroke="#a16207" strokeWidth="4" opacity="0.6" strokeDasharray="6 3" />
          <line x1="210" y1="440" x2="310" y2="440" stroke="#a16207" strokeWidth="4" opacity="0.6" strokeDasharray="6 3" />

          {/* Rail 2 (Center shelf track) */}
          <line x1="430" y1="360" x2="620" y2="360" stroke="#a16207" strokeWidth="4" opacity="0.6" strokeDasharray="6 3" />

          {/* ================= 2. SECRET PASSAGE (REAR BOOKCASE) ================= */}
          <g
            transform="translate(760, 30)"
            className="cursor-pointer group"
            onClick={onToggleSecretPassage}
          >
            {/* When Open: The hidden stone staircase leading down to basement */}
            {shelfState.secretPassagePos === 'OPEN' ? (
              <g>
                {/* Dark Hole in Wall / Floor */}
                <rect x="0" y="0" width="160" height="150" fill="#0f0d0c" stroke="#dc2626" strokeWidth="2" />
                {/* Spiral Steps descending */}
                {[20, 45, 70, 95, 120].map((stepY, idx) => (
                  <polygon
                    key={`step-${idx}`}
                    points={`10,${stepY} 150,${stepY} 140,${stepY + 18} 20,${stepY + 18}`}
                    fill={`rgb(${45 - idx * 6}, ${35 - idx * 5}, ${30 - idx * 4})`}
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                ))}
                {/* Warm secret lantern glow at bottom of stairs */}
                <circle cx="80" cy="135" r="20" fill="#f59e0b" opacity="0.7" className="animate-pulse" />

                {/* Secret shelter sign */}
                <rect x="25" y="5" width="110" height="22" rx="4" fill="#7f1d1d" />
                <text x="80" y="20" fill="#fef2f2" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ⬇ 地下避難所 (暗道已通)
                </text>
              </g>
            ) : (
              // When Closed: Looks like ordinary tall library bookshelf
              <g filter="url(#dropShadow)">
                <rect x="0" y="0" width="160" height="150" fill="#5c4028" stroke="#382517" strokeWidth="3" />
                {/* Shelf dividers */}
                <line x1="0" y1="50" x2="160" y2="50" stroke="#382517" strokeWidth="3" />
                <line x1="0" y1="100" x2="160" y2="100" stroke="#382517" strokeWidth="3" />
                {/* Books lined up */}
                {[15, 30, 45, 60, 75, 90, 105, 120, 135].map((bx, bi) => (
                  <rect
                    key={`b-${bi}`}
                    x={bx}
                    y="12"
                    width="12"
                    height="36"
                    fill={['#1e3a8a', '#14532d', '#7f1d1d', '#78350f', '#0f172a'][bi % 5]}
                    stroke="#271c14"
                    strokeWidth="0.8"
                  />
                ))}
                {[15, 30, 48, 65, 82, 100, 118, 135].map((bx, bi) => (
                  <rect
                    key={`b2-${bi}`}
                    x={bx}
                    y="62"
                    width="14"
                    height="36"
                    fill={['#831843', '#713f12', '#1e293b', '#134e4a'][bi % 4]}
                    stroke="#271c14"
                    strokeWidth="0.8"
                  />
                ))}
                {/* Secret seam hint */}
                <line x1="158" y1="0" x2="158" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <text x="80" y="132" fill="#d6c6b2" fontSize="9" textAnchor="middle">
                  [旋轉書櫃機關]
                </text>
              </g>
            )}
          </g>

          {/* ================= 3. DYNAMIC SLIDING SHELVES ================= */}

          {/* SHELF 1: Front Window Shelf (Blocks sightline from window/door) */}
          <g
            transform={`translate(${shelfState.windowShelfPos === 'BLOCK_WINDOW' ? 200 : 290}, 160)`}
            className="cursor-pointer transition-transform duration-500"
            filter="url(#dropShadow)"
            onClick={onToggleWindowShelf}
            onMouseEnter={() => setHoveredShelf('shelf1')}
            onMouseLeave={() => setHoveredShelf(null)}
          >
            {/* Highlight outline when hovered or blocking window */}
            <rect
              x="-6"
              y="-6"
              width="92"
              height="282"
              rx="6"
              fill="none"
              stroke={
                shelfState.windowShelfPos === 'BLOCK_WINDOW' ? '#facc15' : '#ef4444'
              }
              strokeWidth={hoveredShelf === 'shelf1' ? 3 : 2}
              className={shelfState.windowShelfPos === 'BLOCK_WINDOW' ? 'animate-pulse' : ''}
            />

            {/* Main Shelf Body (Dark Teak Wood) */}
            <rect x="0" y="0" width="80" height="270" rx="3" fill="#6d4c2b" stroke="#3d2916" strokeWidth="3" />

            {/* Multi-tier shelves */}
            {[55, 110, 165, 220].map((sy, idx) => (
              <line key={`s1-${idx}`} x1="0" y1={sy} x2="80" y2={sy} stroke="#3d2916" strokeWidth="3" />
            ))}

            {/* Top Tag: Mode */}
            <rect x="4" y="6" width="72" height="18" rx="2" fill="#2d1e11" />
            <text x="40" y="19" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
              {shelfState.windowShelfPos === 'BLOCK_WINDOW' ? '🛡️ 視線阻絕中' : '⚠️ 窗景露出'}
            </text>

            {/* Displayed Items on Shelf 1 */}
            {shelfState.windowShelfCamouflage === 'NORMAL_GOODS' ? (
              // Innocent goods: Soaps & canned foods
              <g>
                {/* Shelf tier 1: Star soaps */}
                <rect x="12" y="30" width="24" height="20" rx="2" fill="#16a34a" />
                <rect x="42" y="30" width="24" height="20" rx="2" fill="#16a34a" />
                <text x="40" y="44" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  肥皂
                </text>

                {/* Shelf tier 2: Canned food */}
                <rect x="15" y="75" width="22" height="28" rx="2" fill="#ea580c" />
                <rect x="45" y="75" width="22" height="28" rx="2" fill="#ea580c" />
                <text x="40" y="94" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  罐頭
                </text>

                {/* Shelf tier 3: Matches & Candies */}
                <rect x="15" y="130" width="22" height="25" fill="#dc2626" />
                <rect x="44" y="130" width="22" height="25" fill="#eab308" />

                {/* Shelf tier 4: Rice bags */}
                <rect x="15" y="185" width="50" height="28" rx="3" fill="#fef08a" />
                <text x="40" y="202" fill="#854d0e" fontSize="8" fontWeight="bold" textAnchor="middle">
                  蓬萊米
                </text>
              </g>
            ) : (
              // CONTRABAND EXPOSED: Banned books & clandestine leaflets!
              <g className="animate-pulse">
                <rect x="6" y="28" width="68" height="230" fill="#3b0707" opacity="0.8" />
                <rect x="14" y="35" width="52" height="30" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                <text x="40" y="54" fill="#fee2e2" fontSize="9" fontWeight="bold" textAnchor="middle">
                  《自由中國》
                </text>

                <rect x="14" y="90" width="52" height="28" fill="#450a0a" stroke="#f87171" strokeWidth="1" />
                <text x="40" y="108" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">
                  地下油印傳單
                </text>

                <rect x="14" y="145" width="52" height="28" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
                <text x="40" y="163" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle">
                  短波真空管
                </text>

                <text x="40" y="240" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ⚠️ 違禁品露餡！
                </text>
              </g>
            )}

            {/* Bottom track wheels */}
            <circle cx="15" cy="275" r="5" fill="#1e293b" />
            <circle cx="65" cy="275" r="5" fill="#1e293b" />
          </g>

          {/* SHELF 2: Center Aisle Island Shelf (Can slide left/right) */}
          <g
            transform={`translate(${shelfState.centerShelfPos === 'LEFT' ? 420 : 540}, 250)`}
            className="cursor-pointer transition-transform duration-500"
            filter="url(#dropShadow)"
            onClick={onToggleCenterShelf}
            onMouseEnter={() => setHoveredShelf('shelf2')}
            onMouseLeave={() => setHoveredShelf(null)}
          >
            {/* Outline on hover */}
            <rect
              x="-4"
              y="-4"
              width="158"
              height="208"
              rx="6"
              fill="none"
              stroke="#ca8a04"
              strokeWidth={hoveredShelf === 'shelf2' ? 3 : 1.5}
            />

            {/* Shelf Body */}
            <rect x="0" y="0" width="150" height="200" rx="3" fill="#583c22" stroke="#2d1d0e" strokeWidth="3" />
            <line x1="0" y1="65" x2="150" y2="65" stroke="#2d1d0e" strokeWidth="3" />
            <line x1="0" y1="130" x2="150" y2="130" stroke="#2d1d0e" strokeWidth="3" />
            <line x1="75" y1="0" x2="75" y2="200" stroke="#2d1d0e" strokeWidth="2" />

            {/* Goods displayed on Center Shelf */}
            {/* Left Column */}
            <g transform="translate(10, 15)">
              <rect x="0" y="0" width="22" height="35" rx="2" fill="#0284c7" />
              <rect x="30" y="0" width="22" height="35" rx="2" fill="#16a34a" />
              <text x="26" y="24" fill="#fff" fontSize="8" textAnchor="middle">肥皂</text>
            </g>
            <g transform="translate(10, 80)">
              <rect x="0" y="0" width="25" height="30" rx="2" fill="#ea580c" />
              <rect x="30" y="0" width="25" height="30" rx="2" fill="#ea580c" />
              <text x="27" y="20" fill="#fff" fontSize="8" textAnchor="middle">冬筍</text>
            </g>
            <g transform="translate(10, 145)">
              <rect x="0" y="0" width="55" height="35" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              <text x="27" y="22" fill="#854d0e" fontSize="9" fontWeight="bold" textAnchor="middle">麵粉袋</text>
            </g>

            {/* Right Column */}
            <g transform="translate(85, 15)">
              <circle cx="15" cy="18" r="12" fill="#047857" />
              <circle cx="42" cy="18" r="12" fill="#047857" />
              <text x="28" y="22" fill="#fff" fontSize="8" textAnchor="middle">汽水</text>
            </g>
            <g transform="translate(85, 80)">
              <rect x="0" y="0" width="55" height="30" rx="2" fill="#dc2626" />
              <text x="27" y="20" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">火柴盒</text>
            </g>
            <g transform="translate(85, 145)">
              <circle cx="15" cy="18" r="10" fill="#ca8a04" />
              <circle cx="40" cy="18" r="10" fill="#ca8a04" />
              <text x="28" y="22" fill="#fff" fontSize="8" textAnchor="middle">金幣糖</text>
            </g>

            {/* Wheels & Position label */}
            <circle cx="25" cy="204" r="5" fill="#1e293b" />
            <circle cx="125" cy="204" r="5" fill="#1e293b" />
            <text x="75" y="195" fill="#fef3c7" fontSize="8" textAnchor="middle" opacity="0.8">
              [滑軌雙面貨架 · 點擊移動]
            </text>
          </g>

          {/* ================= 4. CASH REGISTER COUNTER & LEVERS ================= */}
          <g
            transform="translate(230, 480)"
            className="cursor-pointer group"
            onClick={onOpenCashRegister}
            filter="url(#dropShadow)"
          >
            {/* Long Wooden Counter */}
            <rect x="0" y="0" width="220" height="95" rx="4" fill="#422513" stroke="#261307" strokeWidth="3" />
            <rect x="10" y="8" width="200" height="15" fill="#2d170a" />

            {/* Mechanical Cash Register (From design sheet: bronze body, keypad, pop drawer) */}
            <g transform="translate(20, -35)">
              <rect x="0" y="0" width="75" height="55" rx="4" fill="#71717a" stroke="#3f3f46" strokeWidth="2" />
              <rect x="8" y="8" width="59" height="16" fill="#18181b" />
              <text x="37" y="20" fill="#22c55e" fontSize="10" font-family="monospace" textAnchor="middle">
                NT$ 195.0
              </text>
              {/* Keypad */}
              {[28, 36, 44].map((ky, r) => (
                <g key={`rk-${r}`}>
                  {[12, 24, 36, 48, 60].map((kx, c) => (
                    <rect key={`k-${r}-${c}`} x={kx} y={ky} width="6" height="5" fill="#d4d4d8" />
                  ))}
                </g>
              ))}
            </g>

            {/* Cash Register Lever Mechanisms (Red Knobs) */}
            <g transform="translate(115, -28)">
              {/* Lever A: Secret Passage Trigger */}
              <g
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playLeverPull();
                  onToggleSecretPassage();
                }}
              >
                <rect x="0" y="15" width="22" height="25" fill="#18181b" rx="2" />
                <line
                  x1="11"
                  y1="25"
                  x2={shelfState.secretPassagePos === 'OPEN' ? 22 : 6}
                  y2={shelfState.secretPassagePos === 'OPEN' ? 5 : 0}
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle
                  cx={shelfState.secretPassagePos === 'OPEN' ? 22 : 6}
                  cy={shelfState.secretPassagePos === 'OPEN' ? 5 : 0}
                  r="7"
                  fill="#ef4444"
                  className={shelfState.secretPassagePos === 'OPEN' ? 'animate-pulse' : ''}
                />
                <text x="11" y="52" fill="#fca5a5" fontSize="7" textAnchor="middle">密道桿</text>
              </g>

              {/* Lever B: Window Shelf / Camouflage Trigger */}
              <g
                transform="translate(35, 0)"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playLeverPull();
                  onToggleCamouflage();
                }}
              >
                <rect x="0" y="15" width="22" height="25" fill="#18181b" rx="2" />
                <line
                  x1="11"
                  y1="25"
                  x2={shelfState.windowShelfCamouflage === 'CONTRABAND_EXPOSED' ? 22 : 6}
                  y2={shelfState.windowShelfCamouflage === 'CONTRABAND_EXPOSED' ? 5 : 0}
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle
                  cx={shelfState.windowShelfCamouflage === 'CONTRABAND_EXPOSED' ? 22 : 6}
                  cy={shelfState.windowShelfCamouflage === 'CONTRABAND_EXPOSED' ? 5 : 0}
                  r="7"
                  fill="#f59e0b"
                />
                <text x="11" y="52" fill="#fef08a" fontSize="7" textAnchor="middle">偽裝桿</text>
              </g>
            </g>

            {/* Money Box Drawer with 1950s Coins */}
            <g transform="translate(15, 32)">
              <rect x="0" y="0" width="180" height="36" fill="#1f1107" stroke="#6b4423" strokeWidth="1.5" />
              {/* Coin compartments */}
              {[10, 50, 90, 130].map((cx, i) => (
                <g key={`coinbox-${i}`}>
                  <rect x={cx} y="4" width="35" height="28" fill="#140b04" />
                  <circle cx={cx + 17} cy="18" r="9" fill={['#94a3b8', '#ca8a04', '#cbd5e1', '#b45309'][i]} opacity="0.9" />
                  <text x={cx + 17} cy="22" fill="#18181b" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {['1元', '5元', '10元', '50元'][i]}
                  </text>
                </g>
              ))}
            </g>
          </g>

          {/* ================= 5. STORE CLERK (PLAYER) ================= */}
          {/* Clerk positioned near counter/shelves (Styled as boss from sheet 2) */}
          <g transform="translate(320, 420)" filter="url(#dropShadow)">
            {/* Shadow */}
            <ellipse cx="15" cy="62" rx="18" ry="6" fill="#000" opacity="0.6" />

            {/* Legs (Blue Jeans from sheet 2) */}
            <rect x="8" y="34" width="7" height="26" fill="#2563eb" rx="2" />
            <rect x="18" y="34" width="7" height="26" fill="#2563eb" rx="2" />
            {/* Brown Leather Shoes */}
            <rect x="6" y="58" width="9" height="5" fill="#451a03" rx="1" />
            <rect x="18" y="58" width="9" height="5" fill="#451a03" rx="1" />

            {/* Torso: Short-sleeved White Shirt with pocket (From Sheet 2) */}
            <polygon points="5,15 28,15 30,34 3,34" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Chest Pocket */}
            <rect x="7" y="20" width="6" height="7" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
            {/* Brown Leather Belt */}
            <rect x="3" y="32" width="27" height="3" fill="#451a03" />
            <rect x="14" y="31" width="5" height="5" fill="#eab308" />

            {/* Arms & Hands */}
            <rect x="0" y="16" width="5" height="15" fill="#fbd38d" rx="2" />
            <rect x="28" y="16" width="5" height="15" fill="#fbd38d" rx="2" />
            {/* Wristwatch on left wrist */}
            <rect x="27" y="27" width="6" height="2" fill="#0f172a" />

            {/* Head & Hair (Middle-aged friendly clerk boss) */}
            <circle cx="16" cy="7" r="8" fill="#fbd38d" />
            {/* Black classic hair parted */}
            <path d="M8,5 Q16,-3 24,5 Q20,1 12,1 Z" fill="#0f172a" />
            {/* Eyes & Warm Smile */}
            <circle cx="13" cy="7" r="1" fill="#000" />
            <circle cx="19" cy="7" r="1" fill="#000" />
            <path d="M14,10 Q16,12 18,10" fill="none" stroke="#9a3412" strokeWidth="1" />

            {/* Held item indicator bubble */}
            {heldItem && (
              <g transform="translate(30, -10)" className="animate-bounce">
                <rect x="-4" y="-4" width="36" height="36" rx="6" fill="#18181b" stroke="#eab308" strokeWidth="2" />
                <text x="14" y="20" fontSize="18" textAnchor="middle">
                  {heldItem.icon}
                </text>
              </g>
            )}

            {/* Clerk Name Label */}
            <rect x="-8" y="68" width="48" height="14" rx="3" fill="#18181b" opacity="0.8" />
            <text x="16" y="78" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
              掌櫃 (店員)
            </text>
          </g>

          {/* ================= 6. CUSTOMERS IN STORE ================= */}
          {customers.map((customer, index) => {
            const isTarget = customer.request.isShelter || customer.request.itemId?.includes('banned') || customer.request.itemId?.includes('leaflet');
            const posX = customer.standingGrid.x * 5 + 460;
            const posY = customer.standingGrid.y * 3.5 + 260;
            const reqItem = customer.request.itemId ? GROCERY_ITEMS[customer.request.itemId] : null;

            return (
              <g
                key={customer.id}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer group"
                filter="url(#dropShadow)"
                onClick={() => {
                  if (customer.request.isShelter) {
                    onGuideCustomerToShelter(customer.id);
                  } else {
                    onFulfillCustomerItem(customer.id);
                  }
                }}
              >
                {/* Shadow */}
                <ellipse cx="14" cy="55" rx="16" ry="6" fill="#000" opacity="0.6" />

                {/* Character Sprite based on customer type */}
                {isTarget ? (
                  // Dissident Intellectual in Trench Coat & Fedora
                  <g>
                    {/* Dark Trench Coat */}
                    <polygon points="5,15 25,15 28,48 2,48" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                    <rect x="7" y="48" width="6" height="7" fill="#0f172a" />
                    <rect x="17" y="48" width="6" height="7" fill="#0f172a" />
                    {/* Leather Satchel carrying documents */}
                    <rect x="16" y="24" width="10" height="12" fill="#78350f" rx="1" />
                    <line x1="8" y1="18" x2="20" y2="30" stroke="#451a03" strokeWidth="1.5" />
                    {/* Head & Collar */}
                    <circle cx="15" cy="8" r="7" fill="#fbd38d" />
                    {/* Fedora Hat */}
                    <ellipse cx="15" cy="3" rx="12" ry="4" fill="#1e293b" />
                    <polygon points="7,2 23,2 20,-4 10,-4" fill="#0f172a" />
                  </g>
                ) : (
                  // Ordinary Citizen (Student or Housewife)
                  <g>
                    {/* Outfit */}
                    <polygon points="6,16 24,16 26,45 4,45" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                    <rect x="8" y="45" width="5" height="10" fill="#1e293b" />
                    <rect x="17" y="45" width="5" height="10" fill="#1e293b" />
                    {/* Head */}
                    <circle cx="15" cy="8" r="7" fill="#fed7aa" />
                    <path d="M8,6 Q15,-1 22,6 Q18,2 12,2 Z" fill="#18181b" />
                  </g>
                )}

                {/* Thought Bubble / Customer Demand Bubble */}
                <g transform="translate(-15, -45)">
                  {/* Bubble Container */}
                  <rect
                    x="0"
                    y="0"
                    width="62"
                    height="36"
                    rx="8"
                    fill={isTarget ? '#fef2f2' : '#ffffff'}
                    stroke={isTarget ? '#dc2626' : '#94a3b8'}
                    strokeWidth={isTarget ? 2 : 1.5}
                    className={isTarget ? 'animate-pulse' : ''}
                  />
                  {/* Tail of thought bubble */}
                  <polygon
                    points="24,36 32,36 28,42"
                    fill={isTarget ? '#fef2f2' : '#ffffff'}
                    stroke={isTarget ? '#dc2626' : '#94a3b8'}
                    strokeWidth="1"
                  />

                  {customer.request.isShelter ? (
                    // Emergency Shelter Request
                    <g transform="translate(6, 4)">
                      <text x="25" y="14" fill="#dc2626" fontSize="9" fontWeight="bold" textAnchor="middle">
                        🚨 緊急避難
                      </text>
                      <text x="25" y="26" fill="#991b1b" fontSize="8" textAnchor="middle">
                        [點擊入密道]
                      </text>
                    </g>
                  ) : reqItem ? (
                    // Regular or Contraband Item Request
                    <g transform="translate(6, 4)">
                      <text x="12" y="18" fontSize="16" textAnchor="middle">
                        {reqItem.icon}
                      </text>
                      <text
                        x="34"
                        y="14"
                        fill={reqItem.category === 'CONTRABAND' ? '#b91c1c' : '#1f2937'}
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {reqItem.name.slice(0, 3)}
                      </text>
                      <text x="34" y="24" fill="#6b7280" fontSize="7">
                        ${reqItem.price}元
                      </text>
                    </g>
                  ) : null}

                  {/* Patience gauge bar */}
                  <rect x="4" y="31" width="54" height="2" fill="#e5e7eb" rx="1" />
                  <rect
                    x="4"
                    y="31"
                    width={`${Math.max(0, (customer.patience / customer.maxPatience) * 54)}`}
                    height="2"
                    fill={customer.patience > 40 ? '#10b981' : '#ef4444'}
                    rx="1"
                  />
                </g>

                {/* Customer Name Tag */}
                <rect x="-5" y="60" width="40" height="13" rx="2" fill="#0f172a" opacity="0.85" />
                <text x="15" y="69" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">
                  {customer.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Quick Click Assist Overlay Banner */}
        <div className="absolute top-3 left-44 z-10 flex items-center gap-2 px-3 py-1 bg-[#1a1511]/85 backdrop-blur border border-[#4d3c2c] rounded text-xs text-[#dcd0bf] shadow">
          <span>💡 提示：</span>
          {shelfState.windowShelfPos === 'OPEN_AISLE' ? (
            <span className="text-[#f87171] font-semibold animate-pulse">
              大門視線敞開！若警察巡邏至店門將發現店內！請點擊貨架1阻擋視線。
            </span>
          ) : shelfState.secretPassagePos === 'CONCEALED' &&
            customers.some((c) => c.request.isShelter) ? (
            <span className="text-[#f59e0b] font-semibold">
              有敏感人士急需避難！請拉動密道桿開啟旋轉書櫃。
            </span>
          ) : (
            <span className="text-[#a89b88]">
              點擊貨架可滑動軌道；點擊顧客可進行取貨結帳或引導避難。
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
