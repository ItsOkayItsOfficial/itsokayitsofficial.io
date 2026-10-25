---
name: "It's Okay It's Official"
description: "A working printing calculator on a felt desk blotter: the machine prints the figures, Alex signs off in pencil."
colors:
  ink-red: "#b8322a"
  felt: "#1c3d31"
  paper: "#f7f7f3"
  ink: "#1c1d22"
  graphite: "#4a4e55"
  machine: "#25282c"
  machine-hi: "#30343a"
  key: "#e8e7e2"
  key-lo: "#a3a29b"
  key-ink: "#24272b"
  fn: "#474b51"
  fn-lo: "#2a2d31"
  fn-ink: "#eef0ec"
  lcd: "#9ca894"
  label: "#a7adb4"
typography:
  headline:
    fontFamily: "Pen, Bradley Hand, Segoe Print, cursive"
    fontSize: "28.5px"
    fontWeight: 400
    lineHeight: 1.06
  body:
    fontFamily: "Pen, Bradley Hand, Segoe Print, cursive"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.06
  note:
    fontFamily: "Pen, Bradley Hand, Segoe Print, cursive"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.02
  pencil-action:
    fontFamily: "Pen, Bradley Hand, Segoe Print, cursive"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
  aside:
    fontFamily: "Pen, Bradley Hand, Segoe Print, cursive"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1
  key:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(16px, 2.3vh, 21px)"
    fontWeight: 600
    lineHeight: 1
  key-operator:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(22px, 3vh, 28px)"
    fontWeight: 600
    lineHeight: 1
  brand:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.38em"
  label:
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.22em"
rounded:
  paper: "0px"
  lcd: "7px"
  key: "9px"
  machine: "28px"
spacing:
  teeth: "9px"
  room: "18px"
  kg: "clamp(6px, 1.05vh, 10px)"
  pad: "clamp(16px, 2.3vh, 24px)"
  kh: "clamp(30px, 5.3vh, 50px)"
  kw: "clamp(54px, 15vw, 72px)"
  tape: "clamp(190px, 15vw, 224px)"
components:
  key:
    backgroundColor: "{colors.key}"
    textColor: "{colors.key-ink}"
    typography: "{typography.key}"
    rounded: "{rounded.key}"
    width: "{spacing.kw}"
    height: "{spacing.kh}"
  key-fn:
    backgroundColor: "{colors.fn}"
    textColor: "{colors.fn-ink}"
    typography: "{typography.key}"
    rounded: "{rounded.key}"
    width: "{spacing.kw}"
    height: "{spacing.kh}"
  key-clear:
    backgroundColor: "{colors.fn}"
    textColor: "#ffa594"
    typography: "{typography.key}"
    rounded: "{rounded.key}"
    width: "{spacing.kw}"
    height: "{spacing.kh}"
  key-plus:
    backgroundColor: "{colors.fn}"
    textColor: "{colors.fn-ink}"
    typography: "{typography.key-operator}"
    rounded: "{rounded.key}"
    width: "{spacing.kw}"
  key-total:
    backgroundColor: "{colors.ink-red}"
    textColor: "#fff4ef"
    typography: "{typography.key-operator}"
    rounded: "{rounded.key}"
    width: "{spacing.kw}"
  housing:
    backgroundColor: "{colors.machine}"
    textColor: "{colors.label}"
    rounded: "{rounded.machine}"
  lcd:
    backgroundColor: "{colors.lcd}"
    rounded: "{rounded.lcd}"
    padding: "5px 12px"
    height: "clamp(32px, 5vh, 46px)"
  sound-switch:
    textColor: "{colors.label}"
    typography: "{typography.label}"
  tape:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    width: "{spacing.tape}"
  pencil-note:
    textColor: "{colors.graphite}"
    typography: "{typography.note}"
    padding: "0.2em 16px 0.55em 18px"
  pencil-button:
    textColor: "{colors.graphite}"
    typography: "{typography.pencil-action}"
    padding: "4px 2px"
  pencil-button-hover:
    textColor: "{colors.ink}"
  verso:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.paper}"
    padding: "26px 20px 34px 22px"
  verso-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  verso-link-hover:
    textColor: "{colors.ink-red}"
  skip-scrap:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.paper}"
    padding: "8px 14px 10px"
---

# Design System: It's Okay It's Official

## Overview

**Creative North Star: "The Proof Tape"**

