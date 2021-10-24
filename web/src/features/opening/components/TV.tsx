import { useGLTF } from '@react-three/drei'
import React, { useState } from 'react'

import url from '/video/TheBoxLogo_Opening.mp4'

import { useEvent } from 'react-use'
import * as THREE from 'three'

export const TV: React.FC = () => {
  const [videoPlayed, setVideoPlayed] = useState<boolean>(false)
  const { nodes } = useGLTF('/models/tv.gltf')

  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.src = url
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.volume = 0.4
    return vid
  })

  useEvent('click', () => {
    if (!videoPlayed) {
      video.play()
      setVideoPlayed(true)
    }
  })

  return (
    <group rotation={[Math.PI / 8, Math.PI * 1.2, 0]}>
      <mesh geometry={nodes.TV.geometry}>
        <meshStandardMaterial color='white' />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 1.1]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshStandardMaterial emissive={new THREE.Color('white')} side={THREE.DoubleSide}>
          <videoTexture attach='map' args={[video]} />
          <videoTexture attach='emissiveMap' args={[video]} />
        </meshStandardMaterial>
      </mesh>
    </group>
  )
}
