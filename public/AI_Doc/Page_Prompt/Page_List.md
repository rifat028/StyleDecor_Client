# Page List — StyleDecor Client

All routed pages in the app, grouped by area. Reusable UI components (cards, modals, nav, etc.) are intentionally excluded — see `02-Reusable-Components.md` for those. Source: `src/Routes/PublicRoutes.jsx`, `AdminRoutes.jsx`, `DecoratorRoutes.jsx`, `AgentRoutes.jsx`.

---

## Public Pages

| # | Page | Route(s) | File |
|---|---|---|---|
| 1 | Home | `/` | `src/features/home/Home.page.jsx` |
| 2 | Login | `/login` | `src/features/auth/Login.page.jsx` |
| 3 | Register | `/Register` | `src/features/auth/Register.page.jsx` |
| 4 | Services (listing) | `/services` | `src/features/services/Services.page.jsx` |
| 5 | Service Details | `/services/:id` | `src/features/services/ServiceDetails.page.jsx` |
| 6 | Top Decorators (listing) | `/decorators`, `/top-decorators` | `src/features/decorators/TopDecorators.page.jsx` |
| 7 | Decorator Profile (public) | `/decorators/:id` | `src/features/decorators/DecoratorProfile.page.jsx` |
| 8 | Service Booking | `/service-booking/:id`, `/services/:id/book` | `src/features/services/ServiceBooking.page.jsx` |
| 9 | Join as Decorator | `/join-as-decorator`, `/become-a-decorator` | `src/features/decorators/JoinAsDecorator.page.jsx` |
| 10 | About | `/about` | `src/features/about/About.page.jsx` |
| 11 | Contact | `/contact` | `src/features/contact/Contact.page.jsx` |
| 12 | Not Found (404) | `/*` | `src/components/errors/NotFound.jsx` |

## Dashboard — Customer

| # | Page | Route | File |
|---|---|---|---|
| 13 | My Profile | `/dashboard` (index), `/dashboard/my-profile` | `src/features/profile/MyProfile.page.jsx` |
| 14 | My Bookings | `/dashboard/my-bookings` | `src/features/customer/MyBookings.page.jsx` |
| 15 | Transactions | `/dashboard/transactions` | `src/features/customer/Transactions.page.jsx` |
| 16 | My Reviews | `/dashboard/my-reviews` | `src/features/customer/MyReviews.page.jsx` |
| 17 | Payment Success | `/dashboard/payment-success` | `src/features/customer/PaymentSuccess.page.jsx` |

## Dashboard — Admin

| # | Page | Route | File |
|---|---|---|---|
| 18 | Manage Services | `/dashboard/manage-services` | `src/features/admin/ManageServices.page.jsx` |
| 19 | Manage Users | `/dashboard/manage-users` | `src/features/admin/ManageUser.page.jsx` |
| 20 | Manage Categories | `/dashboard/manage-categories` | `src/features/admin/ManageCategories.page.jsx` |
| 21 | Manage Decorators | `/dashboard/manage-decorators` | `src/features/admin/ManageDecorator.page.jsx` |
| 22 | Manage Bookings | `/dashboard/manage-bookings` | `src/features/admin/ManageBookings.page.jsx` |
| 23 | Manage Transactions / Payments | `/dashboard/manage-transactions`, `/dashboard/manage-payments` | `src/features/admin/ManageTransactions.page.jsx` |
| 24 | Manage Agents | `/dashboard/manage-agents` | `src/features/admin/ManageAgents.page.jsx` |
| 25 | Manage Reviews | `/dashboard/manage-reviews` | `src/features/admin/ManageReviews.page.jsx` |
| 26 | Analytics | `/dashboard/analytics` | `src/features/admin/Analytics.page.jsx` |

## Dashboard — Decorator

| # | Page | Route | File |
|---|---|---|---|
| 27 | Agency Profile | `/dashboard/agency-profile` | `src/features/decorator-dashboard/AgencyProfile.page.jsx` |
| 28 | My Services | `/dashboard/my-services` | `src/features/decorator-dashboard/ManageService.page.jsx` |
| 29 | My Projects | `/dashboard/my-projects` | `src/features/decorator-dashboard/MyProjects.page.jsx` |
| 30 | My Earnings | `/dashboard/my-earnings` | `src/features/decorator-dashboard/MyEarnings.page.jsx` |
| 31 | My Agents | `/dashboard/my-agents` | `src/features/decorator-dashboard/MyAgents.page.jsx` |
| 32 | Agency Reviews | `/dashboard/agency-reviews` | `src/features/decorator-dashboard/AgencyReviews.page.jsx` |

## Dashboard — Agent

| # | Page | Route | File |
|---|---|---|---|
| 33 | My Schedule | `/dashboard/my-schedule` | `src/features/agent-dashboard/MySchedule.page.jsx` |
| 34 | Active Execution | `/dashboard/active-execution` | `src/features/agent-dashboard/ActiveExecution.page.jsx` |
| 35 | Agent Profile | `/dashboard/agent-profile` | `src/features/agent-dashboard/AgentProfile.page.jsx` |
| 36 | My Performance | `/dashboard/my-performance` | `src/features/agent-dashboard/PerformanceAppraisals.page.jsx` |

---

## Not routed (excluded above)

- `src/features/customer/ServiceBooking.page.jsx` — dead duplicate of page #8, not referenced by any route. See `03-Frontend-Issues-And-Solutions.md` §2.
- `src/components/errors/Forbidden.jsx` — rendered inline by the `AdminRoutes`/`DecoratorRoutes`/`AgentRoutes` guards on unauthorized access, not mounted at its own path.

**Total routed pages: 36**
