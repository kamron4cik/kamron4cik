import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCompanion } from '@/hooks/useCompanion';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
type ClickAnim = 'jump_spin' | 'backflip' | 'wave' | 'rocket' | 'dance';
const CLICK_ANIMS: ClickAnim[] = ['jump_spin', 'backflip', 'wave', 'rocket', 'dance'];

function getAnimDuration(a: ClickAnim): number {
  if (a === 'jump_spin') return 1.4;
  if (a === 'backflip')  return 1.2;
  if (a === 'wave')      return 2.8;
  if (a === 'rocket')    return 2.4;
  if (a === 'dance')     return 3.2;
  return 1.5;
}

// ─── Orbit ring config ────────────────────────────────────────────────────────
const ORBIT_CFG = [
  { radius: 0.88, speed:  1.1,  phase: 0,    yOff: 0.55, color: '#A78BFA', shape: 'sphere' as const, size: 0.054 },
  { radius: 1.14, speed: -0.68, phase: 1.26, yOff: 0.9,  color: '#F59E0B', shape: 'box'    as const, size: 0.044 },
  { radius: 0.72, speed:  1.76, phase: 2.51, yOff: 0.12, color: '#00CFFF', shape: 'torus'  as const, size: 0.038 },
  { radius: 1.30, speed:  0.45, phase: 3.77, yOff: 1.18, color: '#F0F0FF', shape: 'oct'    as const, size: 0.032 },
  { radius: 0.62, speed: -1.28, phase: 5.03, yOff:-0.04, color: '#C084FC', shape: 'sphere' as const, size: 0.027 },
] as const;

