import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Worker3DProps {
  isMonitoring: boolean
  alertLevel: 'normal' | 'warning' | 'critical'
}

export default function Worker3D({ isMonitoring, alertLevel }: Worker3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const workerRef = useRef<THREE.Group | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f4f8)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowShadowMap
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Create Worker
    const worker = new THREE.Group()
    workerRef.current = worker
    scene.add(worker)

    // Body (Orange suit)
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      metalness: 0.3,
      roughness: 0.6
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.2
    body.castShadow = true
    body.receiveShadow = true
    worker.add(body)

    // Reflective Stripes (Chest)
    const stripeGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.05)
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x00ff00,
      emissiveIntensity: 0.3
    })
    const chestStripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
    chestStripe.position.set(0, 0.6, 0.31)
    worker.add(chestStripe)

    // Reflective Stripes (Legs)
    const legStripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
    legStripe.position.set(0, -0.4, 0.31)
    worker.add(legStripe)

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32)
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      metalness: 0.1,
      roughness: 0.8
    })
    const head = new THREE.Mesh(headGeometry, skinMaterial)
    head.position.y = 1.3
    head.castShadow = true
    head.receiveShadow = true
    worker.add(head)

    // Beard
    const beardGeometry = new THREE.BoxGeometry(0.22, 0.12, 0.08)
    const beardMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6914 })
    const beard = new THREE.Mesh(beardGeometry, beardMaterial)
    beard.position.set(0, 1.15, 0.2)
    worker.add(beard)

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0,
      roughness: 0.2
    })
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.1, 1.35, 0.24)
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.1, 1.35, 0.24)
    worker.add(leftEye)
    worker.add(rightEye)

    // Safety Helmet (Yellow)
    const helmetGeometry = new THREE.SphereGeometry(0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6)
    const helmetMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdd00,
      metalness: 0.6,
      roughness: 0.3
    })
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial)
    helmet.position.y = 1.45
    helmet.castShadow = true
    helmet.receiveShadow = true
    worker.add(helmet)

    // Helmet Brim
    const brimGeometry = new THREE.TorusGeometry(0.32, 0.04, 8, 32)
    const brim = new THREE.Mesh(brimGeometry, helmetMaterial)
    brim.position.set(0, 1.3, 0)
    brim.rotation.x = Math.PI * 0.3
    worker.add(brim)

    // Left Arm
    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 8, 16)
    const armMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      metalness: 0.3,
      roughness: 0.6
    })
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.5, 0.7, 0)
    leftArm.rotation.z = Math.PI * 0.3
    leftArm.castShadow = true
    worker.add(leftArm)

    // Right Arm (holding tablet)
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.5, 0.7, 0)
    rightArm.rotation.z = -Math.PI * 0.3
    rightArm.castShadow = true
    worker.add(rightArm)

    // Tablet
    const tabletGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.08)
    const tabletMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1
    })
    const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial)
    tablet.position.set(0.65, 0.4, 0.2)
    tablet.rotation.z = Math.PI * 0.2
    tablet.castShadow = true
    worker.add(tablet)

    // Tablet Screen
    const screenGeometry = new THREE.BoxGeometry(0.35, 0.55, 0.02)
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x4da6ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0066ff,
      emissiveIntensity: 0.2
    })
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.set(0.65, 0.4, 0.12)
    screen.rotation.z = Math.PI * 0.2
    worker.add(screen)

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.1, 0.8, 8, 16)
    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      metalness: 0.3,
      roughness: 0.6
    })
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.15, -0.6, 0)
    leftLeg.castShadow = true
    worker.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.15, -0.6, 0)
    rightLeg.castShadow = true
    worker.add(rightLeg)

    // Boots
    const bootGeometry = new THREE.BoxGeometry(0.18, 0.2, 0.22)
    const bootMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      metalness: 0.2,
      roughness: 0.7
    })
    const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial)
    leftBoot.position.set(-0.15, -1.25, 0)
    leftBoot.castShadow = true
    worker.add(leftBoot)

    const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial)
    rightBoot.position.set(0.15, -1.25, 0)
    rightBoot.castShadow = true
    worker.add(rightBoot)

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10)
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.5
    ground.receiveShadow = true
    scene.add(ground)

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016

      if (workerRef.current) {
        // Idle walking animation
        if (isMonitoring) {
          workerRef.current.position.x = Math.sin(timeRef.current * 1.5) * 0.3
          workerRef.current.rotation.y = Math.sin(timeRef.current * 0.8) * 0.3
        } else {
          workerRef.current.position.x = 0
          workerRef.current.rotation.y = 0
        }

        // Bobbing up and down
        workerRef.current.position.y = Math.sin(timeRef.current * 2) * 0.1

        // Alert animations
        if (alertLevel === 'critical') {
          // Red flash and shake
          workerRef.current.rotation.z = Math.sin(timeRef.current * 10) * 0.08
          helmetMaterial.color.setHex(0xff0000)
        } else if (alertLevel === 'warning') {
          // Orange glow and slight sway
          workerRef.current.rotation.z = Math.sin(timeRef.current * 4) * 0.05
          helmetMaterial.color.setHex(0xffa500)
        } else {
          // Normal yellow
          workerRef.current.rotation.z = 0
          helmetMaterial.color.setHex(0xffdd00)
        }

        // Arm gesturing when monitoring
        if (isMonitoring && rightArm) {
          rightArm.rotation.z = -Math.PI * 0.3 + Math.sin(timeRef.current * 2) * 0.3
        }

        // Head looking around
        if (isMonitoring && head) {
          head.rotation.y = Math.sin(timeRef.current * 1.2) * 0.4
        }
      }

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [isMonitoring, alertLevel])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  )
}
