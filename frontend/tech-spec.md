# Tech Spec — Kamronbek Jumanov Portfolio

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.0 | Framework (App Router) |
| react | ^19.0 | UI library |
| react-dom | ^19.0 | React DOM renderer |
| typescript | ^5.7 | Type safety |
| tailwindcss | ^4.0 | Utility-first CSS |
| @tailwindcss/postcss | ^4.0 | PostCSS integration for Next.js |
| three | ^0.170 | 3D engine (raw, for types and post-processing) |
| @react-three/fiber | ^9.0 | React renderer for Three.js |
| @react-three/drei | ^9.0 | R3F helpers (OrbitControls, useGLTF, Environment, etc.) |
| gsap | ^3.12 | Animation engine + ScrollTrigger plugin |
| lenis | ^1.2 | Smooth scroll with inertia |
| framer-motion | ^11.0 | Declarative hover animations + AnimatePresence |
| lucide-react | ^0.468 | Social and UI icons |
| @types/three | ^0.170 | Three.js type definitions |
| @fontsource-variable/rajdhani | latest | Display font (weights 300–700) |
| @fontsource-variable/inter | latest | Body font (weights 300–500) |

**Dev rationale:**
- **GSAP + ScrollTrigger** over Framer Motion's `whileInView` because the design requires precise stagger orchestration, bracket slide animations, and sequenced timelines (loading screen → hero entrance) that are more naturally expressed as GSAP timelines.
- **Lenis** over native `scroll-behavior: smooth` because the design calls for "buttery-smooth scrolling" with configurable inertia (1.2s duration, exponential ease-out).
- **Framer Motion** is retained for hover effects and `AnimatePresence` (loading screen exit) — simpler than wiring GSAP to React pointer events.
- **Raw Three.js** alongside R3F because the post-processing stack (Bloom, Film, ChromaticAberration, Vignette) requires `@react-three/postprocessing` which depends on raw Three.js effect composers.

---

## Component Inventory

### Layout (shared)

| Component | Source | Notes |
|-----------|--------|-------|
| `LoadingScreen` | Custom | Full-screen overlay with typed "INITIALIZING..." + percentage counter. Controls the app entry sequence (GSAP timeline). Fades out via `AnimatePresence`. |
| `SmoothScrollProvider` | Custom | Wraps app with Lenis instance. Provides `lenis` ref to children for scroll-to and scroll-lock during loading. |
| `GridPatternOverlay` | Custom | SVG grid lines at `rgba(0, 212, 255, 0.05)`. Applied as fixed or section-level background overlay. |

### Sections (page-level, one instance each)

| Component | Source | Notes |
|-----------|--------|-------|
| `HeroSection` | Custom | Full viewport. Renders `HolographicScene` as background canvas. Content overlay: name, role, social links, scroll indicator. Orchestrates entrance timeline after loading exit. |
| `AboutSection` | Custom | Two-column grid (photo + bio). Bracket label, scroll-triggered reveal. |
| `ExperienceSection` | Custom | Vertical timeline of 4 `TimelineCard` items. Staggered scroll reveal. |
| `EducationSection` | Custom | Vertical timeline of 3 `TimelineCard` items. Same pattern as Experience. |
| `SkillsSection` | Custom | 4-column category grid. Each column contains `SkillTag` pills. |
| `ProjectsSection` | Custom | 2-column grid of `ProjectCard` items. |
| `CertificationsSection` | Custom | 3-column grid of `CertCard` items. |
| `ContactSection` | Custom | Renders `HolographicTerminal`. |
| `FooterSection` | Custom | Minimal copyright text. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| `SectionLabel` | Custom | All sections except Footer. Renders `[ LABEL ]` with pink/blue bracket colors. GSAP bracket slide-in animation. |
| `GlassmorphismCard` | Custom | `TimelineCard`, `ProjectCard`, `CertCard`. Base card with backdrop-blur, semi-transparent bg, blue border. Hover glow + translateY lift via Framer Motion. |
| `TimelineCard` | Custom | ExperienceSection, EducationSection. Extends `GlassmorphismCard` with logo + role/company/date/description layout. |
| `ProjectCard` | Custom | ProjectsSection. Extends `GlassmorphismCard` with image (16:9), title, description, tech pills, icon links. |
| `CertCard` | Custom | CertificationsSection. Compact glass card with issuer logo, title, date, verify button. |
| `SkillTag` | Custom | SkillsSection. Glassmorphism pill with tech icon + label. Hover brightens background/border. |
| `HolographicTerminal` | Custom | ContactSection. Terminal window with animated border gradient, scanline overlay, typed welcome message, clickable commands, typed responses, blinking cursor. |
| `SocialLinks` | Custom | HeroSection. 4 circular icon buttons (LinkedIn, GitHub, Telegram, Email). |
| `ScrollIndicator` | Custom | HeroSection. "SCROLL DOWN" text with continuous bounce animation. |
| `HolographicScene` | Custom | HeroSection. R3F `<Canvas>` containing robot model, platform, particles, lighting, post-processing effects, mouse-driven head tracking. |

