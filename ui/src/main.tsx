import ReactDOM from "react-dom/client";
import { App } from "./app";

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
