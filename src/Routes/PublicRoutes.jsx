import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Spinner from "../Components/Spinner";
import RootLayout from "../Layout/RootLayout";
import Register from "../Pages/Register";
import Login from "../Pages/LogIn";
import Services from "../Pages/Services";
import About from "../Pages/About";
import Contact from "../Pages/Contact";

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
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
    ],
  },
]);

export default router;
