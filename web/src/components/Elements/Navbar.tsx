import React from 'react'

type NavbarProps = {
  logoSrc?: string
  logoAlt?: string
  title?: string
  leftRender?: (logoSrc: string, logoAlt: string, title: string) => React.ReactElement
  rightRender?: () => React.ReactElement
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({
  logoSrc = '/TheBoxColoredLogo.png',
  logoAlt = 'TheBoxColoredLogo',
  title = '格子游戏',
  leftRender,
  rightRender,
  className = ''
}) => {
  return (
    <div className={`fixed container flex items-center backdrop-filter backdrop-blur-md ${className}`}>
      {leftRender ? (
        leftRender(logoSrc, logoAlt, title)
      ) : (
        <button className='flex items-center font-bold' onClick={() => (window.location.href = '/app')}>
          <img src={logoSrc} alt={logoAlt} className='w-10 filter grayscale-20 object-fit mr-1' />
          {title}
        </button>
      )}

      {rightRender ? rightRender() : <div className='ml-auto'>Right side</div>}
    </div>
  )
}
