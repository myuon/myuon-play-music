import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./api/firebase";
import "ress";
import { css, Global } from "@emotion/react";
import { theme } from "./components/theme";
import { registerSW } from "virtual:pwa-register";

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={[
        css`
          html {
            font-family: ui-sans-serif, system-ui, -apple-system,
              BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
              "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
              "Segoe UI Symbol", "Noto Color Emoji";
            color: ${theme.palette.gray[900]};
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p,
          button {
            color: inherit;
          }

          header {
            max-width: ${theme.width.large}px;
            margin: 0 auto;

            @media screen and (max-width: ${theme.width.large}px) {
              margin: 0 16px;
            }
          }

          main {
            max-width: ${theme.width.large}px;
            margin: 0 auto;
            margin-bottom: 48px;

            @media screen and (max-width: ${theme.width.large}px) {
              margin: 0 16px;
            }
          }

          a {
            color: inherit;

            :hover {
              text-decoration: none;
            }
          }
        `,
        {
          h1: theme.typography.h1,
          h2: theme.typography.h2,
          h3: theme.typography.h3,
          h4: theme.typography.h4,
          p: theme.typography.body,
          button: theme.typography.button,
          a: theme.typography.body,
        },
      ]}
    />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

const updateSW = registerSW({
  onNeedRefresh() {
    return;
  },
  onOfflineReady() {
    return;
  },
});
