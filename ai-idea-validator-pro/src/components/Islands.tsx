import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// Simple helper to generate some random floating islands
export const islands = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  position: [
    (Math.random() - 0.5) * 80,
    Math.random() * 20 - 5,
    (Math.random() - 0.5) * 80
  ] as [number, number, number],
  scale: [
    Math.random() * 10 + 5,
    Math.random() * 2 + 1,
    Math.random() * 10 + 5
  ] as [number, number, number]
}))

export function Islands() {
  return (
    <>
      {/* Starting Island */}
      <RigidBody type="fixed" colliders="hull" position={[0, -2, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[8, 5, 4, 8]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      </RigidBody>

      {/* Generated Islands */}
      {islands.map((island) => (
        <RigidBody key={island.id} type="fixed" colliders="hull" position={island.position}>
          <mesh receiveShadow>
            <cylinderGeometry args={[island.scale[0] / 2, island.scale[0] / 3, island.scale[1], 8]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          {/* Island bottom */}
          <mesh position={[0, -island.scale[1]/2 - 1, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[island.scale[0]/3, 2, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}
