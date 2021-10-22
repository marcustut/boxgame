import { useGLTF } from '@react-three/drei'
import React from 'react'

export const Lightbulb: React.FC = () => {
  const { scene } = useGLTF('/models/lightbulb.glb')

  return (
    <group rotation={[1.5, 1.5, 0]} position={[0, 0, 0]}>
      <primitive object={scene} scale={[0.1, 0.1, 0.1]} />
      <pointLight intensity={0.5} color='white' />
    </group>
  )
}
