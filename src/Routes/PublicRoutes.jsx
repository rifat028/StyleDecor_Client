import { createBrowserRouter } from "react-router";
import Home from "../features/home/Home.page";
import Spinner from "../features/home/components/Spinner";
import RootLayout from "../layouts/DefaultLayout/RootLayout";
import Register from "../features/auth/Register.page";
import Login from "../features/auth/Login.page";
import Services from "../features/services/Services.page";
import About from "../features/about/About.page";
import Contact from "../features/contact/Contact.page";
import ServiceDetails from "../features/services/ServiceDetails.page";
import TopDecorators from "../features/decorators/TopDecorators.page";
import DecoratorProfile from "../features/decorators/DecoratorProfile.page";
import PrivateRoutes from "./PrivateRoutes";
import ServiceBooking from "../features/services/ServiceBooking.page";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import MyBookings from "../features/customer/MyBookings.page";
import MyProfile from "../features/profile/MyProfile.page";
import ManageServices from "../features/admin/ManageServices.page";
import ManageService from "../features/decorator-dashboard/ManageService.page";
import JoinAsDecorator from "../features/decorators/JoinAsDecorator.page";
import ManageDecorator from "../features/admin/ManageDecorator.page";
import ManageBooking from "../features/admin/ManageBookings.page";
import ManageUser from "../features/admin/ManageUser.page";
import ManageCategories from "../features/admin/ManageCategories.page";
import MyProjects from "../features/decorator-dashboard/MyProjects.page";
import MyEarnings from "../features/decorator-dashboard/MyEarnings.page";
import Analytics from "../features/admin/Analytics.page";
import AdminRoutes from "./AdminRoutes";
import DecoratorRoutes from "./DecoratorRoutes";
import NotFound from "../components/errors/NotFound";
import Transactions from "../features/customer/Transactions.page";
import PaymentSuccess from "../features/customer/PaymentSuccess.page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    hydrateFallbackElement: <Spinner></Spinner>,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
        loader: () => fetch("/Coverage.json").then((res) => res.json()),
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/Register",
        Component: Register,
      },
      {
        path: "/services",
        Component: Services,
      },
      {
        path: "/services/:id",
        Component: ServiceDetails,
      },
      {
        path: "/decorators",
        Component: TopDecorators,
      },
      {
        path: "/decorators/:id",
        Component: DecoratorProfile,
      },
      {
        path: "/top-decorators",
        Component: TopDecorators,
      },
      {
        path: "/service-booking/:id",
        element: (
          <PrivateRoutes>
            <ServiceBooking></ServiceBooking>
          </PrivateRoutes>
        ),
      },
      {
        path: "/services/:id/book",
        element: (
          <PrivateRoutes>
            <ServiceBooking></ServiceBooking>
          </PrivateRoutes>
        ),
      },
      {
        path: "/join-as-decorator",
        Component: JoinAsDecorator,
      },
      {
        path: "/become-a-decorator",
        Component: JoinAsDecorator,
      },
      {
        path: "/about",
        Component: About,
        loader: () => fetch("/AboutData.json").then((res) => res.json()),
      },
      {
        path: "/contact",
        Component: Contact,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        Component: MyProfile,
      },
      {
        path: "my-profile",
        Component: MyProfile,
      },
      {
        path: "my-bookings",
        Component: MyBookings,
      },
      {
        path: "transactions",
        Component: Transactions,
      },

      {
        path: "payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
        path: "manage-services",
        element: (
          <AdminRoutes>
            <ManageServices></ManageServices>
          </AdminRoutes>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoutes>
            <ManageUser></ManageUser>
          </AdminRoutes>
        ),
      },
      {
        path: "manage-categories",
        element: (
          <AdminRoutes>
            <ManageCategories></ManageCategories>
          </AdminRoutes>
        ),
      },
      {
        path: "manage-decorators",
        element: (
          <AdminRoutes>
            <ManageDecorator></ManageDecorator>
          </AdminRoutes>
        ),
      },
      {
        path: "manage-bookings",
        element: (
          <AdminRoutes>
            <ManageBooking></ManageBooking>
          </AdminRoutes>
        ),
      },
      {
        path: "analytics",
        element: (
          <AdminRoutes>
            <Analytics></Analytics>
          </AdminRoutes>
        ),
      },
      {
        path: "my-services",
        element: (
          <DecoratorRoutes>
            <ManageService></ManageService>
          </DecoratorRoutes>
        ),
      },
      {
        path: "my-projects",
        element: (
          <DecoratorRoutes>
            <MyProjects></MyProjects>
          </DecoratorRoutes>
        ),
      },
      {
        path: "my-earnings",
        element: (
          <DecoratorRoutes>
            <MyEarnings></MyEarnings>
          </DecoratorRoutes>
        ),
      },
    ],
  },
  {
    path: "/*",
    Component: NotFound,
  },
]);

export default router;
