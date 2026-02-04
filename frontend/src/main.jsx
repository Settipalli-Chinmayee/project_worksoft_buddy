import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ThemeContext,
  ThemeProvider,
} from "./components/ThemeContext/ThemeContext";

function Root() {
  const { isTheme } = useContext(ThemeContext);
  // console.log(isTheme, "theme in main");
  return (
    <StrictMode>
      <App />
      <ToastContainer
        theme="colored"
        // style={{
        //   border: isTheme ? "1px solid white" : "none",
        //   borderRadius: "10px",
        // }}
      />
    </StrictMode>
  );
}
createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Root />
  </ThemeProvider>
);