The site is one object on one desk: a graphite IOIO Proof 12 printing calculator under a warm lamp, its single strip of bright bond paper running from the top of the screen down into the print slot, across a bottle-green felt blotter. Nothing is interface chrome. Every surface is a material with a job: felt is the ground, paper carries the record, the housing holds the controls, the LCD reflects, graphite signs off. Every control is either a part of the machine (keycaps, a sound switch, a serrated tear bar) or a word written in pencil on paper.

Two hands make every mark, and they never trade places. The machine prints level, flush-right 5x7 dot-matrix figures through a two-colour ribbon, black for entries and red for subtractions, negatives and errors, and it advances the paper in hard mechanical steps. The person answers in graphite: a script note, a tick beside a total, a double rule under the final one, each set slightly askew and written a word at a time. Density is low and the palette is quiet so that each printed line and each pencil mark lands as an event.

The world refuses the about-me profile card and the generative canvas with a name in the corner. Who Alex is arrives as pencil marginalia on a working tape, and the full note is written on the back of the strip once it is torn off.

**Key Characteristics:**
- One bottle-green felt ground under a single overhead lamp; everything else is a physical object resting on it.
- One accent: ribbon red, owned by the total key and by red print.
- Two voices on fixed media: dot-matrix print and silk-screened Helvetica for the machine, graphite Pen script for the person.
- Square-cut and torn paper edges, softly rounded plastic keys, a housing rounded only at the top.
- Real key travel, a stepped paper feed and a word-by-word pencil, all of which collapse to their end state under reduced motion.

## Colors

A restrained material palette: one bottle-green ground, one sheet of bond paper, warm-neutral plastics and graphite, and a single ribbon red. Every colour is something you could touch on the desk.

