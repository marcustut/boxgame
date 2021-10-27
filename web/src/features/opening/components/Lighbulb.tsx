import { useGLTF } from '@react-three/drei'
import React from 'react'

type LightbulbProps = {
  position?: [number, number, number]
}

export const Lightbulb: React.FC<LightbulbProps> = ({ position = [0, 0, 0] }) => {
  const { scene } = useGLTF('/models/lightbulb.glb')

  return (
    <group rotation={[1.5, 1.5, 0]} position={position}>
      <primitive object={scene} scale={[0.1, 0.1, 0.1]} />
      <pointLight intensity={0.5} color='white' />
    </group>
  )
}
