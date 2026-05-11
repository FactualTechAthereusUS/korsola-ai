# **Edit any video with** *a sentence***.**— Scroll-Pinned Cinematic Scene

Replace the static `LpPromptBox` section on `/landingpage` with a 600vh scroll-pinned scene that plays a short cinematic story: video plays full-bleed → shrinks into a Korsola prompt bar as an attachment → cursor types a prompt → clicks Generate → loading state → final generated video scales out to full-bleed.  
  
(with our marope anf playfair font ,and congruent dark and white theme across sections)

## Visual story (mapped to scroll progress 0 → 1)

```
ACT I    0.00 – 0.16    Video 1 fills the screen, autoplays muted, big white H1 above
ACT II   0.16 – 0.30    Video 1 scales 1 → 0.18, slides down + lands as attachment chip
                         inside the PromptBar (which fades up from below the heading)
ACT III  0.30 – 0.44    Chanel product image flies in from the right with a fake cursor,
                         drops into the PromptBar attachment row next to Video 1
ACT IV   0.44 – 0.60    Cursor moves to the textarea. Typewriter writes the prompt:
                         "Swap the lipstick for this Chanel necklace, keep the same
                          actor, same lighting, same beat."
ACT V    0.60 – 0.66    Cursor clicks the gradient Generate button.
                         isGenerating latches on (time-based, ~2.0s) — scroll is
                         "absorbed" via a sticky guard, so the user can't scroll past
                         until the spinner finishes.
ACT VI   0.66 – 0.88    Video 3 (the "generated" result) crossfades on top of the bar
                         and scales 0.18 → 1.0 from the bar's center, autoplays
ACT VII  0.88 – 1.00    Heading + bar fade out, scene unpins, page continues
```

## Layout

- Outer section: `h-[600vh]` with a `sticky top-0 h-screen` inner stage
- Background: same `bg-bone` paper as today (white)
- Heading sits at top, locked in place: **"Edit any video with a sentence."** (font-display, italic serif on "a sentence")
- Video 1 + PromptBar + Video 3 are absolutely positioned inside the stage and animated via Framer Motion `useTransform` from `scrollYProgress`

## Components to reuse / build

### Reuse (no copy-paste, no business logic)

- **PromptBar look** — replicate the `ms-glass` shell, attachment chip row, textarea, and bottom toolbar from `src/components/marketingstudio/PromptBar.tsx`. We do **not** mount the real component (it pulls Supabase, modals, store). New `PromptBarMock.tsx` matches the visual classes only.
- **Generate button** — reuse the exact gradient CTA markup from `LpHero.tsx` lines 57-64 (purple gradient + sparkles). Extract into `LpGradientCTA.tsx` so Hero and the new scene share one button.

### New files

```
src/components/marketing/lp/edit-scene/
  LpEditScene.tsx              ← outer 600vh + sticky stage + scroll mapping
  PromptBarMock.tsx            ← visual replica of MS PromptBar (no logic)
  AttachmentChip.tsx           ← inline thumb chip (Video 1, Chanel image)
  FakeCursor.tsx               ← absolutely-positioned animated SVG cursor
  GeneratingOverlay.tsx        ← spinner + "Generating…" pill
  Typewriter.tsx               ← char-by-char writer driven by scrollYProgress
  useEditSceneTimeline.ts      ← scroll → motion-value mapping + latching state
  scene-assets.ts              ← video/image src constants

src/components/marketing/lp/LpGradientCTA.tsx   ← extracted hero gradient button
```

### Files to edit

- `src/pages/Landingpage.tsx` — swap `<LpPromptBox />` for `<LpEditScene />`
- `src/components/marketing/lp/LpHero.tsx` — replace inline gradient anchor with `<LpGradientCTA href="/shopify">Create Your AI Ad</LpGradientCTA>`
- `src/components/marketing/lp/LpPromptBox.tsx` — delete (no longer used)

## Animation details (technical)

