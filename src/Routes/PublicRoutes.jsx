import { createBrowserRouter } from "react-router";
import Home from "../Pages/public/Home";
import Spinner from "../Components/Spinner";
import RootLayout from "../Layout/DefaultLayout/RootLayout";
import Register from "../Pages/public/Register";
import Login from "../Pages/public/LogIn";
import Services from "../Pages/public/Services";
import About from "../Pages/public/About";
import Contact from "../Pages/public/Contact";
import ServiceDetails from "../Pages/public/ServiceDetails";
import PrivateRoutes from "./PrivateRoutes";
import ServiceBooking from "../Pages/private/customer/ServiceBooking";
import DashboardLayout from "../Layout/DashBoardLayout/DashboardLayout";
import MyBookings from "../Pages/private/customer/MyBookings";
import MyProfile from "../Pages/private/MyProfile";
import ManageService from "../Pages/private/decorator/ManageService";
import JoinAsDecorator from "../Pages/public/JoinAsDecorator";
import ManageDecorator from "../Pages/private/admin/ManageDecorator";
import ManageBooking from "../Pages/private/admin/ManageBookings";
import MyProjects from "../Pages/private/decorator/MyProjects";
import MyEarnings from "../Pages/private/decorator/MyEarnings";
import Analytics from "../Pages/private/admin/Analytics";
import AdminRoutes from "./AdminRoutes";
import DecoratorRoutes from "./DecoratorRoutes";
import NotFound from "../Components/ErrorPages/NotFound";
import Transactions from "../Pages/private/customer/Transactions";
import PaymentSuccess from "../Pages/private/customer/PaymentSuccess";

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
        path: "/service-booking/:id",
        element: (
          <PrivateRoutes>
            <ServiceBooking></ServiceBooking>
          </PrivateRoutes>
        ),
      },
      {
        path: "/join-as-decorator",
        element: (
          <PrivateRoutes>
            <JoinAsDecorator></JoinAsDecorator>
          </PrivateRoutes>
        ),
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
            <ManageService></ManageService>
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
