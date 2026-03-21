import type { TangramPuzzleConfig } from '../types/game'

export const HARD_PUZZLE_CONFIGS: TangramPuzzleConfig[] = [
  {
    id: 1,
    title: '家をつくろう！',
    subtitle: 'ピースをくっつけて いえを つくってね！',
    canvasWidth: 320,
    canvasHeight: 290,
    outlinePath: 'M160,10 L310,140 L310,280 L10,280 L10,140 Z',
    slots: [
      { id: 'p1-roof', targetType: 'triangle', points: '160,10 310,140 10,140' },
      { id: 'p1-body', targetType: 'square', points: '10,140 310,140 310,280 10,280' },
    ],
  },
  {
    id: 2,
    title: '船をつくろう！',
    subtitle: 'ピースをくっつけて ふねを つくってね！',
    canvasWidth: 360,
    canvasHeight: 270,
    outlinePath: 'M230,10 L340,120 L340,205 L300,260 L60,260 L20,205 L20,120 Z',
    slots: [
      { id: 'p2-sail', targetType: 'triangle', points: '230,10 340,120 120,120' },
      { id: 'p2-hull', targetType: 'square', points: '20,120 340,120 340,205 20,205' },
      { id: 'p2-keel', targetType: 'parallelogram', points: '20,205 340,205 300,260 60,260' },
    ],
  },
  {
    id: 3,
    title: 'ロケットをつくろう！',
    subtitle: 'ピースをくっつけて ロケットを つくってね！',
    canvasWidth: 260,
    canvasHeight: 400,
    outlinePath: 'M130,10 L200,110 L220,195 L200,280 L200,390 L60,390 L60,280 L40,195 L60,110 Z',
    slots: [
      { id: 'p3-nose', targetType: 'triangle', points: '130,10 200,110 60,110' },
      { id: 'p3-body', targetType: 'hexagon', points: '60,110 200,110 220,195 200,280 60,280 40,195' },
      { id: 'p3-engine', targetType: 'square', points: '60,280 200,280 200,390 60,390' },
    ],
  },
  {
    id: 4,
    title: '矢印をつくろう！',
    subtitle: 'ピースをくっつけて やじるしを つくってね！',
    canvasWidth: 370,
    canvasHeight: 220,
    outlinePath: 'M10,80 L220,80 L220,15 L355,110 L220,205 L220,140 L10,140 Z',
    slots: [
      { id: 'p4-shaft', targetType: 'parallelogram', points: '10,80 220,80 220,140 10,140' },
      { id: 'p4-head', targetType: 'triangle', points: '220,15 355,110 220,205' },
    ],
  },
  {
    id: 5,
    title: 'タワーをつくろう！',
    subtitle: 'ピースをくっつけて タワーを つくってね！',
    canvasWidth: 280,
    canvasHeight: 460,
    outlinePath: 'M140,10 L210,90 L230,185 L210,275 L190,360 L190,445 L50,445 L50,360 L70,275 L50,185 L70,90 Z',
    slots: [
      { id: 'p5-spire', targetType: 'triangle', points: '140,10 210,90 70,90' },
      { id: 'p5-upper', targetType: 'hexagon', points: '70,90 210,90 230,185 210,275 70,275 50,185' },
      { id: 'p5-middle', targetType: 'parallelogram', points: '70,275 210,275 190,360 50,360' },
      { id: 'p5-base', targetType: 'square', points: '50,360 190,360 190,445 50,445' },
    ],
  },
]
