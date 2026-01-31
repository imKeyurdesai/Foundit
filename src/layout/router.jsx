import { createBrowserRouter } from "react-router-dom";
import { Body, Login, Register } from "../pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [{ path: "/login", element: <Login /> }, { path: "register", element:<Register/> }],
  },
]);

export default router;
