import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginScreen from "../screens/LoginScreen";
import { TrelloScreen } from "../screens/TrelloScreen";

const AppRoute = () => {
  return useRoutes([
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "*",
          element: <TrelloScreen />,
        },
      ],
    },
    {
      element: <LoginScreen />,
      path: "login",
    },
  ]);
};

export default AppRoute;
