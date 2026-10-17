<!--
De-AI audit — 2026-07-04

Went through the whole site (copy, animation, layout, icons, glow effects,
fonts) looking for the tells that make a site read as AI-generated /
templated rather than built by a person. Summary of what changed and why:

- COPY: audited every project page, the bio, section headings, and image
  alt text against a list of AI-buzzword filler ("leverage", "seamless",
  "cutting-edge", "journey", etc). Found none in the live site — the
  existing project write-ups were already first-person and specific. Two
  matches only turned up in essays/ (difficulty.md, igniting.md), which are
  unlinked Techfolio starter-kit template pages, not part of the live nav
  or homepage — left untouched since they're invisible to visitors, but
  worth deleting outright if you ever want them gone for good.

- ANIMATION: removed every "elements cascade in one-by-one as you scroll"
  effect — the section fade-up, the per-card/per-tile stagger, the footer
  tile stagger, the badge/pill stagger, and the word-by-word heading
  reveal. Also removed the two infinite CSS keyframe loops (the pulsing
  hero status dot, the bouncing scroll-cue dot) — the "floating/bobbing"
  pattern. Kept: Lenis smooth scroll, the hero background parallax, and
  the scroll-cue show/hide, since none of those are the cascading-reveal
  or floating-loop patterns and removing them would have changed the feel
  more than asked. All content now renders at full opacity immediately;
  nothing depends on JS/scroll position to become visible.

- LAYOUT: checked for the "everything is a centered, identical card grid"
  tell. Didn't find it — the hero is already an asymmetric two-column,
  left-aligned layout; the home-lab section is already a bento grid with
  three different tile sizes; every section heading is left-aligned, not
  centered. No structural changes made here; manufacturing asymmetry where
  none was needed would have been change for its own sake.

- ICONS: single library (Bootstrap Icons), and every icon used (download,
  envelope, file-earmark-text, clipboard, github, linkedin, medium) maps
  directly to what it labels. No generic rocket/sparkle/shield filler
  icons found, so nothing to replace.

- GLOW / GLASSMORPHISM: removed backdrop-filter blur from the navbar and
  mobile menu (now solid dark backgrounds with a plain border). Removed
  the spread box-shadow glows on hover (connect tiles, hero buttons) and
  replaced them with a plain border-color change to the accent colour —
  the accent-tinted 2px border on the Resume/Email tiles (the two tiles
  meant to stand out) stays, since that's exactly the "one or two most
  important elements" case, but it's a static border, not a glow.

- HOVER TIMING: every hover transition (bento tiles, connect tiles,
  buttons, nav, writing list arrows) was 300–600ms; all tightened to
  200ms so interactions feel immediate rather than like a slow-motion
  product demo.

- FONT: swapped the heading font from Sora to Cabinet Grotesk (Fontshare,
  free). Sora isn't literally on the "Inter/Poppins/Space Grotesk" list
  but it's the same category of geometric-grotesque template default and
  reads the same way. Body text stays on Inter — it's plain, readable,
  and not the thing doing the "AI portfolio" signalling on its own.

Not touched: the dark palette, the teal accent colour itself, the bento
grid concept, Lenis smooth scroll, or any actual project content beyond
the copy audit above.
-->
