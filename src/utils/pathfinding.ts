import { GridCoord } from '../data/dadaochengLevels';

export function findPath(
  start: GridCoord,
  goal: GridCoord,
  width: number,
  height: number,
  blockedCoords: GridCoord[]
): GridCoord[] | null {
  // If start is goal
  if (start.x === goal.x && start.y === goal.y) {
    return [start];
  }

  const blockedSet = new Set<string>();
  blockedCoords.forEach((c) => blockedSet.add(`${c.x},${c.y}`));
  // Ensure start and goal are considered accessible
  blockedSet.delete(`${start.x},${start.y}`);
  blockedSet.delete(`${goal.x},${goal.y}`);

  const queue: { coord: GridCoord; path: GridCoord[] }[] = [
    { coord: start, path: [start] },
  ];
  const visited = new Set<string>([`${start.x},${start.y}`]);

  const directions = [
    { x: 0, y: -1 }, // UP
    { x: 1, y: 0 },  // RIGHT
    { x: 0, y: 1 },  // DOWN
    { x: -1, y: 0 }, // LEFT
  ];

  while (queue.length > 0) {
    const { coord, path } = queue.shift()!;

    if (coord.x === goal.x && coord.y === goal.y) {
      return path;
    }

    for (const dir of directions) {
      const nextX = coord.x + dir.x;
      const nextY = coord.y + dir.y;
      const key = `${nextX},${nextY}`;

      if (
        nextX >= 0 &&
        nextX < width &&
        nextY >= 0 &&
        nextY < height &&
        !visited.has(key) &&
        !blockedSet.has(key)
      ) {
        visited.add(key);
        queue.push({
          coord: { x: nextX, y: nextY },
          path: [...path, { x: nextX, y: nextY }],
        });
      }
    }
  }

  return null; // No path found
}
