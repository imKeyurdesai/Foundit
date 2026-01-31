import { createBrowserRouter } from "react-router-dom";
import {
  Body,
  Login,
  Register,
  Home,
  Message,
  Dashboard,
  Uploads,
  ItemDetail,
} from "../pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/home", element: <Home /> },
      { path: "/message", element: <Message /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/upload", element: <Uploads /> },
      { path: "/item/:itemId", element: <ItemDetail /> },
    ],
  },
]);

export default router;
