import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tokens.css";
import "./styles/fonts.css";
import "./styles/base.css";

import { ThemeProvider } from "./app/Theme";
import { SmoothScroll } from "./app/SmoothScroll";
import { ContactProvider } from "./app/ContactProvider";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <SmoothScroll>
        <ContactProvider>
          <App />
        </ContactProvider>
      </SmoothScroll>
    </ThemeProvider>
  </StrictMode>
);
