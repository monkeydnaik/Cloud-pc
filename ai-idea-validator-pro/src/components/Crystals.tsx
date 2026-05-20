import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function Crystals({ islands }: { islands: any[] }) {
  // Generate one crystal above each island
  const initialCrystals = islands.map((island, i) => ({
    id: i,
    position: [island.position[0], island.position[1] + 2, island.position[2]] as [number, number, number],
  }))

  const [crystals, setCrystals] = useState(initialCrystals)
  const addScore = useGameStore((state) => state.addScore)

  const handleCollect = (id: number) => {
    setCrystals((prev) => prev.filter((c) => c.id !== id))
    addScore(10)
  }

  return (
    <>
      {crystals.map((crystal) => (
        <Crystal key={crystal.id} position={crystal.position} onCollect={() => handleCollect(crystal.id)} />
      ))}
    </>
  )
}

function Crystal({ position, onCollect }: { position: [number, number, number]; onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <RigidBody type="fixed" colliders={false} position={position} sensor onIntersectionEnter={onCollect}>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
      </mesh>
    </RigidBody>
  )
}
