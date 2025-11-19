# Portfolio Redesign - Mitchell Sparrow Style

## Overview
This portfolio has been completely redesigned to match the style and structure of [mitchellsparrow.com](https://www.mitchellsparrow.com/), featuring a clean, modern single-page layout with smooth scrolling sections.

## Key Features Implemented

### 1. **Hero Section**
- Full-screen landing with typing animation effect ("Hi, the name's Ketu")
- Animated cursor effect using custom TypingAnimation component
- Role subtitle ("AI/ML Engineer")
- Centered layout with dramatic entrance

### 2. **Section-Based Navigation**
- Side navigation bar (right side on desktop) with anchor links
- Sections: ABOUT, EXPERIENCE, SKILLS, PROJECTS, CONTACT
- Smooth scroll behavior between sections
- Each section takes up significant viewport space for focused content

### 3. **About Section**
- Side-by-side layout: image on left, bio text on right
- Clean "Here is a little background" heading
- Personal introduction with professional summary
- Responsive: stacks vertically on mobile

### 4. **Experience Section**
- Timeline-style layout with clean typography
- Each role displays:
  - Role title (prominent heading)
  - Company name (brand-colored)
  - Timeframe (uppercase, subtle)
  - Bullet-pointed achievements
- Minimal, easy-to-scan design

### 5. **Skills Section**
- Interactive grid of skill badges
- Hover effect reveals proficiency percentage in a tooltip
- "HOVER OVER A SKILL FOR CURRENT PROFICIENCY" instruction
- 18 skills covering Python, JavaScript, ML/AI, Cloud, etc.
- Smooth hover animations and transitions

### 6. **Projects Section**
- Numbered project cards (Project 1, Project 2, etc.)
- Clean heading + description format
- 4 featured projects:
  1. AI Image Generation
  2. Neural Machine Translation
  3. Portfolio Website (self-referential)
  4. Autonomous Vehicle Mapping

### 7. **Contact Section**
- Simple, direct contact information
- "I have got just what you need. Let's talk." heading
- Email and location displayed
- Social media buttons for quick access

### 8. **Header & Footer**
- **Header**: Minimal design with role on left, theme toggle on right
- **Footer**: Dark background with centered social icons and copyright
- Removed complex navigation menu for cleaner look

## Technical Implementation

### New Components
- `TypingAnimation.tsx`: Custom typing effect with blinking cursor
- Updated `page.tsx`: Complete single-page redesign
- Modified `Header.tsx`: Simplified header
- Redesigned `Footer.tsx`: Centered social links layout

### Styling Updates
- `custom.css`: Added smooth scrolling, custom scrollbar, hover effects
- Scroll-margin-top for proper anchor navigation
- Responsive breakpoints maintained
- Clean transitions and animations throughout

### Layout Changes
- Changed from multi-page to single-page application structure
- Full viewport sections for immersive experience
- Removed blog/gallery routes (can be re-enabled if needed)
- Side navigation instead of top navigation

## Color Scheme
- Maintained existing Once UI color tokens
- Clean typography with proper hierarchy
- Brand color (cyan) used for accents
- Neutral grays for backgrounds and text

## Responsive Design
- Side navigation hidden on mobile/tablet
- Sections stack appropriately on smaller screens
- Skills grid adapts to available width
- All content remains accessible and readable

## How to Run
```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` to see the redesigned portfolio.

## Future Enhancements (Optional)
- Add parallax effects on scroll
- Implement contact form functionality
- Add animations on scroll (Framer Motion)
- Create case study pages for projects
- Add testimonials section
- Integrate blog if needed

## Notes
- The design emphasizes clean typography and whitespace
- Each section is designed to be self-contained and scannable
- Smooth scrolling creates a cohesive browsing experience
- The typing animation adds personality to the hero section
- Interactive elements (skills hover) increase engagement

## Recent Changes (responsive layout & image handling)

These notes summarize small but important updates made to improve responsiveness and how project images are displayed across pages.

- Added a responsive horizontal gutter variable in `src/resources/custom.css`:
  - `--gutter-horizontal: clamp(0.75rem, 3.5vw, 2rem);`
  - This variable is used as the primary horizontal padding for `.site-container` and other containers so gutters scale with viewport size.

- Updated `src/app/home.module.css`:
  - Replaced fixed small-screen paddings (e.g. `0 16px`) with `padding: 0 var(--gutter-horizontal)` so section content and hero inner gutters are consistent across breakpoints.
  - Made `#contact` top padding responsive (was `28px`, now `clamp(1.75rem, 4vh, 3rem)`).
  - Converted card padding (e.g. `.institution`) to responsive `clamp()` values.
  - `.projectArticle` media rules now center images by default and constrain them with a responsive `max-width`:
    - images/videos/pictures use `margin: 0.75rem auto; width: 100%; max-width: clamp(420px, 75vw, 1200px); object-fit: contain;`.

- Project pages (`src/app/work/[slug]/page.tsx`):
  - Added responsive top padding to the project page container: `padding: clamp(1.5rem, 4vw, 3rem) var(--gutter-horizontal)` so pages have breathing room on load.
  - Implemented an opt-in modifier class for pages that should let images span and center relative to the full viewport: `projectArticle page-wide-images`.
    - The per-page slug list currently includes: `AI-image-generation` and `Neural-Machine-Translation`.
    - The `.page-wide-images` style expands the article to `width: 100vw` and recenters it (`margin-left: calc(50% - 50vw)`), while maintaining `--gutter-horizontal` on both sides. On small screens the modifier falls back to normal flow to avoid horizontal scroll.

- MDX image component (`src/components/mdx.tsx`):
  - The MDX image renderer already supports responsive sizing via props (`size`, `sizeMobile`, `sizeTablet`, `sizeDesktop`, `widthPercent`) and a `fullPage` flag that renders an image using viewport width units (vw).
  - If you want a particular MDX image to span the viewport and be centered, use the MDX image `fullPage` prop or leave the image in the page that has the `page-wide-images` modifier.

## How to opt-in / add more pages

- To make more project pages allow viewport-centered images, add the page slug to the `wideImageSlugs` array in `src/app/work/[slug]/page.tsx`:

```ts
const wideImageSlugs = [
  "AI-image-generation",
  "Neural-Machine-Translation",
  // add other project slugs here
];
```

- Or, in MDX you can make an image full-viewport by using the `fullPage` prop on the `Image` component used in MDX (the site maps `<img>`/`Image` tags to a helper that supports this prop).

## Testing locally

Run the dev server and review these pages at several breakpoints (desktop, tablet, mobile).

Windows PowerShell commands:
```powershell
npm install; npm run dev
```

Visit the project pages (example):
- `http://localhost:3000/work/AI-image-generation`
- `http://localhost:3000/work/Neural-Machine-Translation`

Check that:
- Images are horizontally centered relative to the page when the slug is opted-in.
- Images scale responsively and never cause horizontal overflow on small screens.
- The page header spacing (top padding) matches expectations across breakpoints.

## Notes for future work

- Consider adding a frontmatter flag in MDX (e.g. `pageWideImages: true`) so authors can control image breakout on a per-file basis without changing code.
- Optionally, automatically set `fullPage` in the MDX image helper when a file-level frontmatter flag exists.
- Run `npm run biome-write` after edits to keep formatting consistent.
