import { extend, ReactThreeFiber } from 'react-three-fiber'
import { WaveShaderMaterial } from '@/pages/opening/index.page'

extend({ WaveShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveShaderMaterial: ReactThreeFiber.Object3DNode<WaveShaderMaterial, typeof WaveShaderMaterial>
    }
  }
}
