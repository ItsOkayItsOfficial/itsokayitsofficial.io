# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary (inferred):** people who look Alex up after meeting him or seeing his name, such as colleagues, peers, and leaders. They arrive curious and stay for a minute at most unless something catches them.
- **Secondary (incumbent evidence):** curious technical visitors who poke around, interact, and open dev tools. The existing console bio was written for them.

## Product Purpose

itsokayitsofficial.io is Alexander (Alex) Pugh's personal site. It is a gentle digital presence, not a showcase of work. It should be subtle, surprising, and engaging in a way the visitor does not expect, while staying as clean and elegant as the current fractal-tree page. Success means a visitor has one small, memorable moment of delight and, through their own curiosity, comes away knowing who Alex is professionally.

## Positioning

A small, hand-built artifact that a template could not copy. The bio is something the visitor discovers through interaction, not something they are handed.

## Operating Context

- Static site served by GitHub Pages from the `quiet` branch (legacy Jekyll build) at the custom domain itsokayitsofficial.io (`CNAME`).
- Design work lands through pull requests into `new_slang`. Alex switches the Pages publish branch himself once he approves a final design (confirmed).
- Visitors reach it from search, LinkedIn, GitHub, and email (inferred), on both desktop and mobile.

## Capabilities and Constraints

- Must run entirely on GitHub Pages with no external services, APIs, backends, analytics, CDNs, or third-party runtime dependencies (confirmed).
- Incumbent code is hand-written vanilla HTML, CSS, and JS with no build step.
- Bio discoverability is **earned**: it surfaces through an interaction on the page. It is neither plainly displayed nor hidden only in the console (confirmed).
- The AI angle is implicit: a machine does the arithmetic and a person signs off on it. The site never says "AI" outside the bio.
- The dev-console easter egg continues: the console prints the bio as a receipt and echoes the tape as it prints.

## Brand Commitments

- Name and domain: "It's Okay It's Official" (IOIO), itsokayitsofficial.io.
- Person: Alexander Pugh (Alex).
- Bio copy is written in first person (confirmed).
- Existing assets, not confirmed as binding: checkmark-in-circle mark (`assets/img/ioio_logo.svg`, `assets/img/ioio_logo.png`) and a wry voice ("known human").

## Evidence on Hand

- Current professional bio, supplied by the user in third person and to be rendered in first person:
  > Alex is director of AI operations for Insight's finance organization. He leads Insight's dedicated "Thundercats" team, with a mandate to pioneer AI adoption across finance and translate AI strategy into measurable business outcomes. His work spans building and deploying AI agents, tracking adoption across hundreds of finance users, and providing thought leadership to the organization at every level.
- Contact links from the incumbent markup: GitHub `https://github.com/ItsOkayItsOfficial`, LinkedIn `https://linkedin.com/in/alexander-pugh/`, email `alexp@itsokayitsofficial.io`.
- Personal material is **professional only** (confirmed). Do not use places lived, hobbies, or the old life-story copy.
- Retire this outdated copy: "robotics developer & known human" (meta description), "Software engineer & known human", and "AI Innovation Advisor to the CFO".
- No photos, case studies, metrics, or testimonials exist. "Hundreds of finance users" is the only quantitative claim. Do not invent team size, outcomes, or adoption numbers.

## Product Principles

1. **Earn, don't announce.** The bio rewards curiosity and is reachable through interaction.
2. **Gentle presence.** A quiet first impression with no self-promotion and no hype.
3. **Surprise through craft.** Delight comes from an unexpected mechanism built with tight, hand-written code.
4. **Self-contained.** Everything ships as static files and nothing phones home.
5. **Professional truth only.** Personal life details stay off the site.

## Accessibility & Inclusion

- The earned bio must still be reachable by keyboard and screen-reader users. Motion-heavy mechanisms must respect `prefers-reduced-motion` (baseline WCAG 2.2 AA).
