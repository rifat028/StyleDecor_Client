# =================== Prompt-001 ===================

## Title: Advanced Animated Categories Component Layout

## Goal

Rebuild and update the `Categories.jsx` component (`E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\Categories.jsx`) with a modern, high-tech animated grid containing rotating image containers and dual-direction infinite scrolling category cards.

## Target Component Path

- `E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\Categories.jsx`

## Component Structure & Layout Specifications

### 1. Left Section: 45-Degree Rotated Animated Image Showcase

- **Container Layout:**
  - Create a master container rotated by **45 degrees** (`rotate-45`).
  - Add a continuous slow rotational motion to this main outer container (`animate-[spin_20s_linear_infinite]` or custom keyframe).
  - Inside this container, arrange **3 image divs** in a pyramid shape:
    - Line 1 (Top): 1 image div
    - Line 2 (Bottom): 2 image divs side by side
- **Image Behavior inside Divs:**
  - Import 6 local images from `E:\Projects\Style Decore\StyleDecor_Client\src\assets\images\categories`:
    - `cat1_a.jpg`, `cat1_b.jpg` for Div 1
    - `cat2_a.jpg`, `cat2_b.jpg` for Div 2
    - `cat3_a.jpg`, `cat3_b.jpg` for Div 3
  - Each div holds 2 images that crossfade/switch every **3 seconds** (`3000ms`).
  - Apply a continuous slow zoom-in transition effect (`scale-105` to `scale-115` over time) to the currently active image.
  - Counter-rotate internal images if necessary so the visuals remain oriented correctly despite the outer 45-degree container rotation.

### 2. Right Section: Dual Vertical Infinite Scrolling Category Cards

- **Layout:** 2 vertical columns side-by-side displaying category cards.
- **Column 1 (Downward Scroll):**
  - Contains 3 category cards.
  - Animates infinitely downwards (`animate-marquee-down` or CSS transform loop).
- **Column 2 (Upward Scroll):**
  - Contains 3 category cards.
  - Animates infinitely upwards (`animate-marquee-up` or CSS transform loop).
- **Card Design:**
  - Clean floating card with subtle border and glassmorphism/shadow (`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-purple-100`).
  - Each card contains:
    - Category Icon (using `lucide-react`)
    - Category Title
    - Subtitle / Short description
    - Subtle hover animation (glow/scale).

## Technical Requirements

- Use Tailwind CSS and standard React hooks (`useState`, `useEffect`).
- Ensure images are safely imported from `src/assets/images/categories/`.
- Smooth transitions without flickering during the 3-second image swap.

## Expected Deliverable

- Complete production-ready React code for `Categories.jsx`.

# =================== Prompt-002 ===================

## Title: 3D Focusing Carousel for TopRatedDecorators.jsx

## Goal

Update the `TopRatedDecorators.jsx` component (`E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\TopRatedDecorators.jsx`) to feature a 3DCoverFlow-style dynamic carousel showcasing 5 decorator profile cards simultaneously, where the center card remains highlighted/focused, and cards automatically shift from right to left every 3 seconds.

## Target Component Path

- `E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\TopRatedDecorators.jsx`

## Component Specifications & Layout Logic

### 1. 5-Card Dynamic Carousel Structure

- Display exactly **5 cards** side-by-side at any given time (Indices: 0, 1, 2, 3, 4).
- **Positioning & Scaling Rules:**
  - **Position 2 (Middle/Center - Index 2):**
    - Focus Card: Largest size (`scale-110` or `scale-125`).
    - Full opacity (`opacity-100`), highest z-index (`z-30`), and prominent shadow/glow (`shadow-2xl shadow-purple-500/20 border-2 border-purple-500`).
  - **Positions 1 & 3 (Immediate Left & Right):**
    - Medium size (`scale-90` or `scale-95`).
    - Slight opacity reduction (`opacity-80`), lower z-index (`z-20`).
  - **Positions 0 & 4 (Outer Left & Outer Right):**
    - Smallest size (`scale-75` or `scale-80`).
    - Reduced opacity (`opacity-50`), lowest z-index (`z-10`).

