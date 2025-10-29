import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import React from "react";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.user?.accessToken);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
