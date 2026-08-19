# StyleDecor Client — Architecture, Features & Business Logic Documentation

> **Target Audience**: AI Agents, System Architects, Full-Stack Engineers  
> **Last Updated**: August 2026  
> **Repository Location**: `E:\Projects\Style Decore\StyleDecor_Client`

---

## 1. Project Overview & Vision

**StyleDecor** is a premier on-demand event decoration and experiential design platform in Bangladesh. It connects clients (couples, families, corporate organizers) with verified **Decorator Agencies** and specialized on-site **Field Specialists (Agents)**. 

The frontend provides a rich, responsive, theme-aware web application supporting **4 distinct roles**:
1. **Public / Guest**: Browses trending decoration packages, top-rated agencies, verified testimonials, and coverage maps.
2. **Customer / Client**: Explores package variations, configures event logistics, locks in bookings via two-stage Escrow payments (40% advance deposit + 60% balance), and submits verified reviews with specialist appraisals.
3. **Decorator Agency**: Operates an agency storefront, manages service tiers, tracks gross revenue and net receivables (88.5%), assigns field specialists to orders, and publishes official vendor replies to client feedback.
4. **Field Specialist (Agent)**: Accesses real-time event schedules, executes on-site milestone checklists (*Materials Staged*, *Floral Canopy Secured*, *Lighting Calibrated*), tracks performance appraisals, and updates operational duty status.
5. **Platform Administrator**: Moderates services, verifies decorator trade licenses, manages workforce agents, monitors global escrow transactions, resolves disputes/refunds, and moderates client reviews.

---

## 2. Technology Stack

- **Core Framework**: React 19 / React Router v7 (`createBrowserRouter`)
- **Build Tool**: Vite v7
- **Styling**: Tailwind CSS + DaisyUI v5 (Modern typography, HSL color tokens, dark/light theme switching)
- **Icons**: `lucide-react`
- **Animations & Visuals**: CSS keyframe animations, smooth carousels, responsive grid layouts
- **Charts & Data Visualizations**: `recharts` (Bar charts, Donut / Pie pipelines)
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth) synchronized with custom backend JWT tokens
- **HTTP Client**: Axios with global secure interceptor (`useAxiosSecure`)
- **Alerts & Modals**: `sweetalert2`, `react-hot-toast`

---

## 3. Directory Structure & File Tree

