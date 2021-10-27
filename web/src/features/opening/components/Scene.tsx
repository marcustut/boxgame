import { Effects, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useState } from 'react'

import { Floor, Lightbulb, TV, WaveVideo } from '@/features/opening'
import { getRandomInt } from '@/utils'

export const Scene: React.FC = () => {
  return (
    <Canvas camera={{ fov: 60 }}>
      <Effects>
        {/* <bloomPass attachArray='passes' /> */}
        {/* <glitchPass attachArray='passes' /> */}
      </Effects>

      <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={0} />

      <fog attach='fog' args={['black', 1, 7]} />
      <directionalLight intensity={0.05} />
      <pointLight castShadow intensity={0.5} color='#FFF300' />

      <pointLight position={[0, 0, -50]} />

      <Suspense fallback={null}>
        {/* <WaveVideo /> */}
        {/* <TV /> */}
        <Lightbulb />
        <Floor />
      </Suspense>
    </Canvas>
  )
}
