import type { ShapeType } from '../types/game'

interface ShapeSVGProps {
  type: ShapeType
  color: string
  size?: number
}

export function ShapeSVG({ type, color, size = 80 }: ShapeSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {renderShape(type, color)}
    </svg>
  )
}

function renderShape(type: ShapeType, color: string) {
  switch (type) {
    case 'circle':
      return <circle cx="50" cy="50" r="45" fill={color} />
    case 'triangle':
      return <polygon points="50,5 95,90 5,90" fill={color} />
    case 'square':
      return <rect x="5" y="5" width="90" height="90" rx="8" fill={color} />
    case 'star':
      return (
        <polygon
          points="50,5 60.58,35.44 92.79,36.09 67.12,55.56 76.45,86.41 50,68 23.55,86.41 32.88,55.56 7.21,36.09 39.42,35.44"
          fill={color}
        />
      )
    case 'heart':
      return (
        <path
          d="M50,75 C25,55 5,45 5,30 C5,17 15,10 25,10 C35,10 45,17 50,28 C55,17 65,10 75,10 C85,10 95,17 95,30 C95,45 75,55 50,75 Z"
          fill={color}
        />
      )
    case 'pentagon':
      return (
        <polygon
          points="50,5 92.79,36.09 76.45,86.41 23.55,86.41 7.21,36.09"
          fill={color}
        />
      )
    case 'hexagon':
      return (
        <polygon
          points="50,5 88.97,27.5 88.97,72.5 50,95 11.03,72.5 11.03,27.5"
          fill={color}
        />
      )
    case 'parallelogram':
      return <polygon points="5,80 80,80 95,20 20,20" fill={color} />
  }
}