```
StyleDecor_Client/
├── public/
│   ├── AI_Doc/                    # AI Agent Architectural Documentation
│   ├── Coverage.json              # Division & city geographical coverage data
│   └── AboutData.json             # Corporate timeline & vision data
├── src/
│   ├── app/
│   │   └── App.jsx                # Application root wrapper
│   ├── assets/                    # Logos, branding avatars, category imagery
│   ├── components/
│   │   ├── errors/
│   │   │   ├── NotFound.jsx       # 404 Error page
│   │   │   ├── Forbidden.jsx      # 403 Access denied
│   │   │   └── Unauthorized.jsx   # 401 Session expired
│   │   └── ui/
│   │       ├── DashboardPageHeader.jsx # Standardized frameless dashboard header with tapered border
│   │       ├── EmptyState.jsx          # Canonical empty results illustration & action
│   │       ├── LogoutModal.jsx         # Confirmation modal for session termination
│   │       ├── Modal.jsx               # Universal portal modal shell with focus/ESC dismiss
│   │       ├── Pagination.jsx          # Canonical 3-part pagination controls
│   │       ├── RatingBadge.jsx         # Uniform rating star pill
│   │       ├── StatCard.jsx            # Standardized metric cards with pulse skeleton
│   │       ├── TableActionButton.jsx   # Standardized table action button with integrated tooltip & semantic tones
│   │       ├── TableSkeleton.jsx       # Standardized table skeleton rows
│   │       └── Tooltip.jsx             # CSS-driven animated floating tooltip wrapper
│   ├── features/
│   │   ├── about/                 # Public About, Values, Stats & How It Works
│   │   ├── admin/                 # Administrator Dashboard Suite
│   │   │   ├── Analytics.page.jsx
│   │   │   ├── ManageAgents.page.jsx
│   │   │   ├── ManageBookings.page.jsx
│   │   │   ├── ManageCategories.page.jsx
│   │   │   ├── ManageDecorator.page.jsx
│   │   │   ├── ManageReviews.page.jsx
│   │   │   ├── ManageServices.page.jsx
│   │   │   ├── ManageTransactions.page.jsx
│   │   │   └── ManageUser.page.jsx
│   │   ├── agent-dashboard/       # Field Specialist (Agent) Suite
│   │   │   ├── ActiveExecution.page.jsx
│   │   │   ├── AgentProfile.page.jsx
│   │   │   ├── MySchedule.page.jsx
│   │   │   └── PerformanceAppraisals.page.jsx
│   │   ├── auth/                  # Authentication & Profile Providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AuthProvider.jsx
│   │   │   ├── Login.page.jsx
│   │   │   └── Register.page.jsx
│   │   ├── contact/               # Contact support and inquiries
│   │   ├── customer/              # Customer Dashboard & Booking Suite
│   │   │   ├── CustomerReviews.page.jsx
│   │   │   ├── MyBookings.page.jsx
│   │   │   ├── MyReviews.page.jsx
│   │   │   ├── PaymentSuccess.page.jsx
│   │   │   ├── ServiceBooking.page.jsx
│   │   │   └── Transactions.page.jsx
│   │   ├── decorator-dashboard/   # Decorator Agency Dashboard Suite
│   │   │   ├── AgencyProfile.page.jsx
│   │   │   ├── AgencyReviews.page.jsx
│   │   │   ├── ManageService.page.jsx
│   │   │   ├── MyAgents.page.jsx
│   │   │   ├── MyEarnings.page.jsx
│   │   │   └── MyProjects.page.jsx
│   │   ├── decorators/            # Public Decorator Discovery
│   │   │   ├── DecoratorProfile.page.jsx
│   │   │   ├── JoinAsDecorator.page.jsx
│   │   │   └── TopDecorators.page.jsx
│   │   ├── home/                  # Landing Page Components
│   │   │   ├── Home.page.jsx
│   │   │   └── components/        # Banner, Categories, FeaturedReviews, TopRatedDecorators, etc.
│   │   ├── profile/
│   │   │   └── MyProfile.page.jsx # Universal user profile management
│   │   └── services/              # Public Service Catalog & Details
│   │       ├── ServiceDetails.page.jsx
│   │       └── Services.page.jsx
│   ├── hooks/
│   │   ├── useAxiosSecure.jsx     # Authenticated Axios client with bearer token injection
│   │   └── useRole.jsx            # Current user role resolution (`customer`, `decorator`, `agent`, `admin`)
│   ├── layouts/
│   │   ├── DashboardLayout/       # Sidebar, Topbar, Responsive mobile nav
│   │   └── DefaultLayout/         # Public Navbar, Footer, Breadcrumbs
│   └── routes/
│       ├── AdminRoutes.jsx        # Admin route guard
│       ├── AgentRoutes.jsx        # Agent route guard
│       ├── DecoratorRoutes.jsx    # Decorator route guard
│       ├── PrivateRoutes.jsx      # Authenticated user route guard
│       └── PublicRoutes.jsx       # Master router definition
```

---

## 4. Role Hierarchy & Route Access Control

User roles are stored in MongoDB Atlas and mirrored in custom user claims / profile lookups:
- `customer` (or `client`): Base tier for ordering event decorations.
- `decorator`: Registered decoration business owner.
- `agent`: On-site field execution specialist.
- `admin`: Superuser with platform-wide governance permissions.

