import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TTSProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <TTSProvider>
    <App />
  </TTSProvider>
);
