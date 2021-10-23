import React, { useRef, useState } from 'react'
import { useEffectOnce } from 'react-use'
import '@/features/login/styles/styles.css'

export const SmokeBackground: React.FC = ({ children }) => {
  const [imageUrl] = useState<string>('http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png')
  const [smokeDensity] = useState<number>(100)
  const [smokeLife] = useState<number>(10000)
  const [smokes, setSmokes] = useState<HTMLDivElement[]>([])
  const [_smokeGeneratorTimer, setSmokeGeneratorTimer] = useState<unknown | undefined>()
  const backgroundRef = useRef<HTMLDivElement>(null)
  const smokeRef = useRef<HTMLDivElement>(null)

  function loadImage() {
    return new Promise((resolve, reject) => {
      let Img = new Image()
      Img.src = imageUrl
      Img.onload = resolve
      Img.onerror = reject
    })
  }

  function smokeGenerator(smokeDensity: number) {
    if (!smokeRef.current || !backgroundRef.current) return

    for (let i = 0; i < smokeDensity; i++) {
      const smokeClone = smokeRef.current.cloneNode() as HTMLDivElement
      smokeClone.style.left = getRandomInt(0, 100) + '%'
      const delay = getRandomInt(0, smokeLife)
      smokeClone.style.animationDelay = delay + 'ms'
      smokeClone.style.animationDuration = smokeLife + 'ms'
      backgroundRef.current.appendChild(smokeClone)
      setSmokes([...smokes, smokeClone])
      // removeSmoke(smokeClone, delay);
    }
  }

  function smokeEater() {
    for (var index = 0; index < smokes.length; index++) {
      if (smokes[index].offsetTop < 0) {
        smokes[index].remove()
        smokes.splice(index, 0)
      }
    }
    window.requestAnimationFrame(smokeEater)
  }

  function smokeSwitch() {
    setSmokeGeneratorTimer(
      setInterval(() => {
        smokeGenerator(getRandomInt(1, smokeDensity))
      }, smokeLife)
    )
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  useEffectOnce(() => {
    console.info('Page loaded')
    loadImage().then(() => {
      console.info('Image Loaded')
      smokeSwitch()
      smokeEater()
    })
  })

  return (
    <div id='background' ref={backgroundRef}>
      <div className='smoke' ref={smokeRef} />
      {children}
    </div>
  )
}
