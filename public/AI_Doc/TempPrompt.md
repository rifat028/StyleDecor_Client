# Prompt: Modern Hero Banner Component (Programming Hero Inspired)

## Goal
Design and implement a modern, responsive, and visually compelling Hero Banner component (`src/features/home/components/Banner.jsx`) for the DecorCraft marketplace, inspired by the sleek, high-converting layout of modern tech platforms (like Programming Hero).

## Placement & Architecture
- **File Location:** `src/features/home/components/Banner.jsx`
- **Imports:** Lucide-React icons, React Router `Link`, and Tailwind CSS styling.

## Key Visual & Structural Elements

### 1. Left Side: Value Proposition & Interactive Search Widget (60% Desktop)
- **Top Pill Badge:** An glowing/subtle pill badge at the top: `✨ #1 Multi-Vendor Event Decoration Marketplace`.
- **Primary Headline (H1):** Bold, impactful typography: "Transform Your Events Into **Unforgettable Memories**" with gradient text effect on "Unforgettable Memories".
- **Subheadline:** Clear tagline explaining value—booking verified local event decorators for Weddings, Birthdays, and Corporate events with transparent pricing.
- **Interactive Search Card (Core Interactive Feature):**
  - A clean floating white card containing:
    1. Event Type Selector Dropdown (Wedding, Birthday, Haldi/Mehendi, Corporate)
    2. City/Location Dropdown (Dhaka, Chittagong, Sylhet, etc.)
    3. Prominent Search CTA Button ("Search Decorators" with search icon and hover animation).
- **Social Proof Counters:** Horizontal stat counters below the search bar:
  - `500+` Verified Decorators | `12k+` Events Decorated | `4.9/5` Rating.

### 2. Right Side: Interactive Hero Showcase & Floating Glass Badges (40% Desktop)
- **Main Hero Visual:** High-resolution event setup image with rounded corners (`rounded-3xl`) and deep drop shadows (`shadow-2xl`).
- **Floating Glassmorphism Badges (3D Overlay Effect):**
  - **Badge 1 (Top Left):** `⭐ 4.9/5 Rating` (1.2k+ Reviews) with glassmorphism blur (`backdrop-blur-md bg-white/80`).
  - **Badge 2 (Bottom Right):** `🎉 50+ Bookings Today` or `✅ Instant Slot Booking`.

## Design Requirements
- **Color Palette:** Slate background (`bg-slate-50`), Amber/Rose primary accent colors (`amber-600` / `rose-600`), and dark slate text (`text-slate-900`).
- **Responsiveness:** Single-column layout on mobile, 2-column grid on `lg:` screens.
- **Icons:** Use `lucide-react` icons (`Search`, `MapPin`, `Calendar`, `Star`, `CheckCircle`).

## Expected Output
- Complete, production-ready React component code for `Banner.jsx`.
- Clean Tailwind CSS classes without broken dependencies.
- Smooth responsive behavior for all screen sizes.
