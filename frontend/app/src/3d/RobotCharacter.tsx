import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function RobotCharacter() {
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const mouseWorld = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());

  // --- Materials ---
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0d1b2a',
    roughness: 0.2,
    metalness: 0.9,
  }), []);

  const glowCyan = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00D4FF',
    emissive: '#00D4FF',
    emissiveIntensity: 2.5,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.95,
  }), []);

  const glowPink = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FF007F',
    emissive: '#FF007F',
    emissiveIntensity: 2,
    roughness: 0.1,
    metalness: 0.8,
  }), []);

  const glowLime = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#CCFF00',
    emissive: '#CCFF00',
    emissiveIntensity: 3,
    roughness: 0.1,
    metalness: 0.8,
  }), []);

  const glowWhite = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 1,
    roughness: 0.1,
    metalness: 0.0,
  }), []);

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00FFFF',
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  }), []);

  // Happy eye material (cyan pupils that widen on joy)
  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00FFFF',
    emissive: '#00FFFF',
    emissiveIntensity: 4,
  }), []);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // --- Cursor-to-world ray cast ---
    const pointer = state.pointer; // normalized -1..1
    raycaster.current.setFromCamera(pointer, camera);
    // Intersect a plane at z=0
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.current.ray.intersectPlane(plane, mouseWorld.current);

    // --- Idle float ---
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.1;
    }

    // --- HEAD: track cursor fully ---
    if (headRef.current && groupRef.current) {
      const worldPos = new THREE.Vector3();
      headRef.current.getWorldPosition(worldPos);
      const dir = mouseWorld.current.clone().sub(worldPos).normalize();
      const targetRotY = Math.atan2(dir.x, dir.z) * 0.55;
      const targetRotX = -dir.y * 0.3;
      headRef.current.rotation.y += (targetRotY - headRef.current.rotation.y) * 0.12;
      headRef.current.rotation.x += (THREE.MathUtils.clamp(targetRotX, -0.35, 0.35) - headRef.current.rotation.x) * 0.12;
    }

    // --- BODY: subtle lean toward cursor ---
    if (bodyRef.current) {
      const targetLeanX = mouseWorld.current.x * 0.04;
      bodyRef.current.rotation.z += (-targetLeanX - bodyRef.current.rotation.z) * 0.06;
    }

    // --- ARM ANIMATION ---
    // Detect wave phase (every ~12s, wave for 3s)
    const wavePhase = (t % 12);
    const isWaving = wavePhase < 3;

    if (leftArmRef.current) {
      if (isWaving) {
        // Raise arm and wave enthusiastically
        const wave = Math.sin(t * 8) * 0.3;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x, -Math.PI * 0.7 + wave, 0.15
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z, -0.3, 0.1
        );
      } else {
        // Idle arm swing
        const swing = Math.sin(t * 1.2) * 0.3;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, swing, 0.1);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, 0.1);
      }
    }

    if (rightArmRef.current) {
      // Right arm: always swing opposite to left (walking style)
      const swing = -Math.sin(t * 1.2) * 0.3;
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, swing, 0.1);
      // Also track cursor — right arm points vaguely toward it
      const cursorInfluence = THREE.MathUtils.clamp(mouseWorld.current.x * 0.1, -0.3, 0.3);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, cursorInfluence, 0.05);
    }

    // --- LEGS: walk ---
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 1.2) * 0.2;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = -Math.sin(t * 1.2) * 0.2;
    }

    // --- EYES: pulse + blink ---
    const blink = Math.sin(t * 0.7) > 0.96; // occasional blink
    const eyeScale = blink ? 0.1 : 1 + Math.sin(t * 2.5) * 0.15;
    if (eyeLeftRef.current) eyeLeftRef.current.scale.y = eyeScale;
    if (eyeRightRef.current) eyeRightRef.current.scale.y = eyeScale;

    // --- EMISSIVE PULSE on glow parts ---
    glowCyan.emissiveIntensity = 2 + Math.sin(t * 2.1) * 0.8;
    glowLime.emissiveIntensity = 2.5 + Math.sin(t * 3.0) * 1.0;
    glowPink.emissiveIntensity = 1.5 + Math.sin(t * 1.7) * 0.7;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>

      {/* ===== HEAD ===== */}
      <group ref={headRef} position={[0, 1.65, 0]}>
        {/* Head shell */}
        <mesh material={bodyMat}>
          <boxGeometry args={[0.42, 0.46, 0.38]} />
        </mesh>
        <mesh material={wireMat}>
          <boxGeometry args={[0.44, 0.48, 0.40]} />
        </mesh>

        {/* Visor strip (cyan) */}
        <mesh position={[0, 0.06, 0.185]} material={glowCyan}>
          <boxGeometry args={[0.32, 0.06, 0.01]} />
        </mesh>

        {/* Left eye */}
        <group position={[-0.1, 0.04, 0.19]}>
          <mesh ref={eyeLeftRef} material={pupilMat}>
            <sphereGeometry args={[0.045, 12, 12]} />
          </mesh>
          {/* Star-like rays */}
          <mesh material={glowCyan} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.055, 0.006, 8, 20]} />
          </mesh>
        </group>

        {/* Right eye */}
        <group position={[0.1, 0.04, 0.19]}>
          <mesh ref={eyeRightRef} material={pupilMat}>
            <sphereGeometry args={[0.045, 12, 12]} />
          </mesh>
          <mesh material={glowCyan} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.055, 0.006, 8, 20]} />
          </mesh>
        </group>

        {/* Smile / mouth - lime arc */}
        <mesh ref={mouthRef} position={[0, -0.1, 0.19]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.08, 0.012, 8, 16, Math.PI]} />
          {/* Use lime material for happy smile */}
          <meshStandardMaterial color="#CCFF00" emissive="#CCFF00" emissiveIntensity={3} />
        </mesh>

        {/* Cheek blush dots */}
        <mesh position={[-0.19, -0.02, 0.16]} material={glowPink}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        <mesh position={[0.19, -0.02, 0.16]} material={glowPink}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.28, 0]} material={glowCyan}>
          <cylinderGeometry args={[0.012, 0.012, 0.18]} />
        </mesh>
        {/* Antenna ball - pulses lime */}
        <mesh position={[0, 0.39, 0]} material={glowLime}>
          <sphereGeometry args={[0.032, 12, 12]} />
        </mesh>
        {/* Antenna ring */}
        <mesh position={[0, 0.39, 0]} material={glowCyan} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.006, 8, 16]} />
        </mesh>

        {/* Ear sensors */}
        <mesh position={[-0.225, 0.02, 0]} material={glowPink}>
          <boxGeometry args={[0.035, 0.1, 0.05]} />
        </mesh>
        <mesh position={[0.225, 0.02, 0]} material={glowPink}>
          <boxGeometry args={[0.035, 0.1, 0.05]} />
        </mesh>
      </group>

      {/* ===== NECK ===== */}
      <mesh position={[0, 1.4, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.09, 0.11, 0.12]} />
      </mesh>
      <mesh position={[0, 1.4, 0]} material={glowCyan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 20]} />
      </mesh>

      {/* ===== TORSO ===== */}
      <group ref={bodyRef} position={[0, 0.98, 0]}>
        <mesh material={bodyMat}>
          <boxGeometry args={[0.55, 0.65, 0.34]} />
        </mesh>
        <mesh material={wireMat}>
          <boxGeometry args={[0.57, 0.67, 0.36]} />
        </mesh>

        {/* Chest panel */}
        <mesh position={[0, 0.08, 0.16]} material={glowCyan}>
          <boxGeometry args={[0.22, 0.16, 0.015]} />
        </mesh>

        {/* Core heart / reactor - lime pulse */}
        <mesh position={[0, 0.07, 0.175]} material={glowLime}>
          <circleGeometry args={[0.06, 16]} />
        </mesh>

        {/* Shoulder stripe */}
        <mesh position={[0, 0.25, 0.155]} material={glowPink}>
          <boxGeometry args={[0.34, 0.018, 0.01]} />
        </mesh>

        {/* Side vents */}
        <mesh position={[-0.255, 0, 0]} material={glowCyan}>
          <boxGeometry args={[0.02, 0.12, 0.08]} />
        </mesh>
        <mesh position={[0.255, 0, 0]} material={glowCyan}>
          <boxGeometry args={[0.02, 0.12, 0.08]} />
        </mesh>

        {/* Waist belt */}
        <mesh position={[0, -0.3, 0]} material={glowCyan}>
          <boxGeometry args={[0.57, 0.04, 0.36]} />
        </mesh>
        <mesh position={[0, -0.3, 0.17]} material={glowPink}>
          <boxGeometry args={[0.18, 0.035, 0.01]} />
        </mesh>
      </group>

      {/* ===== LEFT ARM ===== */}
      <group ref={leftArmRef} position={[-0.4, 1.18, 0]}>
        {/* Shoulder sphere */}
        <mesh material={glowPink}>
          <sphereGeometry args={[0.11, 12, 12]} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[-0.06, -0.22, 0]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.28, 0.13]} />
        </mesh>
        {/* Elbow */}
        <mesh position={[-0.06, -0.37, 0]} material={glowCyan}>
          <sphereGeometry args={[0.055, 10, 10]} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[-0.06, -0.54, 0.04]} material={bodyMat}>
          <boxGeometry args={[0.11, 0.28, 0.11]} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.06, -0.7, 0.04]} material={bodyMat}>
          <boxGeometry args={[0.1, 0.12, 0.09]} />
        </mesh>
        {/* Hand glow fingers */}
        <mesh position={[-0.06, -0.78, 0.04]} material={glowCyan}>
          <boxGeometry args={[0.08, 0.04, 0.05]} />
        </mesh>
      </group>

      {/* ===== RIGHT ARM ===== */}
      <group ref={rightArmRef} position={[0.4, 1.18, 0]}>
        <mesh material={glowPink}>
          <sphereGeometry args={[0.11, 12, 12]} />
        </mesh>
        <mesh position={[0.06, -0.22, 0]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.28, 0.13]} />
        </mesh>
        <mesh position={[0.06, -0.37, 0]} material={glowCyan}>
          <sphereGeometry args={[0.055, 10, 10]} />
        </mesh>
        <mesh position={[0.06, -0.54, 0.04]} material={bodyMat}>
          <boxGeometry args={[0.11, 0.28, 0.11]} />
        </mesh>
        <mesh position={[0.06, -0.7, 0.04]} material={bodyMat}>
          <boxGeometry args={[0.1, 0.12, 0.09]} />
        </mesh>
        <mesh position={[0.06, -0.78, 0.04]} material={glowPink}>
          <boxGeometry args={[0.08, 0.04, 0.05]} />
        </mesh>
      </group>

      {/* ===== LEFT LEG ===== */}
      <group ref={leftLegRef} position={[-0.16, 0.54, 0]}>
        <mesh position={[0, 0.06, 0]} material={glowCyan}>
          <sphereGeometry args={[0.08, 10, 10]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={bodyMat}>
          <boxGeometry args={[0.15, 0.34, 0.15]} />
        </mesh>
        <mesh position={[0, -0.43, 0]} material={glowPink}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
        <mesh position={[0, -0.65, 0]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.32, 0.13]} />
        </mesh>
        <mesh position={[0, -0.85, 0.06]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.09, 0.22]} />
        </mesh>
        <mesh position={[0, -0.9, 0.12]} material={glowCyan}>
          <boxGeometry args={[0.11, 0.02, 0.15]} />
        </mesh>
      </group>

      {/* ===== RIGHT LEG ===== */}
      <group ref={rightLegRef} position={[0.16, 0.54, 0]}>
        <mesh position={[0, 0.06, 0]} material={glowCyan}>
          <sphereGeometry args={[0.08, 10, 10]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={bodyMat}>
          <boxGeometry args={[0.15, 0.34, 0.15]} />
        </mesh>
        <mesh position={[0, -0.43, 0]} material={glowPink}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
        <mesh position={[0, -0.65, 0]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.32, 0.13]} />
        </mesh>
        <mesh position={[0, -0.85, 0.06]} material={bodyMat}>
          <boxGeometry args={[0.13, 0.09, 0.22]} />
        </mesh>
        <mesh position={[0, -0.9, 0.12]} material={glowPink}>
          <boxGeometry args={[0.11, 0.02, 0.15]} />
        </mesh>
      </group>

      {/* ===== SHADOW GLOW (ring on floor) ===== */}
      <mesh position={[0, -0.94, 0]} rotation={[-Math.PI / 2, 0, 0]} material={glowCyan}>
        <ringGeometry args={[0.28, 0.32, 32]} />
      </mesh>

    </group>
  );
}
