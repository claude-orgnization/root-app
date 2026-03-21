import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ShapeSVG } from './ShapeSVG'

describe('ShapeSVG', () => {
  it('renders an SVG element', () => {
    const { container } = render(<ShapeSVG type="circle" color="#FF6B6B" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('uses default size of 80', () => {
    const { container } = render(<ShapeSVG type="circle" color="#FF6B6B" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '80')
  })

  it('accepts custom size', () => {
    const { container } = render(
      <ShapeSVG type="circle" color="#FF6B6B" size={120} />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '120')
  })

  it('renders a circle shape', () => {
    const { container } = render(<ShapeSVG type="circle" color="#FF6B6B" />)
    expect(container.querySelector('circle')).toBeInTheDocument()
  })

  it('renders a triangle shape', () => {
    const { container } = render(<ShapeSVG type="triangle" color="#4ECDC4" />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
  })

  it('renders a square shape', () => {
    const { container } = render(<ShapeSVG type="square" color="#45B7D1" />)
    expect(container.querySelector('rect')).toBeInTheDocument()
  })

  it('renders a star shape', () => {
    const { container } = render(<ShapeSVG type="star" color="#FFA726" />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
  })

  it('renders a heart shape', () => {
    const { container } = render(<ShapeSVG type="heart" color="#EC407A" />)
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('renders a pentagon shape', () => {
    const { container } = render(<ShapeSVG type="pentagon" color="#66BB6A" />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
  })

  it('renders a hexagon shape', () => {
    const { container } = render(<ShapeSVG type="hexagon" color="#AB47BC" />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
  })

  it('applies the color to the shape element', () => {
    const { container } = render(<ShapeSVG type="circle" color="#FF6B6B" />)
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', '#FF6B6B')
  })

  it('is hidden from accessibility tree (decorative)', () => {
    const { container } = render(<ShapeSVG type="circle" color="#FF6B6B" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
