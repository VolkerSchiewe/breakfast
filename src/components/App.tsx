import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../modules/auth/components/AuthContext";
import {
  RequireAdmin,
  RequireAuth,
} from "../modules/auth/components/RequireAuth";
import { User } from "../modules/auth/services/user";
import { ElectionContainer } from "../modules/election/container/ElectionContainer";
import { NavBar } from "../modules/layout/components/NavBar";
import { theme } from "../modules/layout/styles/styles";
import { CodesContainer } from "../modules/management/containers/CodesContainer";
import { EditElectionContainer } from "../modules/management/containers/EditElectionContainer";
import { ElectionListContainer } from "../modules/management/containers/ElectionListContainer";
import { Login } from "./Login";

interface AppState {
  user?: User;
}

export class App extends React.Component<{}, AppState> {
  render(): React.ReactElement {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Routes>
              <Route
                path="/elections/:electionId/codes/"
                element={
                  <RequireAdmin redirectTo="/login/">
                    <CodesContainer />
                  </RequireAdmin>
                }
              />
              <Route
                path={"/*"}
                element={
                  <>
                    <NavBar title={"Wahlen"} />
                    <Routes>
                      <Route path="/login/" element={<Login />} />

                      <Route
                        path="/elections/:electionId/"
                        element={
                          <RequireAdmin redirectTo="/login/">
                            <EditElectionContainer />
                          </RequireAdmin>
                        }
                      />
                      <Route
                        path="/elections/"
                        element={
                          <RequireAdmin redirectTo="/login/">
                            <ElectionListContainer />
                          </RequireAdmin>
                        }
                      />
                      <Route
                        path="/"
                        element={
                          <RequireAuth redirectTo="/login/">
                            <ElectionContainer />
                          </RequireAuth>
                        }
                      />
                    </Routes>
                  </>
                }
              ></Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}
