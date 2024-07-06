import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./App.jsx";
import { SnackbarProvider } from "notistack";

// console.log(theme)
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        preventDuplicate
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  </>
);
