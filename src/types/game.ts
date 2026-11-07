/**
 * Game definitions for 《暗巷裡的奇幻雜貨店》 (Dark Alley Grocery Store)
 * 1950-1960 White Terror Taiwan Retro Grocery & Mechanical Shelter.
 */

export type ItemId =
  | 'soap'
  | 'soda'
  | 'match'
  | 'can'
  | 'flour'
  | 'candy'
  | 'banned_book'
  | 'leaflet'
  | 'manuscript'
  | 'radio_part';

export interface GroceryItem {
  id: ItemId;
  name: string;
  category: 'REGULAR' | 'CONTRABAND';
  price: number; // in 1950s TWD
  icon: string;
  description: string;
  tag: string;
}

export type CustomerType = 'CITIZEN_HOUSEWIFE' | 'CITIZEN_STUDENT' | 'CITIZEN_WORKER' | 'DISSIDENT_WRITER' | 'DISSIDENT_STUDENT' | 'DISSIDENT_PRINTER';

export interface CustomerRequest {
  itemId?: ItemId;
  isShelterRequest: boolean; // Needs to escape to underground secret basement
  isShelter: boolean;
  fulfilled: boolean;
}

export interface Customer {
  id: string;
  name: string;
  role: CustomerType;
  title: string;
  avatar: string;
  dialogue: string;
  urgency: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  request: CustomerRequest;
  patience: number; // 0 to 100
  maxPatience: number;
  standingGrid: { x: number; y: number };
  status: 'ENTERING' | 'WAITING' | 'RECEIVING' | 'ESCAPING_BASEMENT' | 'LEAVING' | 'ARRESTED';
  isUndergroundSafe?: boolean;
}

export type PoliceState = 'PATROLLING' | 'PEEKING' | 'RAID_INSPECTING' | 'PASSING_BY';

export interface PolicePatrol {
  distance: number; // 0 (at shop front) to 100 (far alley)
  state: PoliceState;
  stateTimer: number; // countdown in seconds
  alertness: number; // how sharply they scan
  facingDirection: 'LEFT' | 'FRONT_WINDOW' | 'RIGHT';
  flashlightActive: boolean;
}

export interface ShelfState {
  // Shelf 1 (Front / Window side): can slide to block door/window LOS
  windowShelfPos: 'BLOCK_WINDOW' | 'OPEN_AISLE';
  windowShelfCamouflage: 'NORMAL_GOODS' | 'CONTRABAND_EXPOSED';

  // Shelf 2 (Central main floor): can slide Left/Right to conceal customers
  centerShelfPos: 'LEFT' | 'RIGHT';

  // Shelf 3 (Rear secret bookcase): slides to uncover the basement hatch
  secretPassagePos: 'CONCEALED' | 'OPEN';
}

export type GameStatus = 'TITLE' | 'PLAYING' | 'PAUSED' | 'DAY_SUMMARY' | 'GAME_OVER' | 'VICTORY';

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  regularServed: number;
  contrabandDelivered: number;
  dissidentsSheltered: number;
  inspectionsEvaded: number;
  moneyEarned: number;
  currentDay: number;
  suspicion: number; // 0 to 100%
  satisfactionStars: number; // 1 to 5
}

export interface DayConfig {
  day: number;
  yearTitle: string;
  subTitle: string;
  durationSeconds: number;
  policeSpeed: number;
  policePeekFrequency: number;
  contrabandChance: number;
  shelterChance: number;
  historicalContext: string;
}