// ─── Easing helpers ───────────────────────────────────────────────────────────
function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function eo(t: number)  { return 1-(1-t)**3; }
function ei(t: number)  { return t*t*t; }

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RobotCharacter() {
  const { interact, dismissMessage, currentMessage, currentMood, clicks } = useCompanion();
  const [hovered, setHovered] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const { camera } = useThree();

  // ─── Body refs ──────────────────────────────────────────────────────────────
  const groupRef   = useRef<THREE.Group>(null);
  const headRef    = useRef<THREE.Group>(null);
  const bodyRef    = useRef<THREE.Group>(null);
  const lArmRef    = useRef<THREE.Group>(null);
  const rArmRef    = useRef<THREE.Group>(null);
  const lLegRef    = useRef<THREE.Group>(null);
  const rLegRef    = useRef<THREE.Group>(null);
  const eyeLRef    = useRef<THREE.Mesh>(null);
  const eyeRRef    = useRef<THREE.Mesh>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const floorRef   = useRef<THREE.Mesh>(null);

  // ─── Orbit refs ─────────────────────────────────────────────────────────────
  const orbitGroupRefs = useRef<(THREE.Group | null)[]>(new Array(5).fill(null));

  // ─── Animation state refs (no re-render) ────────────────────────────────────
  const t             = useRef(0);
  const mouseWorld    = useRef(new THREE.Vector3());
  const raycaster     = useRef(new THREE.Raycaster());
  const hoverLerp     = useRef(0);

  // Blink system
  const nextBlink   = useRef(Math.random() * 3 + 1.5);
  const blinkTimer  = useRef(0);
  const blinkProg   = useRef(0);
  const isBlinking  = useRef(false);

  // Random head look
  const nextLook    = useRef(Math.random() * 4 + 2.5);
  const lookTimer   = useRef(0);
  const lookTargX   = useRef(0);
  const lookTargY   = useRef(0);
  const lookCurrX   = useRef(0);
  const lookCurrY   = useRef(0);

  // Click animations
  const clickAnim   = useRef<ClickAnim | null>(null);
  const clickProg   = useRef(0);
  const clickIdx    = useRef(0);
  const heartRef    = useRef(false);
  const symbolsRef  = useRef(false);

  // Random special events
  const eventTimer  = useRef(0);
  const nextEvent   = useRef(Math.random() * 15 + 20);
  const specialAnim = useRef<'stretch' | 'spin_head' | 'excited' | null>(null);
  const specialProg = useRef(0);

  // Phases for non-mechanical feel
  const breathPhase = useRef(Math.random() * Math.PI * 2);
  const floatPhase  = useRef(Math.random() * Math.PI * 2);

  // ─── Materials ──────────────────────────────────────────────────────────────
  const matBody = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D6D4E8', roughness: 0.1, metalness: 0.88,
  }), []);

  const matDark = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0C0A1A', roughness: 0.05, metalness: 0.96,
  }), []);

  const matGlass = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050810', roughness: 0.0, metalness: 0.95,
    transparent: true, opacity: 0.92,
  }), []);

  const matViolet = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#A78BFA', emissive: '#7C3AED', emissiveIntensity: 2.8,
    roughness: 0.04, metalness: 0.8, transparent: true, opacity: 0.96,
  }), []);

  const matAmber = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F59E0B', emissive: '#B45309', emissiveIntensity: 2.2,
    roughness: 0.04, metalness: 0.8,
  }), []);

  const matCyan = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00CFFF', emissive: '#0088AA', emissiveIntensity: 2.8,
    roughness: 0.04, metalness: 0.8, transparent: true, opacity: 0.95,
  }), []);

  const matPupil = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00CFFF', emissive: '#00CFFF', emissiveIntensity: 4.5,
  }), []);

  const matWire = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#A78BFA', wireframe: true, transparent: true, opacity: 0.07,
  }), []);

  const matFloorGlow = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#A78BFA', emissive: '#7C3AED', emissiveIntensity: 1.8,
    roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.55,
  }), []);

  // Orbit materials (stable refs, modified in useFrame)
  const orbitMats = useMemo(() => ORBIT_CFG.map(cfg => new THREE.MeshStandardMaterial({
    color: cfg.color, emissive: cfg.color, emissiveIntensity: 2,
    roughness: 0.08, metalness: 0.9, transparent: true, opacity: 0.88,
  })), []);

  // ─── Companion message auto-dismiss ─────────────────────────────────────────
  useEffect(() => {
    if (currentMessage) {
      const time = Math.min(Math.max(currentMessage.length * 65, 3000), 8000);
      const timer = setTimeout(dismissMessage, time);
      return () => clearTimeout(timer);
    }
  }, [currentMessage, dismissMessage]);

  // ─── Click handler ───────────────────────────────────────────────────────────
  const handleClick = () => {
    interact();
    if (!clickAnim.current) {
      clickAnim.current = CLICK_ANIMS[clickIdx.current % CLICK_ANIMS.length];
      clickIdx.current += 1;
      clickProg.current = 0;
    }
  };

  // ─── MAIN ANIMATION LOOP ─────────────────────────────────────────────────────
  useFrame((_state, delta) => {
    t.current += delta;
    const T = t.current;

    // Cursor tracking
    raycaster.current.setFromCamera(_state.pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.current.ray.intersectPlane(plane, mouseWorld.current);

    // Hover lerp
    hoverLerp.current = THREE.MathUtils.lerp(hoverLerp.current, hovered ? 1 : 0, 0.09);
    const H = hoverLerp.current;

    // ── Blink ───────────────────────────────────────────────────────────────
    blinkTimer.current += delta;
    let eyeScaleY = 1;
    if (!isBlinking.current && blinkTimer.current > nextBlink.current) {
      isBlinking.current = true;
      blinkProg.current = 0;
      blinkTimer.current = 0;
      nextBlink.current = Math.random() * 4 + 2;
    }
    if (isBlinking.current) {
      blinkProg.current += delta * 12;
      const bp = blinkProg.current;
      if (bp < 0.5)      { eyeScaleY = 1 - eo(bp * 2); }
      else if (bp < 1.0) { eyeScaleY = eo((bp - 0.5) * 2); }
      else               { isBlinking.current = false; eyeScaleY = 1; }
      eyeScaleY = Math.max(0.04, eyeScaleY);
    }
    if (eyeLRef.current) eyeLRef.current.scale.y = eyeScaleY;
    if (eyeRRef.current) eyeRRef.current.scale.y = eyeScaleY;

    // ── Random head look ────────────────────────────────────────────────────
    lookTimer.current += delta;
    if (lookTimer.current > nextLook.current) {
      lookTimer.current = 0;
      nextLook.current = Math.random() * 5 + 3;
      lookTargX.current = (Math.random() - 0.5) * 1.8;
      lookTargY.current = (Math.random() - 0.5) * 0.9;
    }
    lookCurrX.current = THREE.MathUtils.lerp(lookCurrX.current, lookTargX.current, 0.025);
    lookCurrY.current = THREE.MathUtils.lerp(lookCurrY.current, lookTargY.current, 0.025);

    // ── Head tracking ───────────────────────────────────────────────────────
    if (headRef.current && groupRef.current) {
      const wp = new THREE.Vector3();
      headRef.current.getWorldPosition(wp);
      const dir = mouseWorld.current.clone().sub(wp).normalize();
      const cursorY = Math.atan2(dir.x, dir.z) * 0.5;
      const cursorX = THREE.MathUtils.clamp(-dir.y * 0.3, -0.35, 0.35);
      const idleY   = lookCurrX.current * 0.4;
      const idleX   = lookCurrY.current * 0.3;
      const tY = THREE.MathUtils.lerp(idleY, cursorY, H);
      const tX = THREE.MathUtils.lerp(idleX, cursorX, H);
      headRef.current.rotation.y += (tY - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.x += (tX - headRef.current.rotation.x) * 0.1;
    }

    // ── Body lean + breathe ─────────────────────────────────────────────────
    if (bodyRef.current) {
      bodyRef.current.rotation.z += (-mouseWorld.current.x * 0.025 * H - bodyRef.current.rotation.z) * 0.06;
      const breathe = 1 + Math.sin(T * 1.15 + breathPhase.current) * 0.013;
      bodyRef.current.scale.y = breathe;
      bodyRef.current.scale.x = 1 / breathe * 0.5 + 0.5; // slight counter-squash
    }

    // ── Antenna slow spin ───────────────────────────────────────────────────
    if (antennaRef.current) {
      antennaRef.current.rotation.y += delta * 0.9;
    }

    // ── Glow pulse (mood-aware) ──────────────────────────────────────────────
    const moodBoost = currentMood === 'excited' ? 2.0 : currentMood === 'happy' ? 1.2 : currentMood === 'inspiring' ? 1.5 : 0;
    matViolet.emissiveIntensity = 2.5 + H * 1.8 + Math.sin(T * 2.1) * 0.9 + moodBoost;
    matCyan.emissiveIntensity   = 2.5 + H * 1.5 + Math.sin(T * 1.7) * 0.8 + moodBoost * 0.5;
    matAmber.emissiveIntensity  = 2.0 + H * 1.0 + Math.sin(T * 3.2) * 0.6;
    matPupil.emissiveIntensity  = 4 + H * 3 + Math.sin(T * 4) * 1;
    matFloorGlow.emissiveIntensity = 1.5 + Math.sin(T * 1.5) * 0.5 + H * 1;

    // ── Base Y float ────────────────────────────────────────────────────────
    let baseY = Math.sin(T * 0.72 + floatPhase.current) * 0.13;
    let scaleX = 1, scaleY = 1;

    // ── CLICK ANIMATION SYSTEM ───────────────────────────────────────────────
    if (clickAnim.current) {
      const anim = clickAnim.current;
      clickProg.current = Math.min(clickProg.current + delta / getAnimDuration(anim), 1);
      const p = clickProg.current;

      // ── jump_spin ──
      if (anim === 'jump_spin') {
        if (p < 0.18) {
          // Anticipate: crouch
          const pp = p / 0.18;
          baseY = -0.14 * eio(pp);
          scaleY = 1 - 0.1 * pp;
          scaleX = 1 + 0.07 * pp;
        } else if (p < 0.68) {
          // Jump + 360 spin
          const pp = (p - 0.18) / 0.5;
          baseY = THREE.MathUtils.lerp(-0.14, 1.6, eo(pp));
          if (groupRef.current) groupRef.current.rotation.y = eo(pp) * Math.PI * 2;
          scaleY = THREE.MathUtils.lerp(0.9, 1.12, pp);
          scaleX = THREE.MathUtils.lerp(1.07, 0.9, pp);
        } else if (p < 0.83) {
          // Fall
          const pp = (p - 0.68) / 0.15;
          baseY = THREE.MathUtils.lerp(1.6, 0.02, eio(pp));
          if (groupRef.current) groupRef.current.rotation.y = Math.PI * 2;
        } else if (p < 0.93) {
          // Squash on land
          const pp = (p - 0.83) / 0.1;
          scaleY = THREE.MathUtils.lerp(1.1, 0.6, eio(pp));
          scaleX = THREE.MathUtils.lerp(0.9, 1.42, eio(pp));
          if (groupRef.current) groupRef.current.rotation.y = Math.PI * 2;
          baseY = 0;
        } else {
          // Spring back
          const pp = (p - 0.93) / 0.07;
          scaleY = THREE.MathUtils.lerp(0.6, 1, eo(pp));
          scaleX = THREE.MathUtils.lerp(1.42, 1, eo(pp));
          if (groupRef.current) groupRef.current.rotation.y = Math.PI * 2;
        }
      }

      // ── backflip ──
      if (anim === 'backflip') {
        if (p < 0.12) {
          // Lean back
          if (groupRef.current) groupRef.current.rotation.x = -0.35 * eio(p / 0.12);
          baseY = 0;
        } else if (p < 0.88) {
          // Full backward flip
          const pp = (p - 0.12) / 0.76;
          if (groupRef.current) groupRef.current.rotation.x = -Math.PI * 2 * eio(pp);
          baseY = Math.sin(pp * Math.PI) * 1.1;
        } else {
          // Settle
          const pp = (p - 0.88) / 0.12;
          if (groupRef.current) groupRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI * 2, 0, eo(pp));
          baseY = THREE.MathUtils.lerp(0.1, 0, pp);
        }
      }

      // ── rocket ──
      if (anim === 'rocket') {
        if (p < 0.14) {
          // Power up: crouch + amber thruster flare
          const pp = p / 0.14;
          baseY = -0.08 * pp;
          matAmber.emissiveIntensity = 2 + pp * 12;
          scaleY = 1 - 0.08 * pp;
          scaleX = 1 + 0.05 * pp;
        } else if (p < 0.55) {
          // LAUNCH!
          const pp = (p - 0.14) / 0.41;
          baseY = eo(pp) * 2.0;
          matAmber.emissiveIntensity = 14 + Math.sin(T * 20) * 2;
          scaleY = THREE.MathUtils.lerp(0.92, 1.18, pp);
          scaleX = THREE.MathUtils.lerp(1.05, 0.85, pp);
        } else if (p < 0.72) {
          // Float at top
          baseY = 2.0 + Math.sin(T * 3) * 0.06;
          matAmber.emissiveIntensity = 10 + Math.sin(T * 8) * 3;
        } else {
          // Glide down
          const pp = (p - 0.72) / 0.28;
          baseY = THREE.MathUtils.lerp(2.0, 0, eio(pp));
          matAmber.emissiveIntensity = THREE.MathUtils.lerp(10, 2, pp);
          scaleY = THREE.MathUtils.lerp(1.18, 1, eo(pp));
          scaleX = THREE.MathUtils.lerp(0.85, 1, eo(pp));
        }
      }

      // ── dance ──
      if (anim === 'dance') {
        const danceT = p * Math.PI * 7;
        baseY = Math.abs(Math.sin(danceT * 0.5)) * 0.18;
        if (groupRef.current) {
          groupRef.current.rotation.y = Math.sin(danceT * 0.5) * 0.55;
          groupRef.current.rotation.z = Math.sin(danceT * 0.25) * 0.12;
        }
        if (lArmRef.current) {
          lArmRef.current.rotation.x = -Math.sin(danceT) * 1.4;
          lArmRef.current.rotation.z = Math.cos(danceT * 0.5) * 0.55;
        }
        if (rArmRef.current) {
          rArmRef.current.rotation.x = Math.sin(danceT) * 1.4;
          rArmRef.current.rotation.z = -Math.cos(danceT * 0.5) * 0.55;
        }
        if (lLegRef.current) lLegRef.current.rotation.x = Math.sin(danceT * 0.8) * 0.5;
        if (rLegRef.current) rLegRef.current.rotation.x = -Math.sin(danceT * 0.8) * 0.5;
      }

      // ── wave ──
      if (anim === 'wave') {
        const raise = Math.min(p * 4, 1);
        if (lArmRef.current) {
          const waveT = T * 8;
          lArmRef.current.rotation.x = THREE.MathUtils.lerp(
            lArmRef.current.rotation.x,
            p < 0.9 ? (-Math.PI * 0.78 + Math.sin(waveT) * 0.28 * raise) : 0,
            0.15
          );
          lArmRef.current.rotation.z = THREE.MathUtils.lerp(
            lArmRef.current.rotation.z,
            p < 0.9 ? (-0.35 + Math.cos(waveT * 0.5) * 0.2 * raise) : 0,
            0.1
          );
        }
        // Heart visibility — toggle state only on change
        const shouldHeart = p > 0.12 && p < 0.88;
        if (shouldHeart !== heartRef.current) {
          heartRef.current = shouldHeart;
          setShowHeart(shouldHeart);
        }
      }

      // ── End of animation ──
      if (p >= 1) {
        clickAnim.current = null;
        clickProg.current = 0;
        if (heartRef.current) { heartRef.current = false; setShowHeart(false); }
        if (symbolsRef.current) { symbolsRef.current = false; setShowSymbols(false); }
        if (groupRef.current) {
          groupRef.current.rotation.x = 0;
          groupRef.current.rotation.y = 0;
          groupRef.current.rotation.z = 0;
        }
        if (lArmRef.current) {
          lArmRef.current.rotation.x = 0;
          lArmRef.current.rotation.z = 0;
        }
      }
    }

    // ── IDLE ARM SWING (when no click anim, or rocket) ───────────────────────
    if (!clickAnim.current || clickAnim.current === 'rocket') {
      const wavePhase = T % 12;
      if (lArmRef.current) {
        if (wavePhase < 3) {
          // Periodic enthusiastic wave
          lArmRef.current.rotation.x = THREE.MathUtils.lerp(
            lArmRef.current.rotation.x,
            -Math.PI * 0.72 + Math.sin(T * 9) * 0.28,
            0.14
          );
          lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, -0.35, 0.09);
        } else {
          lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, Math.sin(T * 1.05) * 0.22, 0.07);
          lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, 0, 0.07);
        }
      }
      if (rArmRef.current) {
        rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -Math.sin(T * 1.05) * 0.22, 0.07);
        rArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rArmRef.current.rotation.z,
          THREE.MathUtils.clamp(mouseWorld.current.x * 0.09 * H, -0.28, 0.28),
          0.05
        );
      }
    }

    // ── LEGS idle walk ───────────────────────────────────────────────────────
    if (clickAnim.current !== 'dance') {
      if (lLegRef.current) lLegRef.current.rotation.x = THREE.MathUtils.lerp(lLegRef.current.rotation.x, Math.sin(T * 1.05) * 0.17, 0.1);
      if (rLegRef.current) rLegRef.current.rotation.x = THREE.MathUtils.lerp(rLegRef.current.rotation.x, -Math.sin(T * 1.05) * 0.17, 0.1);
    }

    // ── SPECIAL RANDOM EVENTS ────────────────────────────────────────────────
    if (!clickAnim.current && !specialAnim.current) {
      eventTimer.current += delta;
      if (eventTimer.current > nextEvent.current) {
        eventTimer.current = 0;
        nextEvent.current = Math.random() * 18 + 22;
        const events = ['stretch', 'spin_head', 'excited'] as const;
        specialAnim.current = events[Math.floor(Math.random() * events.length)];
        specialProg.current = 0;
      }
    }

    if (specialAnim.current) {
      specialProg.current += delta / 1.5;
      const sp = Math.min(specialProg.current, 1);
      if (specialAnim.current === 'stretch') {
        // Stretch arms out wide
        if (lArmRef.current) lArmRef.current.rotation.z = THREE.MathUtils.lerp(lArmRef.current.rotation.z, -Math.sin(sp * Math.PI) * 1.2, 0.12);
        if (rArmRef.current) rArmRef.current.rotation.z = THREE.MathUtils.lerp(rArmRef.current.rotation.z, Math.sin(sp * Math.PI) * 1.2, 0.12);
        if (bodyRef.current) {
          const stretchVal = 1 + Math.sin(sp * Math.PI) * 0.08;
          bodyRef.current.scale.y = stretchVal;
        }
      } else if (specialAnim.current === 'spin_head') {
        if (headRef.current) headRef.current.rotation.y = sp * Math.PI * 2;
      } else if (specialAnim.current === 'excited') {
        baseY = baseY + Math.sin(sp * Math.PI * 4) * 0.25;
        matViolet.emissiveIntensity = 5 + Math.sin(T * 10) * 2;
        matAmber.emissiveIntensity = 5 + Math.sin(T * 8) * 2;
      }
      if (sp >= 1) specialAnim.current = null;
    }

    // ── APPLY GROUP TRANSFORMS ───────────────────────────────────────────────
    if (groupRef.current && clickAnim.current !== 'dance' && clickAnim.current !== 'backflip') {
      groupRef.current.position.y = baseY;
      if (clickAnim.current !== 'jump_spin') {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.04);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.04);
      }
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, scaleX, 0.2);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, scaleY, 0.2);
    } else if (groupRef.current) {
      groupRef.current.position.y = baseY;
    }

    // ── ORBITS ───────────────────────────────────────────────────────────────
    ORBIT_CFG.forEach((cfg, i) => {
      const g = orbitGroupRefs.current[i];
      if (!g) return;
      const angle = T * cfg.speed + cfg.phase;
      g.position.x = Math.cos(angle) * cfg.radius;
      g.position.z = Math.sin(angle) * cfg.radius * 0.42; // ellipse
      g.position.y = cfg.yOff + Math.sin(T * 0.65 + cfg.phase) * 0.09;
      g.rotation.x = T * 0.6 + cfg.phase;
      g.rotation.y = T * 0.8 + cfg.phase;
      // Pulse brightness
      orbitMats[i].emissiveIntensity = 1.6 + Math.sin(T * 2.2 + cfg.phase) * 0.9 + H * 1.2;
      // Scale with hover
      const orbitScale = 1 + H * 0.3;
      g.scale.setScalar(orbitScale);
    });
  });

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >

      {/* ── ORBIT OBJECTS ────────────────────────────────────────────────── */}
      {ORBIT_CFG.map((cfg, i) => (
        <group key={`orbit-${i}`} ref={(el) => { orbitGroupRefs.current[i] = el; }}>
          {cfg.shape === 'sphere' && (
            <mesh material={orbitMats[i]}>
              <sphereGeometry args={[cfg.size, 10, 10]} />
            </mesh>
          )}
          {cfg.shape === 'box' && (
            <mesh material={orbitMats[i]}>
              <boxGeometry args={[cfg.size, cfg.size, cfg.size]} />
            </mesh>
          )}
          {cfg.shape === 'torus' && (
            <mesh material={orbitMats[i]}>
              <torusGeometry args={[cfg.size, cfg.size * 0.35, 8, 16]} />
            </mesh>
          )}
          {cfg.shape === 'oct' && (
            <mesh material={orbitMats[i]}>
              <octahedronGeometry args={[cfg.size]} />
            </mesh>
          )}
          {/* Soft halo */}
          <mesh>
            <sphereGeometry args={[cfg.size * 3.5, 5, 5]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.055} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* ── HEAD ─────────────────────────────────────────────────────────── */}
      <group ref={headRef} position={[0, 1.65, 0]}>

        {/* Overlays (speech bubble / heart) */}
        <Html position={[0.46, 0.58, 0]} center zIndexRange={[100, 0]}>
          <div className="flex flex-col items-start select-none gap-2">
            <AnimatePresence>
              {currentMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: -20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: 'spring', damping: 16, stiffness: 200 }}
                  className="relative px-4 py-3 rounded-2xl shadow-2xl max-w-[280px] min-w-[150px] text-center pointer-events-none"
                  style={{
                    background: 'rgba(10, 8, 26, 0.92)',
                    border: '1px solid rgba(167, 139, 250, 0.4)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(167,139,250,0.25)',
                  }}
                >
                  <p className="font-body text-sm font-medium text-white leading-relaxed">{currentMessage}</p>
                  <div
                    className="absolute bottom-[-6px] left-6 w-3 h-3"
                    style={{
                      background: 'rgba(10, 8, 26, 0.92)',
                      borderBottom: '1px solid rgba(167,139,250,0.4)',
                      borderRight: '1px solid rgba(167,139,250,0.4)',
                      transform: 'rotate(45deg)',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!currentMessage && hovered && clicks === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-[0.18em] whitespace-nowrap pointer-events-none"
                  style={{
                    background: 'rgba(10, 8, 26, 0.88)',
                    border: '1px solid rgba(167, 139, 250, 0.45)',
                    color: '#A78BFA',
                    boxShadow: '0 0 16px rgba(167, 139, 250, 0.35)',
                  }}
                >
                  CLICK ME!
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showHeart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 15 }}
                  animate={{ opacity: 1, scale: 1.3, y: -5 }}
                  exit={{ opacity: 0, scale: 0, y: -25 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 260 }}
                  className="text-3xl pointer-events-none"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.9))' }}
                >
                  💜
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Html>

        {/* Head shell — glossy white */}
        <mesh material={matBody}>
          <boxGeometry args={[0.44, 0.46, 0.38]} />
        </mesh>
        <mesh material={matWire}>
          <boxGeometry args={[0.455, 0.475, 0.395]} />
        </mesh>

        {/* Black glass face */}
        <mesh position={[0, 0.02, 0.186]} material={matGlass}>
          <boxGeometry args={[0.33, 0.3, 0.01]} />
        </mesh>

        {/* Left eye */}
        <group position={[-0.1, 0.04, 0.196]}>
          <mesh ref={eyeLRef} material={matPupil}>
            <sphereGeometry args={[0.047, 14, 14]} />
          </mesh>
          <mesh material={matViolet}>
            <torusGeometry args={[0.062, 0.008, 8, 20]} />
          </mesh>
        </group>

        {/* Right eye */}
        <group position={[0.1, 0.04, 0.196]}>
          <mesh ref={eyeRRef} material={matPupil}>
            <sphereGeometry args={[0.047, 14, 14]} />
          </mesh>
          <mesh material={matViolet}>
            <torusGeometry args={[0.062, 0.008, 8, 20]} />
          </mesh>
        </group>

        {/* LED Smile arc — amber */}
        <mesh position={[0, -0.1, 0.195]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.077, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={2.5} />
        </mesh>

        {/* Cheek sensors — violet */}
        <mesh position={[-0.191, -0.02, 0.162]} material={matViolet}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>
        <mesh position={[0.191, -0.02, 0.162]} material={matViolet}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>

        {/* Visor top strip — cyan */}
        <mesh position={[0, 0.205, 0.187]} material={matCyan}>
          <boxGeometry args={[0.3, 0.028, 0.01]} />
        </mesh>

        {/* Antenna — spins */}
        <group position={[0, 0.285, 0]}>
          {/* Stem */}
          <mesh material={matDark}>
            <cylinderGeometry args={[0.011, 0.013, 0.22]} />
          </mesh>
          {/* Ring — spins via antennaRef on the ball group */}
          <group ref={antennaRef} position={[0, 0.13, 0]}>
            <mesh material={matViolet} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.038, 0.006, 8, 16]} />
            </mesh>
            {/* Ball */}
            <mesh material={matAmber}>
              <sphereGeometry args={[0.031, 12, 12]} />
            </mesh>
          </group>
        </group>

        {/* Ear fins */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.234, 0.02, 0]}>
            <mesh material={matBody}>
              <boxGeometry args={[0.03, 0.11, 0.065]} />
            </mesh>
            <mesh position={[0, 0, 0]} material={matViolet}>
              <boxGeometry args={[0.036, 0.038, 0.012]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── NECK ──────────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.4, 0]} material={matBody}>
        <cylinderGeometry args={[0.09, 0.115, 0.12]} />
      </mesh>
      <mesh position={[0, 1.4, 0]} material={matCyan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.097, 0.006, 8, 20]} />
      </mesh>

      {/* ── TORSO ─────────────────────────────────────────────────────────── */}
      <group ref={bodyRef} position={[0, 0.95, 0]}>
        {/* Shell */}
        <mesh material={matBody}>
          <boxGeometry args={[0.58, 0.68, 0.36]} />
        </mesh>
        <mesh material={matWire}>
          <boxGeometry args={[0.60, 0.70, 0.375]} />
        </mesh>
        {/* Chest armor plate */}
        <mesh position={[0, 0.1, 0.171]} material={matDark}>
          <boxGeometry args={[0.4, 0.3, 0.016]} />
        </mesh>
        {/* Chest panel — violet holographic */}
        <mesh position={[0, 0.1, 0.179]} material={matViolet}>
          <boxGeometry args={[0.25, 0.18, 0.01]} />
        </mesh>
        {/* Core reactor — amber */}
        <mesh position={[0, 0.09, 0.185]} material={matAmber}>
          <circleGeometry args={[0.056, 16]} />
        </mesh>
        {/* Shoulder pads */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.308, 0.25, 0]} material={matBody}>
            <boxGeometry args={[0.042, 0.13, 0.26]} />
          </mesh>
        ))}
        {/* Side vents — violet */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.268, 0, 0]} material={matViolet}>
            <boxGeometry args={[0.02, 0.14, 0.09]} />
          </mesh>
        ))}
        {/* Shoulder stripe — amber */}
        <mesh position={[0, 0.295, 0.162]} material={matAmber}>
          <boxGeometry args={[0.4, 0.015, 0.01]} />
        </mesh>
        {/* Waist band */}
        <mesh position={[0, -0.325, 0]} material={matDark}>
          <boxGeometry args={[0.60, 0.06, 0.37]} />
        </mesh>
        <mesh position={[0, -0.325, 0.177]} material={matViolet}>
          <boxGeometry args={[0.2, 0.04, 0.01]} />
        </mesh>
      </group>

      {/* ── LEFT ARM ──────────────────────────────────────────────────────── */}
      <group ref={lArmRef} position={[-0.425, 1.15, 0]}>
        <mesh material={matViolet}><sphereGeometry args={[0.107, 12, 12]} /></mesh>
        <mesh position={[-0.06, -0.22, 0]} material={matBody}><boxGeometry args={[0.12, 0.28, 0.12]} /></mesh>
        <mesh position={[-0.06, -0.38, 0]} material={matCyan}><sphereGeometry args={[0.053, 10, 10]} /></mesh>
        <mesh position={[-0.06, -0.55, 0.02]} material={matBody}><boxGeometry args={[0.1, 0.28, 0.1]} /></mesh>
        <mesh position={[-0.06, -0.71, 0.02]} material={matDark}><boxGeometry args={[0.09, 0.1, 0.08]} /></mesh>
        <mesh position={[-0.06, -0.79, 0.02]} material={matViolet}><boxGeometry args={[0.07, 0.036, 0.046]} /></mesh>
      </group>

      {/* ── RIGHT ARM ─────────────────────────────────────────────────────── */}
      <group ref={rArmRef} position={[0.425, 1.15, 0]}>
        <mesh material={matViolet}><sphereGeometry args={[0.107, 12, 12]} /></mesh>
        <mesh position={[0.06, -0.22, 0]} material={matBody}><boxGeometry args={[0.12, 0.28, 0.12]} /></mesh>
        <mesh position={[0.06, -0.38, 0]} material={matCyan}><sphereGeometry args={[0.053, 10, 10]} /></mesh>
        <mesh position={[0.06, -0.55, 0.02]} material={matBody}><boxGeometry args={[0.1, 0.28, 0.1]} /></mesh>
        <mesh position={[0.06, -0.71, 0.02]} material={matDark}><boxGeometry args={[0.09, 0.1, 0.08]} /></mesh>
        <mesh position={[0.06, -0.79, 0.02]} material={matAmber}><boxGeometry args={[0.07, 0.036, 0.046]} /></mesh>
      </group>

      {/* ── LEFT LEG ──────────────────────────────────────────────────────── */}
      <group ref={lLegRef} position={[-0.165, 0.52, 0]}>
        <mesh position={[0, 0.04, 0]} material={matAmber}><sphereGeometry args={[0.077, 10, 10]} /></mesh>
        <mesh position={[0, -0.22, 0]} material={matBody}><boxGeometry args={[0.155, 0.35, 0.155]} /></mesh>
        <mesh position={[0, -0.44, 0]} material={matCyan}><sphereGeometry args={[0.059, 10, 10]} /></mesh>
        <mesh position={[0, -0.65, 0]} material={matBody}><boxGeometry args={[0.135, 0.33, 0.14]} /></mesh>
        <mesh position={[0, -0.87, 0.07]} material={matDark}><boxGeometry args={[0.145, 0.09, 0.25]} /></mesh>
        <mesh position={[0, -0.92, 0.07]} material={matAmber}><boxGeometry args={[0.1, 0.02, 0.11]} /></mesh>
      </group>

      {/* ── RIGHT LEG ─────────────────────────────────────────────────────── */}
      <group ref={rLegRef} position={[0.165, 0.52, 0]}>
        <mesh position={[0, 0.04, 0]} material={matAmber}><sphereGeometry args={[0.077, 10, 10]} /></mesh>
        <mesh position={[0, -0.22, 0]} material={matBody}><boxGeometry args={[0.155, 0.35, 0.155]} /></mesh>
        <mesh position={[0, -0.44, 0]} material={matCyan}><sphereGeometry args={[0.059, 10, 10]} /></mesh>
        <mesh position={[0, -0.65, 0]} material={matBody}><boxGeometry args={[0.135, 0.33, 0.14]} /></mesh>
        <mesh position={[0, -0.87, 0.07]} material={matDark}><boxGeometry args={[0.145, 0.09, 0.25]} /></mesh>
        <mesh position={[0, -0.92, 0.07]} material={matViolet}><boxGeometry args={[0.1, 0.02, 0.11]} /></mesh>
      </group>

      {/* ── FLOOR GLOW ────────────────────────────────────────────────────── */}
      <mesh ref={floorRef} position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]} material={matFloorGlow}>
        <ringGeometry args={[0.26, 0.33, 32]} />
      </mesh>
      <mesh position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.33, 0.7, 32]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.07} depthWrite={false} />
      </mesh>

    </group>
  );
}
