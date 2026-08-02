import React from 'react'

interface WatermarkProps {
  text?: string
  opacity?: number
  size?: 'small' | 'medium' | 'large'
}

const Watermark: React.FC<WatermarkProps> = ({
  text = 'Industrial Safety Intelligence Platform',
  opacity = 0.08,
  size = 'large',
}) => {
  const sizeClass = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl',
  }[size]

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: 'transparent',
      }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center ${sizeClass} font-bold text-gray-400`}
        style={{
          opacity,
          transform: 'rotate(-45deg)',
          whiteSpace: 'nowrap',
          transformOrigin: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default Watermark
