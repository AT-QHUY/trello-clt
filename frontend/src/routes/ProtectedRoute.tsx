import { useEffect, useState } from "react";
import { getUserId } from "../context/AuthContext";
import { AppShell } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import KanbanHeader from "../components/header/KanbanHeader";

const ProtectedRoute = () => {
  const [userId, setUserId] = useState<string | null>("");

  useEffect(() => {
    const currentUserId: string | null = getUserId();
    setUserId(currentUserId);
  }, []);

  return (
    <AppShell
      header={{
        height: 60,
      }}
    >
      <AppShell.Header
        style={{
          border: "none",
        }}
      >
        <KanbanHeader />
      </AppShell.Header>
      <AppShell.Main
        style={{
          display: "flex",
          flex: 1,
        }}
      >
        {userId == null ? <Navigate to={"/login"} /> : <Outlet />}
      </AppShell.Main>
    </AppShell>
  );
};

export default ProtectedRoute;
