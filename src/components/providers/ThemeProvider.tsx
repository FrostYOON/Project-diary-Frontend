import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F4A261",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const globalStyles = {
  "html, body, #root": {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
  },
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </MuiThemeProvider>
  );
}; 