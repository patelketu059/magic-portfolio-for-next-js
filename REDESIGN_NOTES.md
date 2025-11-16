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
