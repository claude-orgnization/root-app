import type { HardPuzzleConfig } from '../types/game'

export const HARD_PUZZLE_CONFIGS: HardPuzzleConfig[] = [
  {
    id: 1,
    title: '家をつくろう！',
    subtitle: 'さんかく ＋ しかく',
    canvasWidth: 300,
    canvasHeight: 295,
    slots: [
      { id: 'p1-roof', targetType: 'triangle', x: 25, y: 10, width: 250, height: 120 },
      { id: 'p1-body', targetType: 'square', x: 45, y: 130, width: 210, height: 155 },
    ],
  },
  {
    id: 2,
    title: '船をつくろう！',
    subtitle: 'さんかく ＋ しかく ＋ へいこうしへんけい',
    canvasWidth: 320,
    canvasHeight: 285,
    slots: [
      { id: 'p2-sail', targetType: 'triangle', x: 130, y: 10, width: 130, height: 120 },
      { id: 'p2-hull', targetType: 'square', x: 20, y: 130, width: 280, height: 90 },
      { id: 'p2-keel', targetType: 'parallelogram', x: 60, y: 220, width: 200, height: 55 },
    ],
  },
  {
    id: 3,
    title: 'ロケットをつくろう！',
    subtitle: 'さんかく ＋ ろっかっけい ＋ しかく',
    canvasWidth: 260,
    canvasHeight: 430,
    slots: [
      { id: 'p3-nose', targetType: 'triangle', x: 60, y: 10, width: 140, height: 120 },
      { id: 'p3-body', targetType: 'hexagon', x: 33, y: 130, width: 194, height: 190 },
      { id: 'p3-engine', targetType: 'square', x: 80, y: 320, width: 100, height: 100 },
    ],
  },
  {
    id: 4,
    title: '矢印をつくろう！',
    subtitle: 'へいこうしへんけい ＋ さんかく',
    canvasWidth: 330,
    canvasHeight: 230,
    slots: [
      { id: 'p4-shaft', targetType: 'parallelogram', x: 10, y: 65, width: 195, height: 90 },
      { id: 'p4-head', targetType: 'triangle', x: 205, y: 30, width: 110, height: 160 },
    ],
  },
  {
    id: 5,
    title: 'タワーをつくろう！',
    subtitle: 'さんかく ＋ ごかっけい ＋ へいこうしへんけい ＋ しかく',
    canvasWidth: 280,
    canvasHeight: 440,
    slots: [
      { id: 'p5-spire', targetType: 'triangle', x: 90, y: 10, width: 100, height: 100 },
      { id: 'p5-upper', targetType: 'pentagon', x: 68, y: 110, width: 144, height: 105 },
      { id: 'p5-middle', targetType: 'parallelogram', x: 45, y: 215, width: 190, height: 90 },
      { id: 'p5-base', targetType: 'square', x: 50, y: 305, width: 180, height: 125 },
    ],
  },
]
