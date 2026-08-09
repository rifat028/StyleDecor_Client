import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import App from "./app/App.jsx";
import { RouterProvider } from "react-router";
import router from "./routes/PublicRoutes.jsx";
import AuthProvider from "./features/auth/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
