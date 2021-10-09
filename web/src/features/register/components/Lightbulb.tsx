import React from 'react'

type LightbulbProps = {
  button?: boolean
  onClick?: () => void
  animate?: boolean
  wire?: boolean
  wireLength?: string
  glow?: boolean
  glowColor?: string
  glowBlur?: string
  glowSpread?: string
  bulbColor?: string
  numStrip?: number
  numZig?: number
  className?: string
  bulbClassName?: string
  style?: React.CSSProperties
}

export const Lightbulb: React.FC<LightbulbProps> = ({
  button = false,
  onClick,
  animate = false,
  wire = false,
  wireLength = '400px',
  glow = false,
  glowColor = '#ebd1a4',
  glowBlur = '300px',
  glowSpread = '77px',
  bulbColor = '#c5b98e',
  numStrip = 3,
  numZig = 3,
  className = '',
  bulbClassName = '',
  style
}) => {
  const boxShadow = glow ? `0px 0px ${glowBlur} ${glowSpread} ${glowColor}` : ''

  const innerLightbulb = (
    <>
      <div id='fixture' className='relative bg-true-gray-500 top-[1px] left-3 w-4 h-5'>
        {Array.from(Array(numStrip).keys()).map((v, i) => (
          <div key={`strip-${v}`} className='relative w-4 h-0.5 bg-true-gray-400' style={{ top: `${4 + i * 3}px` }} />
        ))}
      </div>
      <div
        id='bulb'
        className='relative w-10 h-10 rounded-[50%] transition duration-200 ease-in-out'
        style={{
          backgroundColor: bulbColor,
          boxShadow: boxShadow,
          WebkitBoxShadow: boxShadow
        }}
      >
        {Array.from(Array(numZig).keys()).map((v, i) => (
          <div
            key={`zig-${v}`}
            className='relative bg-transparent left-[15px] w-[10px] h-[5px] rounded-[2px] border border-black'
            style={{ top: `${0 + i * -3}px` }}
          />
        ))}
      </div>
    </>
  )

  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        height: wireLength,
        animation: animate ? 'swing 1s infinite ease-in-out alternate' : '',
        transformOrigin: 'top',
        WebkitTransformOrigin: 'top',
        MozTransformOrigin: 'top'
      }}
    >
      {wire && <div className='relative left-[17px] h-full w-1 bg-black' />}
      {button && onClick ? (
        <button className={`focus:outline-none ${bulbClassName}`} onClick={onClick}>
          {innerLightbulb}
        </button>
      ) : (
        <div className={`${bulbClassName}`}>{innerLightbulb}</div>
      )}
    </div>
  )
}