### Primary
- **Ribbon Red** (#b8322a): The second colour of the print ribbon and the one red object on the machine. On the tape it prints subtractions, negative figures and the E error; on the housing it is the double-height total key; on the back of the tape it is a link's hover state. Holds 5.54:1 on Bond Paper.

### Neutral
- **Bottle-Green Felt** (#1c3d31): The only page background, also sent to the browser chrome as the theme colour. It is never flat: a warm lamp glow at top centre, a dark vignette and two fractal-noise grain layers give it nap.
- **Bond Paper** (#f7f7f3): The tape, the torn strip, the skip-link scrap and the no-script note. Also the focus-ring colour on the dark machine.
- **Ribbon Black** (#1c1d22): Printed entries, totals, date and time stamps; links on the back of the tape; the hover state of pencil buttons. 15.66:1 on Bond Paper.
- **Pencil Graphite** (#4a4e55): Everything the hand makes: notes, asides, ticks, the double rule, arrows, the back of the tape, pencil buttons, the focus ring on paper. 7.78:1 on Bond Paper.
- **Graphite Housing** (#25282c): The calculator body.
- **Housing Highlight** (#30343a): The lamp catching the housing's top edge, fading into Graphite Housing over the first 22px.
- **Pale Keycap** (#e8e7e2): The thirteen number keys.
- **Keycap Lip** (#a3a29b): The solid 3px lip beneath every pale key.
- **Keycap Legend** (#24272b): Figures on the pale keys. 12.11:1 on the cap.
- **Slate Keycap** (#474b51): The function keys: clear, divide, multiply, minus, plus.
- **Slate Lip** (#2a2d31): The lip beneath every slate key.
- **Slate Legend** (#eef0ec): Symbols on the slate keys. 7.65:1 on the cap.
- **Sage LCD** (#9ca894): The display window. Segments are struck in a near-black green; unlit segments stay faintly visible, as on real glass.
- **Silk-Screen Grey** (#a7adb4): Paint on the housing: the IOIO mark, the model name and the Sound switch label. 6.54:1 on Graphite Housing.

### Named Rules
**The Two-Ribbon Rule.** The print head has exactly two inks. Ribbon Black prints entries, date and time stamps, clears and positive totals; Ribbon Red prints subtractions, negative figures and errors. Red never prints for emphasis.

**The One Red Key Rule.** The total key is the only red cap on the machine. Every other key is pale or slate.

**The Material Ground Rule.** Felt is the only background. Anything placed on it is an object with its own material and its own shadow; nothing floats on the felt as a tinted panel.

## Typography

**Body Font:** Pen, the self-hosted Nanum Pen Script (latin subset, OFL, preloaded, `font-display: swap`) (with Bradley Hand, Segoe Print, cursive)
**Label/Mono Font:** Helvetica Neue (with Helvetica, Arial, sans-serif)
**Print:** 5x7 dot matrix, drawn dot by dot on canvas; it is not a font.

**Character:** A person's quick, narrow pencil hand set against a machine's small, tracked-out silk-screen Helvetica and its dotted ribbon print. The hand is warm and grain-filtered; the machine is exact.

### Hierarchy
- **Headline** (Pen 400, 28.5px, 1.06): "Hi, I'm Alex." on the back of the tape; 1.5 times the body.
- **Body** (Pen 400, 19px, 1.06): The note on the back of the tape, its paragraphs and its links. The measure is the strip's own width, so lines run short.
- **Note** (Pen 400, 19px, 1.02): Pencil notes on the tape. Initials "A.P." sign off right-aligned at about 1.25 times, with a tick.
- **Pencil action** (Pen 400, 18px, 1, 1px underline at 0.2em offset): "Turn over" and "Put down".
- **Aside** (Pen 400, 17px, 1): A one- or two-word gloss in the left margin of a printed line ("today", "last time").
- **Key** (Helvetica Neue 600, clamp(16px, 2.3vh, 21px), 1): Number and function legends.
- **Key operator** (Helvetica Neue 600, clamp(22px, 3vh, 28px), 1): The plus and total legends on the two double-height keys.
- **Brand** (Helvetica Neue 700, 12px, 0.38em tracking): The IOIO wordmark on the maker plate, in a pale grey.
- **Label** (Helvetica Neue 600, 10px, 0.22em tracking, uppercase): The Sound switch. The model name "Proof 12" sets the same way at weight 500.
- **Print** (5x7 dot matrix): Dot pitch is the tape width divided by 136, never below 1.55px; each line is 10.5 pitches tall; dots are 0.5 to 0.58 pitch in radius with ribbon wear (per-dot opacity jitter and the occasional faint dot). Figures are comma-grouped and flush right, ending eight pitches before a symbol column set 16px in from the paper's right edge. Symbols: plus, minus, times, divide, equals, * for a total, # for a date or time stamp, C for a clear.

### Named Rules
**The Two Hands Rule.** The machine speaks in dot-matrix print and Helvetica on the housing; the person speaks in Pen script in graphite. Helvetica never appears on paper, and the pencil never writes on the machine.

**The Grain Rule.** Pencil that is read (notes, asides, ticks, rules, arrows, the back of the tape) passes through the shared graphite filter: fractal-noise displacement plus a paper-tooth mask, so it reads as pencil on fibre rather than a vector line. Pencil that is pressed (links, pencil buttons, the skip scrap) stays crisp.

## Layout

The page is one viewport-high desk that never scrolls: a single centred column of two rows. The tape takes the flexible top row and scrolls inside itself, anchored to the bottom so the newest line always sits at the print slot; above the first line, blank paper runs on to the top edge of the screen until the tape is torn. The machine takes the bottom row and runs off the bottom edge, padded for the device's safe area. The tape overlaps the housing by 12px so the paper visibly enters the slot.

Sizing is physical and fluid instead of breakpoint-driven. The tape width and key width clamp on viewport width; key height, key gap, housing padding, LCD height and the face's row gap clamp on viewport height, so the whole machine fits any phone or desktop screen without scrolling. The housing is exactly four key widths, three key gaps and two pads wide. The face stacks the maker plate and Sound switch on one row, the full-width LCD beneath, then a 4 x 5 keypad: plus spans rows two and three and total spans rows four and five of the right-hand column.

The tape column adds 18px of room on each side of the paper so its shadow and edge curl are never clipped by the scroller. Inside the paper, pencil sits 14 to 18px in from the left edge and the print's symbol column 16px in from the right.

A torn strip rests by a computed rule, not a media query: when at least 20px of felt remains to the left of the housing after a 48px gutter and the strip's width, it lies on the desk to the machine's left; otherwise it lands centred over the machine and offers "Put down". Without JavaScript, the tape and machine are hidden and the note from the back of the tape shows alone as a sheet of paper, min(330px, 88vw) wide, centred on the felt. In print, the tape and its back print as a single 58mm receipt.

## Elevation & Depth

Depth is physical and lit by one warm lamp above the desk: a faint warm radial glow at top centre, a dark vignette toward the edges, and every shadow falling down the screen. Paper casts soft and slightly to the right; the machine casts heavy and straight down. Plastic and glass take inset light: a 1px top highlight on caps and housing, darkness pooling at the top of wells (the LCD, the print slot, the switch track). Paper has no border; its edges come from its drop shadow and a faint inner curl at both sides.

### Shadow Vocabulary
- **Paper drop** (`filter: drop-shadow(1px 7px 9px rgb(0 0 0 / 0.32))`): The tape as a whole.
- **Paper curl** (`box-shadow: inset 7px 0 7px -7px rgb(0 0 0 / 0.09), inset -7px 0 7px -7px rgb(0 0 0 / 0.09)`): The side edges of every tape line.
- **Housing** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.1), 0 0 0 1px rgb(0 0 0 / 0.4), 0 12px 34px rgb(0 0 0 / 0.5)`): The calculator body.
- **Keycap at rest** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.75), inset 0 -2px 0 rgb(0 0 0 / 0.07), 0 3px 0 #a3a29b, 0 5px 9px rgb(0 0 0 / 0.38)`): Pale keys. Slate keys use a 0.14 highlight over their own lip; the total key uses 0.28 over a dark red lip (#741c16).
- **Keycap pressed** (`translate: 0 2px; box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.5), 0 1px 0 #a3a29b, 0 2px 4px rgb(0 0 0 / 0.35)`): Any key while pressed, each over its own lip colour.
- **LCD well** (`box-shadow: inset 0 2px 5px rgb(0 0 0 / 0.5), inset 0 -1px 0 rgb(255 255 255 / 0.18), 0 1px 0 rgb(255 255 255 / 0.06)`): The display window.
- **Print slot** (`box-shadow: inset 0 3px 4px rgb(0 0 0 / 0.9), 0 1px 0 rgb(255 255 255 / 0.07)`): The dark mouth the tape enters.
- **Loose paper** (`box-shadow: 2px 8px 18px rgb(0 0 0 / 0.4)`): The skip-link scrap; the no-script sheet lies a little higher (`2px 12px 30px`), and a torn strip casts a 12px-blurred shadow offset 8px right and 12px down.

### Named Rules
**The Overhead Lamp Rule.** There is one light, above the desk. Every shadow falls down the screen, highlights sit on top edges, and wells darken from the top. A shadow cast upward or sideways belongs to a different lamp.

**The Key Travel Rule.** Every key stands on a solid 3px lip in its own darker shade and travels 2px when pressed, its lip shrinking to 1px, in 70ms. Hover only brightens a key slightly (brightness 1.06), and only on devices that can hover.

## Shapes

Paper is square-cut: zero radius and no border. Torn edges are a zig-zag of 9px teeth, half as deep as they are wide, on the fresh top of the tape after a tear and along the bottom of a torn strip. The tear bar's own serration is finer (7px teeth, 4px deep) and cut into brushed metal that shades from light at the top to dark at the bottom. Plastic is gently rounded: keycaps 9px, the LCD window and the Sound switch's pill track 7px, the switch knob 4px. The housing rounds 28px at its top corners only and runs square off the bottom of the screen. The print slot is a 9px dark well with a 5px-rounded lower lip. Pencil strokes use round caps and joins, at 1.5 for the double rule, 1.8 for arrows and 2.1 for ticks.

**The Level Print Rule.** What the machine makes sits dead level: print, LCD, keys, housing. Only the hand and loose paper tilt: notes between -1.1 and 0.4 degrees, ticks between -9 and 5 degrees, a torn strip at rest between -0.6 and -3.6 degrees.

## Components

### Keys
Tactile, pale and heavy-lipped; the keypad is the page's primary input.
- **Shape:** Gently rounded caps (9px) on a 4-column grid of fluid key width and height; plus and total are double height.
- **Number keys:** Pale Keycap with Keycap Legend at weight 600, and a double-zero key.
- **Function keys:** Slate Keycap with Slate Legend for divide, multiply, minus and plus. The clear key's legend is salmon (#ffa594, 4.62:1 on slate), the machine's traditional warning colour.
- **Total key:** The only red cap: Ribbon Red with a warm-white equals sign and an 8px tracked TOTAL caption beneath it, both at full strength (5.51:1).
- **Hover / Focus / Active:** A slight brightening on hover-capable devices; a 2px Bond Paper focus ring at 3px offset; 2px of travel when pressed (The Key Travel Rule). Physical keyboard input flashes the same pressed state for 110ms, and a clicked key never keeps focus.

### Pencil Buttons
Actions written on paper, not drawn as buttons.
- **Style:** Underlined words in Pen (Pencil action) and Pencil Graphite, with no box, fill or border.
- **Hover / Focus:** Hover darkens to Ribbon Black; focus is a 2px Pencil Graphite ring at 2px offset with 2px corners.
- **Use:** "Turn over" on both faces of a torn strip, "Put down" on its back when it lies over the machine.

### Links
- **Style:** Ribbon Black body text with a 1px underline at 0.2em offset; addresses are written out in full (github.com/ItsOkayItsOfficial, linkedin.com/in/alexander-pugh, the email address) with a line-break opportunity after each domain.
- **Hover / Focus:** Hover turns Ribbon Red; focus is the 2px Pencil Graphite ring.

### Sound Switch
- **Style:** The label "Sound" in Label type beside a 30 x 14px pill well (#121416) holding a 14 x 10px metal knob.
- **State:** Off by default. On, the knob slides 12px right in 180ms on the ease-out curve and turns coral, and the label brightens to near-white.

### Navigation
- **Skip link:** The page's only navigation is a scrap of Bond Paper reading "Skip to Alex's bio" in Pen (21px) and Pencil Graphite. It waits above the viewport and slides in over 200ms when focused, with a 2px Bond Paper ring.

### LCD (Signature)
- **Style:** A Sage LCD window (7px radius, inset well) holding thirteen slanted seven-segment cells drawn on canvas for a twelve-digit display. Lit segments are near-black green at 86%; unlit segments remain as a 5.5% ghost. The decimal point stays lit after the last digit when none is entered, as on a real adding machine.

### Tape (Signature)
- **Style:** A Bond Paper column at the tape width, one canvas per printed line, set in Print.
- **Behaviour:** Each new line feeds the paper up in discrete steps (about 7px per step at 24ms, never a glide) while the head strikes column by column from left to right (140ms plus 1.6ms per dot, at most 420ms). A total earns a pencil tick in the left margin 160ms after it prints; the final sign-off adds an accountant's double rule under the figure and the initials "A.P.". Pencil notes are revealed a word at a time, 38ms per character with 60ms between words.

### Tear Bar and Torn Strip (Signature)
- **Tear bar:** A serrated metal bar across the print slot; it is the button that reveals the bio. Hover lifts its teeth 1px; focus is a 2px Bond Paper ring.
- **Torn strip:** Tearing flies the strip to its resting place over 1150ms while it turns over to its back. The back carries the note, with the printing ghosted through the thin paper (mirrored, 7.5% opacity). Turning over again takes 760ms on the ease-out curve; putting it down sends it off the left edge in 650ms.

## Do's and Don'ts

### Do:
- **Do** keep Bottle-Green Felt (#1c3d31) as the only background, with its lamp glow, vignette and grain.
- **Do** print machine output only as 5x7 dot matrix in Ribbon Black or Ribbon Red, flush right, with its symbol in the last column.
- **Do** write the person's voice in Pen and Pencil Graphite, and draw new pencil marks as round-capped strokes through the graphite filter.
- **Do** make every new control a machine part (keycap, switch, tear bar) or an underlined pencil word on paper.
- **Do** use a 2px Bond Paper focus ring on the machine and a 2px Pencil Graphite ring on paper.
- **Do** keep every keycap legend at 4.5:1 or better against its cap.
- **Do** deliver the end state at once under reduced motion: lines already printed, notes already written, ticks already drawn, a torn strip already at rest.

### Don't:
- **Don't** introduce a new hue; every colour is a desk material or the ribbon's red.
- **Don't** add a second red cap to the machine, or print in red for emphasis.
- **Don't** round, border or tint paper; its edges are cut square or torn into 9px teeth.
- **Don't** set Helvetica on paper or Pen on the machine.
- **Don't** imitate the dot matrix on the page with a monospace or pixel webfont.
- **Don't** feed the tape smoothly; it advances in steps.
- **Don't** present the bio as a profile card or sign a generative canvas with a name in the corner; the bio is pencil on the back of a torn tape.
- **Don't** use brand icons or logos for links; write the addresses out.
- **Don't** use pure white or pure black as an on-screen surface or text colour.