### Route Guard Architecture
```
PublicRoutes.jsx
├── "/" (RootLayout)
│   ├── "/" (Home)
│   ├── "/services" (Public Catalog)
│   ├── "/services/:id" (Service Package Details & Verified Reviews)
│   ├── "/decorators/:id" (Public Agency Profile)
│   ├── "/login" & "/register"
│   └── "/service-booking/:id" (PrivateRoutes -> ServiceBooking)
└── "/dashboard" (PrivateRoutes -> DashboardLayout)
    ├── "/dashboard/my-profile" (Universal)
    │
    ├── CUSTOMER SUITE (role: customer)
    │   ├── "/dashboard/my-bookings" (MyBookings)
    │   ├── "/dashboard/transactions" (Transactions)
    │   └── "/dashboard/my-reviews" (MyReviews)
    │
    ├── DECORATOR SUITE (DecoratorRoutes, role: decorator)
    │   ├── "/dashboard/agency-profile" (AgencyProfile)
    │   ├── "/dashboard/my-services" (ManageService)
    │   ├── "/dashboard/my-projects" (MyProjects)
    │   ├── "/dashboard/my-earnings" (MyEarnings)
    │   ├── "/dashboard/my-agents" (MyAgents)
    │   └── "/dashboard/agency-reviews" (AgencyReviews)
    │
    ├── AGENT SUITE (AgentRoutes, role: agent)
    │   ├── "/dashboard/my-schedule" (MySchedule)
    │   ├── "/dashboard/active-execution" (ActiveExecution)
    │   ├── "/dashboard/my-performance" (PerformanceAppraisals)
    │   └── "/dashboard/agent-profile" (AgentProfile)
    │
    └── ADMIN SUITE (AdminRoutes, role: admin)
        ├── "/dashboard/manage-users" (ManageUser)
        ├── "/dashboard/manage-categories" (ManageCategories)
        ├── "/dashboard/manage-decorators" (ManageDecorator)
        ├── "/dashboard/manage-agents" (ManageAgents)
        ├── "/dashboard/manage-services" (ManageServices)
        ├── "/dashboard/manage-bookings" (ManageBookings)
        ├── "/dashboard/manage-transactions" (ManageTransactions)
        ├── "/dashboard/manage-reviews" (ManageReviews)
        └── "/dashboard/analytics" (Analytics)
```

---

## 5. Core Business Logic & Workflows

### 5.1 Booking & Escrow Payment Lifecycle
StyleDecor enforces a high-trust **Two-Stage Escrow Payment Model**:
1. **Creation**: Customer selects package tier (Standard, Premium, Luxury), specifies event date, venue, guest count, and submits order (`POST /bookings`).
2. **Advance Deposit (40%)**: Customer pays the 40% initial deposit via bKash/Nagad or Stripe Card (`POST /payments`). Booking advances to `advance_paid`.
3. **Agency Assignment**: Decorator accepts the order and dispatches an agency specialist (`PATCH /bookings/:id/assign`).
4. **On-Site Execution**: Field Agent progresses milestones (`preparing` $\rightarrow$ `on_the_way` $\rightarrow$ `in_progress` $\rightarrow$ `completed`).
5. **Final Settlement (60%)**: Customer verifies setup and clears the remaining 60% balance (`PATCH /bookings/:id/status` $\rightarrow$ `fully_paid`).

### 5.2 Unified Reviews & Specialist Attribution
- Single unified collection (`reviews`) with **100% field specialist attribution** (`agentId` and `agentName`).
- When a customer reviews a booking (`POST /reviews`), the rating automatically recalculates:
  - The Decorator Agency's average quality rating.
  - The assigned Field Specialist's appraisal score and badge tier.
- Decorators can respond to verified reviews with official vendor statements (`PATCH /reviews/:id/reply`).

### 5.3 Agency Profile & Workforce Roster
- Decorators manage their brand identity, cover banner, contact channels, trade license number, and service coverage zones (`/dashboard/agency-profile`).
- Decorators hire, update, and manage Field Specialists (`/dashboard/my-agents`), dispatching them directly from the Projects Console (`/dashboard/my-projects`).

---

## 6. API Communication & Security

- **Base URL**: `https://style-decor-server-woad.vercel.app` (Production) / `http://localhost:3000` (Local Development).
- **Security Interceptor** ([`useAxiosSecure.jsx`](file:///E:/Projects/Style%20Decore/StyleDecor_Client/src/hooks/useAxiosSecure.jsx)):
  - Injects Firebase Bearer Token on every outgoing request: `Authorization: Bearer <idToken>`.
  - Automatically handles session expiration and unauthorized errors (401/403).

---

## 7. Testing & Build Instructions

### Local Development
```bash
cd "E:\Projects\Style Decore\StyleDecor_Client"
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
*(Production bundle builds with 0 lint/type errors in ~4.7s)*.