### 2. Auto-Shift Animation Logic (Right to Left Every 3 Seconds)

- Implement an automated `setInterval` hook set to **3000ms (3 seconds)**.
- On each tick:
  - Shift cards from **Right to Left**.
  - The card currently in position 3 (2nd from the right) moves into position 2 (Center/Focus).
  - The previous center card (position 2) moves to position 1 (4th position from the right / 2nd from the left) and scales down smoothly.
  - The sequence loops seamlessly using modulo arithmetic (`(currentIndex + 1) % decorators.length`).

### 3. Decorator Card Design

Each card should display:

- Decorator/Agency Avatar or Logo.
- Agency Name & Verified Badge (`CheckCircle` icon).
- Overall Rating (e.g., ⭐ `4.9/5` with star icon).
- Total Completed Events Count (e.g., `120+ Events`).
- Primary Specialization Tag (e.g., "Luxury Weddings", "Floral Specialist").
- "View Profile" or "Book Now" CTA button (highlighted especially on the center active card).

### 4. Interactive Controls

- Pause auto-rotation on mouse hover (`onMouseEnter` and `onMouseLeave`).
- Manual Left/Right Navigation Arrow Buttons.
- Pagination dots below the carousel reflecting the active centered decorator.

## Technical Requirements

- Build using pure Tailwind CSS classes and standard React hooks (`useState`, `useEffect`, `useRef`).
- Add smooth transition utilities (`transition-all duration-500 ease-in-out`) for scaling, opacity, and translate positional shifts.

## Expected Deliverable

- Production-ready React component for `TopRatedDecorators.jsx` executing this exact 3D carousel effect.

# =================== Prompt-003 ===================

## Title: Dynamic & Interactive Showcase for LatestServices.jsx

## Goal

Update the `LatestServices.jsx` component (`E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\LatestServices.jsx`) to feature an enterprise-grade, highly interactive trending decoration services showcase with category quick-tabs, skeletal loading states, and backend-ready dynamic data fetching.

## Target Component Path

- `E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\LatestServices.jsx`

## Component Specifications & Layout Architecture

### 1. Section Header & Dynamic Filter Tabs

- **Title:** Centered/Left-aligned section title: "Explore Our **Trending Decoration Packages**" with dynamic accent text styling (`text-amber-600` or `text-purple-600`).
- **Subtitle:** "Discover handpicked, top-rated decoration setups tailored for your special occasions."
- **Interactive Category Filter Tabs:**
  - Horizontal scrollable/flex pill buttons at the top: `All`, `Wedding`, `Haldi & Mehendi`, `Birthday`, `Corporate`.
  - Active tab highlighting with smooth layout transition (`bg-amber-600 text-white shadow-md`).
  - Filtering logic to dynamically slice the displayed service array based on selected category.

### 2. Responsive Card Grid Layout

- Display services in a clean grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.
- Limit display to **6 primary cards** on the homepage with a "View All Services" CTA button at the bottom linking to `/services`.

### 3. Service Card Specifications (`ServiceCard.jsx` Integration)

Each service card must feature:

- **Image Section:**
  - High-res package banner with continuous subtle hover zoom (`group-hover:scale-105 transition-transform duration-500`).
  - Floating Top-Right Pill Badge: Price tag (e.g., `$250` or `৳25,000`).
  - Floating Top-Left Pill Badge: Category tag (e.g., `Wedding Special`).
- **Content Section:**
  - Service Package Title (e.g., "Royal Floral Wedding Stage").
  - Short description truncated to 2 lines (`line-clamp-2`).
  - Rating & Reviews summary (e.g., `⭐ 4.9 (48 reviews)`).
  - Decorator/Vendor short attribution (e.g., `By DreamCraft Decorators`).
