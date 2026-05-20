import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { BallCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function Enemies({ islands }: { islands: any[] }) {
  // Spawn a few enemies on random islands
  const initialEnemies = islands.slice(0, 5).map((island, i) => ({
    id: i,
    position: [island.position[0] + 2, island.position[1] + 2, island.position[2] + 2] as [number, number, number],
  }))

  return (
    <>
      {initialEnemies.map((enemy) => (
        <Enemy key={enemy.id} position={enemy.position} />
      ))}
    </>
  )
}

function Enemy({ position }: { position: [number, number, number] }) {
  const bodyRef = useRef<any>(null)
  const addScore = useGameStore((state) => state.addScore)

  useFrame((state) => {
    if (bodyRef.current) {
        // Move back and forth
        const time = state.clock.elapsedTime
        const offsetX = Math.sin(time * 2) * 2
        bodyRef.current.setNextKinematicTranslation({
            x: position[0] + offsetX,
            y: position[1],
            z: position[2]
        })
    }
  })

  const handleCollide = (e: any) => {
      // Very basic way to check if it's the player colliding (we don't have tags set up, but the player is a dynamic capsule)
      if (e.other.rigidBodyObject?.name === "player") {
          addScore(-5)
      }
  }

  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false} position={position} onCollisionEnter={handleCollide}>
      <BallCollider args={[1]} />
      <mesh>
        <sphereGeometry args={[1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  )
}
