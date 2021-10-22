import { extend, ReactThreeFiber } from 'react-three-fiber'
import { WaveShaderMaterial } from '@/pages/opening/index.page'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader'

extend({ WaveShaderMaterial, BloomPass, GlitchPass })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveShaderMaterial: ReactThreeFiber.Object3DNode<WaveShaderMaterial, typeof WaveShaderMaterial>
      bloomPass: ReactThreeFiber.Object3DNode<BloomPass, typeof BloomPass>
      glitchPass: ReactThreeFiber.Object3DNode<GlitchPass, typeof GlitchPass>
    }
  }
}
declare module 'three-stdlib' {
  export interface GLTF extends GLTFThree {
    nodes: Record<string, Mesh>
    materials: Record<string, Material>
  }
}
