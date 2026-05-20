import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { useKeyboardControls } from '@react-three/drei'

const SPEED = 5
const JUMP_FORCE = 8
const GLIDE_FALL_SPEED = -2

export function Player() {
  const body = useRef<any>(null)
  const { rapier, world } = useRapier()
  const [, getKeys] = useKeyboardControls()
  const [isGliding, setIsGliding] = useState(false)

  useFrame((state, delta) => {
    if (!body.current) return

    const { forward, backward, left, right, jump } = getKeys()

    const velocity = body.current.linvel()

    // Movement direction based on camera
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward))
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0)

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)

    // Raycast to check if grounded
    const translation = body.current.translation()
    const rayOrigin = { x: translation.x, y: translation.y - 0.8, z: translation.z }
    const rayDir = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(rayOrigin, rayDir)
    const maxToi = 0.5
    const solid = true
    const hit = world.castRay(ray, maxToi, solid)
    const isGrounded = hit !== null

    let nextVelY = velocity.y

    // Jump logic
    if (jump && isGrounded) {
      nextVelY = JUMP_FORCE
    }

    // Glide logic
    if (jump && !isGrounded && velocity.y < 0) {
        setIsGliding(true)
        nextVelY = Math.max(velocity.y, GLIDE_FALL_SPEED)
    } else {
        setIsGliding(false)
    }

    body.current.setLinvel({ x: direction.x, y: nextVelY, z: direction.z })

    // Camera follow
    state.camera.position.set(translation.x, translation.y + 2, translation.z + 5)
    state.camera.lookAt(translation.x, translation.y, translation.z)
  })

  return (
    <RigidBody ref={body} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[0.75, 0.5]} />
      <mesh>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color={isGliding ? "cyan" : "hotpink"} />
      </mesh>
      {/* Visual Glider */}
      {isGliding && (
          <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3, 1]} />
              <meshStandardMaterial color="white" side={THREE.DoubleSide} />
          </mesh>
      )}
    </RigidBody>
  )
}
