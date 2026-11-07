export interface GridCoord {
  x: number;
  y: number;
}

export interface Crate {
  id: string;
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  levelNumberStr: string; // e.g. "01", "02", "03"
  title: string;
  subtitle: string;
  initialTime: number; // in seconds
  initialCoins: number;
  regularTarget: number;
  regularInitialDone: number;
  mysteriousTarget: number;
  mysteriousInitialDone: number;
  gridWidth: number; // e.g. 11
  gridHeight: number; // e.g. 7
  counterPos: GridCoord;
  backDoorPos: GridCoord;
  regularStartPos: GridCoord;
  mysteriousStartPos: GridCoord;
  crates: Crate[];
  fixedObstacles: GridCoord[];
  policePatrols: {
    id: string;
    path: GridCoord[];
    speed: number;
    visionAngle: 'RIGHT' | 'UP' | 'LEFT' | 'DOWN';
  }[];
}

export const DADAOCHENG_LEVELS: LevelConfig[] = [
  {
    id: 1,
    levelNumberStr: '01',
    title: '初識大稻埕',
    subtitle: '永樂町街坊初營運',
    initialTime: 180,
    initialCoins: 120,
    regularTarget: 2,
    regularInitialDone: 0,
    mysteriousTarget: 1,
    mysteriousInitialDone: 0,
    gridWidth: 10,
    gridHeight: 7,
    counterPos: { x: 7, y: 1 },
    backDoorPos: { x: 9, y: 5 },
    regularStartPos: { x: 3, y: 4 },
    mysteriousStartPos: { x: 4, y: 5 },
    crates: [
      { id: 'c1', x: 5, y: 2 },
      { id: 'c2', x: 5, y: 4 },
      { id: 'c3', x: 7, y: 4 },
    ],
    fixedObstacles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
      { x: 1, y: 3 }, { x: 1, y: 4 }, // Tea table
      { x: 3, y: 1 }, // Rice sacks
      { x: 7, y: 2 }, // Counter side
    ],
    policePatrols: [
      {
        id: 'p1',
        path: [
          { x: 1, y: 8 },
          { x: 5, y: 8 },
          { x: 8, y: 8 },
          { x: 5, y: 8 },
        ],
        speed: 1,
        visionAngle: 'RIGHT',
      },
    ],
  },
  {
    id: 2,
    levelNumberStr: '02',
    title: '茶米南北貨',
    subtitle: '警總宵禁‧雙線排程',
    initialTime: 165,
    initialCoins: 210,
    regularTarget: 3,
    regularInitialDone: 1,
    mysteriousTarget: 1,
    mysteriousInitialDone: 0,
    gridWidth: 10,
    gridHeight: 7,
    counterPos: { x: 7, y: 1 },
    backDoorPos: { x: 9, y: 5 },
    regularStartPos: { x: 3, y: 3 },
    mysteriousStartPos: { x: 5, y: 5 },
    crates: [
      { id: 'c1', x: 2, y: 2 },
      { id: 'c2', x: 4, y: 2 },
      { id: 'c3', x: 4, y: 4 },
      { id: 'c4', x: 6, y: 3 },
      { id: 'c5', x: 6, y: 5 },
    ],
    fixedObstacles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
      { x: 1, y: 4 }, { x: 1, y: 5 },
      { x: 3, y: 1 },
      { x: 7, y: 2 },
    ],
    policePatrols: [
      {
        id: 'p1',
        path: [
          { x: 0, y: 8 },
          { x: 4, y: 8 },
          { x: 7, y: 8 },
        ],
        speed: 1.2,
        visionAngle: 'RIGHT',
      },
      {
        id: 'p2',
        path: [
          { x: 10, y: 7 },
          { x: 10, y: 4 },
          { x: 10, y: 2 },
        ],
        speed: 1.1,
        visionAngle: 'UP',
      },
    ],
  },
  {
    id: 3,
    levelNumberStr: '03', // Matches the image screenshot perfectly!
    title: '暗度陳倉',
    subtitle: '大稻埕避難所‧全線警戒',
    initialTime: 165, // 02:45
    initialCoins: 320, // 320 from image!
    regularTarget: 3,
    regularInitialDone: 2, // 2/3 from image!
    mysteriousTarget: 1,
    mysteriousInitialDone: 0, // 0/1 from image!
    gridWidth: 10,
    gridHeight: 7,
    counterPos: { x: 7, y: 1 },
    backDoorPos: { x: 9, y: 5 },
    regularStartPos: { x: 5, y: 2 }, // customer with basket at (5, 2)
    mysteriousStartPos: { x: 6, y: 5 }, // customer in trench coat with purple box at (6, 5)
    crates: [
      { id: 'c1', x: 2, y: 1 },
      { id: 'c2', x: 4, y: 1 },
      { id: 'c3', x: 4, y: 3 }, // Selected crate in image!
      { id: 'c4', x: 7, y: 3 },
      { id: 'c5', x: 5, y: 5 },
    ],
    fixedObstacles: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
      { x: 1, y: 4 }, { x: 1, y: 5 }, // Tea table & teaware
      { x: 7, y: 2 }, // Counter stool / display
      { x: 3, y: 5 }, // Herbal sack
    ],
    policePatrols: [
      {
        id: 'p1',
        path: [
          { x: 1, y: 8 },
          { x: 3, y: 8 },
          { x: 6, y: 8 },
        ],
        speed: 1.2,
        visionAngle: 'RIGHT',
      },
      {
        id: 'p2',
        path: [
          { x: 7, y: 8 },
          { x: 9, y: 8 },
          { x: 10, y: 6 },
          { x: 10, y: 3 },
          { x: 10, y: 1 },
        ],
        speed: 1.3,
        visionAngle: 'UP',
      },
    ],
  },
];
