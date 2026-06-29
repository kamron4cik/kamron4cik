import { Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import RobotCharacter from './RobotCharacter';
import FloatingParticles from './FloatingParticles';
import Platform from './Platform';

interface SceneContentProps {
  onReady: () => void;
}

function SceneContent({ onReady }: SceneContentProps) {
  const initialized = useRef(false);

  const handleCreated = useCallback(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTimeout(onReady, 500);
    }
  }, [onReady]);

  useFrame(() => {
    handleCreated();
  });

  return (
    <>
      <fog attach="fog" args={['#0A0A0F', 6, 22]} />

      <ambientLight intensity={0.2} color="#7C3AED" />
      <hemisphereLight args={['#A78BFA', '#0A0A0F', 0.3]} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} color="#ffffff" castShadow />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} color="#A78BFA" />
      <pointLight position={[0, 2, -2]} intensity={0.5} color="#F59E0B" />
      {/* Fill light from below — amber for warm floor glow */}
      <pointLight position={[0, -1, 1]} intensity={0.25} color="#F59E0B" />

      <Platform />

      <Grid
        position={[0, -0.07, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="rgba(167, 139, 250, 0.07)"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="rgba(167, 139, 250, 0.13)"
        fadeDistance={15}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* Robot now reads pointer internally via useThree */}
      <RobotCharacter />
      <FloatingParticles />
    </>
  );
}

interface HolographicSceneProps {
  onReady: () => void;
}

export default function HolographicScene({ onReady }: HolographicSceneProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.0, 5], fov: 50 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent onReady={onReady} />
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Noise
              opacity={0.035}
              blendFunction={BlendFunction.MULTIPLY}
            />
            <ChromaticAberration
              offset={[0.0008, 0.0008]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
            />
            <Vignette
              darkness={0.4}
              offset={0.35}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