### Hooks

| Hook | Purpose |
|------|---------|
| `useTypewriter` | Character-by-character typing with configurable speed, blinking cursor (530ms), optional auto-hide cursor after delay. Returns `{ displayText, showCursor, isComplete }`. |
| `useMousePosition` | Normalized mouse position (-1 to 1) for 3D head tracking. Lerp interpolation configurable. |
| `useScrollReveal` | Wraps GSAP ScrollTrigger setup for standard section reveal (fade + slideUp + stagger). Accepts ref and config options. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Loading screen typewriter + counter | GSAP timeline | `useTypewriter` for "INITIALIZING...", GSAP tween for 0→100 counter. Timeline sequences them, then fades overlay via `AnimatePresence`. | Medium |
| Hero name typewriter (60ms/char) | `useTypewriter` hook | Sequential character reveal with gradient text. Glitch layers (2px offset duplicates in cyan/pink) rendered as absolutely positioned pseudo-elements. Pulsing glow via CSS keyframe on text-shadow opacity. | High |
| Hero role typewriter (40ms/char) | `useTypewriter` hook | Chained after name completes. Cursor blinks 3s then fades. | Low |
| Social links stagger fade-in | GSAP | `gsap.to` with stagger 0.1s, triggered after role typing completes. | Low |
| 3D holographic scene (robot + environment) | R3F + Three.js | `<Canvas>` with custom `HolographicScene` component. `useGLTF` for robot model. `useFrame` for idle float (sine translateY), particle drift, holographic opacity pulse. `OrbitControls` with damping, limited angles. `useMousePosition` for head tracking lerp. | **🔒 High** |
| 3D post-processing (Bloom, Film, ChromaticAberration, Vignette) | `@react-three/postprocessing` | `EffectComposer` wrapping the scene. Bloom threshold 0.8/strength 0.6. Film opacity 0.05. ChromaticAberration offset 0.001. Vignette darkness 0.3. | **🔒 High** |
| Scroll indicator bounce | CSS keyframes | `translateY` oscillation 0→8px, 2s, sine.inOut, infinite. Pure CSS — no JS needed. | Low |
| Section label bracket slide-in | GSAP + ScrollTrigger | Left bracket slides from `translateX(-20px)`, right from `translateX(20px)`, text fades in. `useScrollReveal` variant. | Medium |
| Standard section reveal (fade + slideUp) | GSAP + ScrollTrigger | `useScrollReveal` hook: opacity 0→1, translateY 50→0, 0.8s, power3.out, stagger 0.1–0.2s. Trigger at 80% viewport. Applied to all sections. | Low |
| About photo slide from left + bio from right | GSAP + ScrollTrigger | Photo: translateX -50→0. Bio: translateX 50→0 with 0.2s delay. Both fade in. | Low |
| Experience/Education timeline stagger | GSAP + ScrollTrigger | Each `TimelineCard` fades in + slides up (translateY 50→0). Stagger 0.15s between items. | Low |
| Skills category stagger + tag stagger | GSAP + ScrollTrigger | Columns stagger 0.15s left-to-right. Within each column, tags stagger 0.05s. Nested stagger timeline. | Medium |
| Project cards diagonal stagger | GSAP + ScrollTrigger | 2-column grid: cards fade in + slide up. Stagger 0.2s in reading order (diagonal feel via GSAP's stagger `from` option). Image hover scale 1.05 contained within overflow-hidden wrapper. | Medium |
| Certificate cards scale reveal | GSAP + ScrollTrigger | Each card: scale 0.9→1, opacity 0→1. Stagger 0.1s. | Low |
| Contact terminal reveal + typewriter | GSAP + ScrollTrigger + `useTypewriter` | Terminal container fades in + slides up (translateY 40→0). Welcome message types out. Command list fades in after. | Medium |
| Terminal holographic border rotation | CSS keyframes | `background-position` animation on pseudo-element, 4s linear infinite. Gradient: cyan→violet→pink→cyan. | Low |
| Terminal command click → typed response | `useTypewriter` hook | Command name types at prompt (30ms/char), 300ms pause, response types out. Link appears after typing completes. | Medium |
| Glassmorphism card hover (lift + glow) | Framer Motion | `whileHover={{ y: -4, boxShadow: '...' }}` with spring transition. Border color transition via Tailwind `group-hover`. | Low |
| Social link hover | Framer Motion | `whileHover={{ scale: 1.05 }}` + Tailwind for background/border color shift. | Low |
| Smooth scrolling | Lenis | `SmoothScrollProvider` initializes Lenis with duration 1.2, exponential ease-out. Integrated with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. | Low |
| Reduced motion support | CSS + JS | `prefers-reduced-motion` media query disables CSS animations. Hook checks the media query and sets flags: typing shows instantly, 3D auto-rotate disabled, scroll reveals become simple fades. | Low |

---

## State & Logic Plan

### Loading → Hero Orchestration (App-level state machine)

The page load follows a strict sequence: loading screen → 3D init → loading exit → hero entrance. This requires coordinated state across `LoadingScreen`, `HolographicScene`, and `HeroSection`.

**Approach:** Centralized state in a custom `useLoadingSequence` hook at the app root (or React context). The hook manages:
1. `phase`: `'loading' | 'ready' | 'exited'` — controls what animates when.
2. `progress` (0–100) — driven by 3D scene `onCreated` callback + synthetic delay.
3. When `progress === 100` and 3D scene reports ready, phase transitions to `'ready'`.
4. `LoadingScreen` watches `phase`: on `'ready'`, triggers GSAP exit timeline (600ms fade). On complete, sets `'exited'`.
5. `HeroSection` watches `phase`: on `'exited'`, starts the hero entrance GSAP timeline (name type → role type → socials fade → scroll indicator).

**Why not just local state:** The sequence spans three independent components. A shared hook/context prevents prop drilling and keeps timing deterministic.

### HolographicTerminal Command State

The terminal maintains a small state machine for active commands:
- `activeCommand: string | null` — which command is currently being processed.
- `responseText: string` — the typed response for the active command.
- `isTyping: boolean` — blocks new commands while typing.

On command click: set `activeCommand`, type the command name, pause, type the response. `useTypewriter`'s `isComplete` flag triggers the link reveal. This is local state within `HolographicTerminal` — no external sharing needed.

---

## Other Key Decisions

### Three.js Lazy Loading

The entire `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` dependency tree is loaded dynamically via `next/dynamic` with `ssr: false`. The `HolographicScene` component is wrapped in a `<Suspense>` boundary that shows a dark placeholder. This keeps the initial JS bundle small and allows the 2D content (sections below hero) to render immediately while the 3D scene initializes in parallel.

### 3D Model Sourcing

The design specifies a low-poly robot GLB model (~15K polygons). Since no pre-made asset is provided, the project will use a **procedurally generated robot** built from Three.js primitives (Box, Cylinder, Sphere) assembled as a Group with a simple bone hierarchy. This avoids external asset dependencies, keeps bundle size controlled, and allows full programmatic control over the holographic wireframe overlay and emissive materials. The robot will be extracted into a self-contained `RobotCharacter.tsx` component.

### Font Loading Strategy

Both font packages (`@fontsource-variable/rajdhani`, `@fontsource-variable/inter`) are imported in the root layout. Variable fonts are used to reduce the number of font files (one file per family covers all weights). `font-display: swap` is set via the fontsource CSS to prevent FOIT.

### Image Assets

All project screenshots, logos, and the about photo are static images served from `/public/assets/`. The design specifies 14 image assets total. On build, these should be optimized to WebP with responsive `srcset` for the about photo and project screenshots (the largest images).
