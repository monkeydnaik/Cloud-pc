import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { useKeyboardControls, Line } from '@react-three/drei'

const SPEED = 5
const JUMP_FORCE = 8
const GLIDE_FALL_SPEED = -2
const DASH_FORCE = 20
const DASH_COOLDOWN = 2 // seconds
const GRAPPLE_RANGE = 50
const GRAPPLE_FORCE = 25

export function Player() {
  const body = useRef<any>(null)
  const { rapier, world } = useRapier()
  const [, getKeys] = useKeyboardControls()
  const [isGliding, setIsGliding] = useState(false)
  const { camera } = useThree()

  // Dash state
  const [lastDashTime, setLastDashTime] = useState(0)

  // Grapple state
  const [grapplePoint, setGrapplePoint] = useState<THREE.Vector3 | null>(null)
  const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(new THREE.Vector3())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        const now = performance.now() / 1000
        if (now - lastDashTime >= DASH_COOLDOWN && body.current) {
          // Perform dash
          const direction = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
          direction.y = 0 // Keep dash horizontal
          direction.normalize().multiplyScalar(DASH_FORCE)

          body.current.applyImpulse({ x: direction.x, y: 0, z: direction.z }, true)
          setLastDashTime(now)
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0 || !body.current) return // Left click only

        const translation = body.current.translation()
        const rayOrigin = { x: translation.x, y: translation.y + 0.5, z: translation.z } // Offset slightly up to camera level

        // Raycast forward from camera
        const rayDir = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation).normalize()

        const ray = new rapier.Ray(rayOrigin, rayDir)
        const hit = world.castRay(ray, GRAPPLE_RANGE, true)

        if (hit && hit.timeOfImpact) {
            const hitPoint = new THREE.Vector3(
                rayOrigin.x + rayDir.x * hit.timeOfImpact,
                rayOrigin.y + rayDir.y * hit.timeOfImpact,
                rayOrigin.z + rayDir.z * hit.timeOfImpact
            )
            setGrapplePoint(hitPoint)
        } else if (hit && (hit as any).toi) {
            const hitPoint = new THREE.Vector3(
                rayOrigin.x + rayDir.x * (hit as any).toi,
                rayOrigin.y + rayDir.y * (hit as any).toi,
                rayOrigin.z + rayDir.z * (hit as any).toi
            )
            setGrapplePoint(hitPoint)
        }
    }

    const handleMouseUp = () => {
        setGrapplePoint(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('mousedown', handleMouseDown)
        window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [camera, lastDashTime, rapier, world])

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

    // Grapple logic
    if (grapplePoint) {
        const playerPos = new THREE.Vector3(translation.x, translation.y, translation.z)
        setPlayerPosition(playerPos)

        // Pull player toward grapple point
        const pullDirection = grapplePoint.clone().sub(playerPos).normalize().multiplyScalar(GRAPPLE_FORCE)

        // Override normal movement with grapple pull
        body.current.setLinvel({ x: pullDirection.x, y: pullDirection.y, z: pullDirection.z })
    } else {
        // Only set x/z velocity if we are pressing keys, to allow impulse (dash) to play out when not moving
        if (forward || backward || left || right) {
            body.current.setLinvel({ x: direction.x, y: nextVelY, z: direction.z })
        } else {
            // Apply friction when not pressing movement keys
            body.current.setLinvel({ x: velocity.x * 0.9, y: nextVelY, z: velocity.z * 0.9 })
        }
    }

    // Camera follow - First person implementation to work with PointerLockControls
    state.camera.position.set(translation.x, translation.y + 0.5, translation.z)
    // We REMOVE state.camera.lookAt() so PointerLockControls handles rotation instead.
  })

  return (
    <>
        <RigidBody name="player" ref={body} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]} linearDamping={1}>
        <CapsuleCollider args={[0.75, 0.5]} />
        {/* We remove the mesh since it's First Person and we don't want the camera clipping inside the capsule */}
        {/* Visual Glider */}
        {isGliding && (
            <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3, 1]} />
                <meshStandardMaterial color="white" side={THREE.DoubleSide} />
            </mesh>
        )}
        </RigidBody>

        {/* Grapple Line */}
        {grapplePoint && (
            <Line
                points={[playerPosition, grapplePoint]}
                color="white"
                lineWidth={2}
            />
        )}
    </>
  )
}
