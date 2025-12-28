import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Spinner from "../Components/Spinner";
import RootLayout from "../Layout/RootLayout";
import Register from "../Pages/Register";
import Login from "../Pages/LogIn";
import Services from "../Pages/Services";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import ServiceDetails from "../Pages/ServiceDetails";
import PrivateRoutes from "./PrivateRoutes";
import ServiceBooking from "../Pages/ServiceBooking";
import DashboardLayout from "../Dashboard Layout/DashboardLayout";
import MyBookings from "../DashBoard/MyBookings";
import MyProfile from "../DashBoard/MyProfile";
import ManageService from "../DashBoard/ManageService";
import JoinAsDecorator from "../Pages/JoinAsDecorator";
import ManageDecorator from "../DashBoard/ManageDecorator";
import ManageBooking from "../DashBoard/ManageBookings";
import MyProjects from "../DashBoard/MyProjects";
import MyEarnings from "../DashBoard/MyEarnings";
import Analytics from "../DashBoard/Analytics";
import AdminRoutes from "./AdminRoutes";
import DecoratorRoutes from "./DecoratorRoutes";
import NotFound from "../Components/ErrorPages/NotFound";
import Transactions from "../DashBoard/Transactions";
import PaymentSuccess from "../Pages/PaymentSuccess";

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
