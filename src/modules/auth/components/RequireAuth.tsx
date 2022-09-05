import * as React from "react";
import { FC } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export const RequireAuth: FC<{
  children: React.ReactElement;
  redirectTo: string;
}> = ({ children, redirectTo }) => {
  let { user } = useAuth();
  return user ? children : <Navigate to={redirectTo} />;
};

export const RequireAdmin: FC<{
  children?: React.ReactElement;
  redirectTo: string;
}> = ({ children, redirectTo }) => {
  let { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to={redirectTo} />;
};
