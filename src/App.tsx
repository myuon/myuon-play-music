import { css } from "@emotion/react";
import React from "react";
import { BrowserRouter, Navigate } from "react-router-dom";
import { SWRConfig } from "swr";
import { PublicConfiguration } from "swr/dist/types";
import { LinkButton } from "./components/Button";
import { Router } from "./components/Router";
import { AuthProvider, useAuth, useInitializeUseAuth } from "./helpers/useAuth";
import ComponentsPage from "./pages/Components";
import IndexPage from "./pages/Index";
import LoginPage from "./pages/Login";

const swrOptions: Partial<PublicConfiguration> = {
  revalidateOnFocus: false,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // 404 in firebaes storage
    if (error.code === "storage/object-not-found") return;
    if (retryCount >= 5) return;

    setTimeout(() => revalidate({ retryCount }), 1000 * (1 + retryCount));
  },
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  // This depends on BrowserRouter
  const value = useInitializeUseAuth();

  return (
    <AuthProvider value={value}>
      <SWRConfig value={swrOptions}>{children}</SWRConfig>
    </AuthProvider>
  );
};

const authRoutes = [
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/components",
    element: <ComponentsPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

const noAuthRoutes = [
  { path: "/login", element: <LoginPage /> },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

const AppRoutes = () => {
  const { authenticated, logout, loading } = useAuth();

  return loading ? null : authenticated ? (
    <>
      <header
        css={css`
          display: flex;
          justify-content: flex-end;
        `}
      >
        <LinkButton onClick={logout}>LOGOUT</LinkButton>
      </header>
      <main>
        <Router routes={authRoutes} />
      </main>
    </>
  ) : (
    <main>
      <Router routes={noAuthRoutes} />
    </main>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
};

export default App;
