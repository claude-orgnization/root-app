export type Bridge = {
  row: number
  leftCol: number
}

export type AmidaConfig = {
  numLines: number
  numRows: number
  bridges: Bridge[]
  topLabels: string[]
  bottomLabels: string[]
}

export type PathPoint = {
  x: number
  y: number
}