- **Action Footer:**
  - Clear "Book Package" button with hover arrow animation (`ArrowRight` icon).
  - Direct routing or modal trigger for booking/details (`/services/:id`).

### 4. Skeletal Loading & Empty States

- Include a 6-card Skeleton Loader UI (using pulse animation) while data is being fetched.
- Include an Empty State component ("No decoration packages found in this category") if a filtered tab returns no items.

## Technical Requirements

- Pure Tailwind CSS and Lucide-React icons (`Star`, `ArrowRight`, `Tag`, `Filter`).
- Use standard React hooks (`useState`, `useEffect`) prepared to easily connect to your backend Axios endpoint (`/api/services/latest`).

## Expected Deliverable

- Production-ready React code for `LatestServices.jsx` that integrates seamlessly with your `features/home` architecture.

# =================== Prompt-004 ===================

## Title: Modern Interactive Booking Guide for HowItWorks.jsx

## Goal

Create and update the `HowItWorks.jsx` component (`E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\HowItWorks.jsx`) with a clean, step-by-step visual workflow that explains how customers can explore, select, book, and enjoy event decoration services on DecorCraft.

## Target Component Path

- `E:\Projects\Style Decore\StyleDecor_Client\src\features\home\components\HowItWorks.jsx`

## Component Specifications & Layout Design

### 1. Header Section

- **Badge:** Top pill container `✨ Simple 4-Step Process`.
- **Title:** Centered, bold headline: "How **DecorCraft** Works for You" with gradient accent on "DecorCraft".
- **Subtitle:** "Booking your dream event setup is as easy as 1-2-3-4. Here is how we turn your vision into reality."

### 2. 4-Step Interactive Timeline Grid

Display 4 ordered step cards in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative`):

1. **Step 01: Discover & Compare**
   - **Icon:** `Search` / `Sparkles`
   - **Description:** Browse through hundreds of verified decoration packages by event category, budget, and location.

2. **Step 02: Customize & Choose Date**
   - **Icon:** `Calendar` / `Sliders`
   - **Description:** Pick your preferred date slot, customize package details, and communicate your venue layout.

3. **Step 03: Secure Online Booking**
   - **Icon:** `CreditCard` / `ShieldCheck`
   - **Description:** Confirm your booking with transparent pricing and secure online payment via instant processing.

4. **Step 04: Celebrate Stress-Free**
   - **Icon:** `PartyPopper` / `HeartHandshake`
   - **Description:** Sit back and relax while our verified decorators set up your venue with perfection.

### 3. Modern Design Elements

- **Connecting Progress Line (Desktop):** Add a subtle dashed gradient line/connector running horizontally behind the step cards on desktop views (`hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-dashed border-t-2 border-purple-200 -z-10`).
- **Card Styling:**
  - White glassmorphism cards (`bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-purple-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`).
  - Step Number Badge: Top-right large semi-transparent step index (e.g., `01`, `02`, `03`, `04`) in gradient font (`text-3xl font-black text-purple-200/80`).
  - Icon Badge: Glowing circular or rounded square icon container (`p-3 bg-purple-100 text-purple-700 rounded-xl w-fit mb-4`).

### 4. Bottom Call-to-Action (CTA Widget)

- Add a subtle banner below the steps:
  - Text: _"Ready to elevate your upcoming event?"_
  - CTA Button: _"Browse Packages Now"_ with a right arrow icon linking to `/services`.

## Technical Requirements

- Pure Tailwind CSS and Lucide-React icons (`Search`, `Calendar`, `ShieldCheck`, `PartyPopper`, `ArrowRight`).
- Responsive design (stacked layout on mobile with vertical indicator, 4-column grid on desktop).

## Expected Deliverable

- Complete, production-ready React component code for `HowItWorks.jsx` replacing the old implementation.
