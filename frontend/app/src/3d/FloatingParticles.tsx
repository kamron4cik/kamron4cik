import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  speed: number;
  radius: number;
  angle: number;
  yOffset: number;
  shape: 'cube' | 'pyramid' | 'icosahedron';
}

export default function FloatingParticles() {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo<Particle[]>(() => {
    const shapes: Array<'cube' | 'pyramid' | 'icosahedron'> = ['cube', 'pyramid', 'icosahedron'];
    return Array.from({ length: 25 }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 4 - 1,
        (Math.random() - 0.5) * 8
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.03 + Math.random() * 0.08,
      speed: 0.2 + Math.random() * 0.5,
      radius: 1.5 + Math.random() * 3,
      angle: (i / 25) * Math.PI * 2,
      yOffset: Math.random() * Math.PI * 2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.x = Math.cos(p.angle + t * p.speed * 0.2) * p.radius;
      child.position.z = Math.sin(p.angle + t * p.speed * 0.2) * p.radius;
      child.position.y = Math.sin(t * p.speed * 0.5 + p.yOffset) * 0.5 + p.position.y * 0.3;
      child.rotation.x += 0.005;
      child.rotation.y += 0.008;
    });
  });

  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00D4FF',
    emissive: '#00D4FF',
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.6,
    roughness: 0.2,
    metalness: 0.5,
  }), []);

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          material={glowMaterial}
        >
          {p.shape === 'cube' && <boxGeometry args={[1, 1, 1]} />}
          {p.shape === 'pyramid' && <coneGeometry args={[0.7, 1, 4]} />}
          {p.shape === 'icosahedron' && <icosahedronGeometry args={[0.6]} />}
        </mesh>
      ))}
    </group>
  );
}
