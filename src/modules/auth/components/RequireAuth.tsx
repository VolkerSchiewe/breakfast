import * as React from "react";
import { FC } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export const RequireAuth: FC<{
  children: React.ReactElement;
  redirectTo: string;
}> = ({ children, redirectTo }) => {
  const { user } = useAuth();
  return user != null ? children : <Navigate to={redirectTo} />;
};

export const RequireAdmin: FC<{
  children: React.ReactElement | null;
  redirectTo: string;
}> = ({ children, redirectTo }) => {
  const { user } = useAuth();
  return user?.isAdmin === true ? children : <Navigate to={redirectTo} />;
};
