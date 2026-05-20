import { Canvas } from '@react-three/fiber'
import { Sky, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Player } from './components/Player'
import { Islands, islands } from './components/Islands'
import { Crystals } from './components/Crystals'
import { UI } from './components/UI'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
]

export default function App() {
  return (
    <>
      <UI />
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ fov: 45 }}>
          <Sky sunPosition={[100, 20, 100]} turbidity={1} rayleigh={0.1} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

          <Physics gravity={[0, -9.81, 0]}>
            <Player />
            <Islands />
            <Crystals islands={islands} />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </>
  )
}
