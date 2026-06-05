import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TTSProvider } from "./contexts/LanguageContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

createRoot(document.getElementById("root")!).render(
  <AccessibilityProvider>
    <TTSProvider>
      <App />
    </TTSProvider>
  </AccessibilityProvider>
);

