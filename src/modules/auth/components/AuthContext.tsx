import * as React from "react";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserData, getUserData, storeUserData } from "../../utils/auth";
import { AuthInterface } from "../interfaces/AuthInterface";
import { AuthService } from "../services/auth-service";
import { User } from "../services/user";


const AuthContext = React.createContext<AuthInterface>({
  isLoading: false,
  login: () => {
    throw new Error("login() not implemented");
  },
  logout: () => {
    throw new Error("logout() not implemented");
  },
});

export const useAuth = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer
export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authService = new AuthService();
  const initialUser = getUserData();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | undefined>(initialUser);
  const login = (name: string, password: string) => {
    setError(null);
    setIsLoading(true);
    authService
      .login(name, password)
      .then((res) => {
        storeUserData(res.user, res.token);
        setUser(res.user);
        setIsLoading(false);
        navigate(res.user.isAdmin ? "/elections/" : "/");
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.response.data);
      });
  };
  const logout = () => {
    setError(null);
    setUser(null);
    setIsLoading(true);
    authService
      .logout()
      .then(() => {
        deleteUserData();
        setIsLoading(false);
        setError(null);
        navigate("/login/", {replace: true});
      })
      .catch((err) => {
        if (err.status == 401) {
          deleteUserData();
          navigate("/login/", {replace: true});
        } else {
          err.json().then((res) => {
            setIsLoading(false);
            setError(res.detail);
          });
        }
      });
  };

  const onSnackbarClose = () => {
    setError(null);
  };
  return (
    <div>
      <AuthContext.Provider value={{ error, isLoading, user, login, logout }}>
        {children}
      </AuthContext.Provider>
      <Snackbar
        open={!!error}
        message={<span>{error}</span>}
        autoHideDuration={5000}
        onClose={onSnackbarClose}
      />
    </div>
  );
};
