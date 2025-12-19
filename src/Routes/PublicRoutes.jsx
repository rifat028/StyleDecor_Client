import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Spinner from "../Components/Spinner";
import RootLayout from "../Layout/RootLayout";

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
    ],
  },
]);

export default router;
