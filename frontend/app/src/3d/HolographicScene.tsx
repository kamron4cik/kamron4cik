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
      <fog attach="fog" args={['#060B1A', 6, 22]} />

      <ambientLight intensity={0.2} color="#00D4FF" />
      <hemisphereLight args={['#00D4FF', '#060B1A', 0.35]} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-2, 1, -1]} intensity={0.5} color="#00D4FF" />
      <pointLight position={[0, 2, -2]} intensity={0.6} color="#FF007F" />
      {/* Extra fill light from below for holographic look */}
      <pointLight position={[0, -1, 1]} intensity={0.3} color="#CCFF00" />

      <Platform />

      <Grid
        position={[0, -0.07, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="rgba(0, 212, 255, 0.08)"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="rgba(0, 212, 255, 0.15)"
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
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent onReady={onReady} />
          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.75}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
            <Noise
              opacity={0.04}
              blendFunction={BlendFunction.MULTIPLY}
            />
            <ChromaticAberration
              offset={[0.001, 0.001]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
            />
            <Vignette
              darkness={0.35}
              offset={0.3}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