- **Scroll input**: Lenis is already global on `/landingpage`. Framer Motion's `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` reads the smoothed scroll and returns `scrollYProgress` (0→1).
- **All animations DOM-level** via `useTransform` + optional `useSpring({ stiffness: 120, damping: 22 })` so we never trigger React re-renders during scroll.
- **Per-element mappings**:
  - Video 1: `scale = useTransform(p, [0, 0.16, 0.30], [1, 1, 0.18])`, `y = [0, 0, 220]`, `borderRadius = [0, 0, 16]`
  - PromptBar: `opacity = [0, 0, 1]` over `[0.14, 0.18, 0.30]`, `y = [40, 40, 0]`
  - Chanel chip + cursor: `x = useTransform(p, [0.30, 0.42], [600, 0])`, fade in
  - Typewriter: `charCount = useTransform(p, [0.46, 0.60], [0, fullText.length])`, then `Math.round` → slice the string each frame
  - Cursor click → Generate: `useMotionValueEvent(p, "change", v => { if (v >= 0.60 && !latched) setIsGenerating(true) })` — once latched, `setTimeout(() => setIsComplete(true), 2000)` flips state and unlocks Act VI
  - Video 3: mounts only when `p > 0.50`, `scale = [0.18, 1]` over `[0.66, 0.88]`, `opacity = [0, 1]` over `[0.66, 0.74]`
- **Pinned-and-paused trick during the 2s generation**: scroll keeps progressing, but Video 3's reveal is gated by `isComplete`, so the spinner is visible long enough even on a fast scroll. (Alternative: tiny `ScrollControls`-style pause via `lenis.stop()` for 1.5s — we'll prefer the gated reveal for safety.)
- **Mobile (< 768px)**: collapse to a static `Reveal`-animated card showing Video 1 → arrow → Video 3, plus a "Watch demo" tap that plays the timeline on a JS-driven loop. Pinning at 600vh on mobile is jittery and eats battery.
- **Reduced motion** (`useReducedMotion`): render the final state only — heading + prompt bar + Video 3 still + caption.

## Assets needed

Place in `src/assets/lp/edit-scene/`:

- `video1.mp4` — 6s vertical UGC clip of an actor with a YSL lipstick (or any product)
- `video3.mp4` — 6s vertical UGC clip of the same actor with a Chanel necklace (the "generated" result)
- `chanel.jpg` — square product photo of the Chanel necklace

If you don't have these yet, we'll temporarily borrow two clips from `LpReelCarousel`'s `reels.ts` and a placeholder product image, then swap when you upload the real ones. Both videos use `preload="metadata"`, `muted`, `playsInline`, `loop`.

## Performance notes

- Video 3 is `<video preload="none">` until `p > 0.50`, then we set `preload="auto"` and call `.play()`
- All transforms use `transform` + `opacity` only (GPU-accelerated, no layout thrash)
- `will-change: transform` only on actively-animating elements during their act window (toggled via class)
- Image and videos are lazy-mounted using the existing `useInView` hook for elements outside the active act

## What you'll see when it ships

Smooth, satisfying scroll-controlled story: scroll down → video plays → tucks itself into the prompt bar → image lands → cursor types → Generate → spinner → new video blooms out to full screen. Scroll back up reverses everything (Acts I–IV are fully scroll-bound; Acts V–VI use the latch but reset cleanly when `p < 0.55`).

---

Open questions before I build:

1. **Video files** — upload `video1.mp4` (lipstick UGC) + `video3.mp4` (Chanel necklace UGC) + `chanel.jpg`, or should I wire it up with placeholders from `LpReelCarousel` first and you swap later?
2. **Heading copy** — keep "Edit any video with a sentence." (current) or change to something punchier like "Remix any ad. In one sentence."?
3. **Prompt text** — the typewriter line. Default: *"Swap the lipstick for this Chanel necklace, keep the same actor, same lighting, same beat."* — keep, edit, or send your own?