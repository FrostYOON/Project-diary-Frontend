import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/auth/SignUpPage";
import RootLayout from "./layouts/RootLayout";

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

const App: React.FC = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html, body, #root": {
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
          },
        }}
      />
      <Router>
        <RootLayout isOverlayVisible={isOverlayVisible}>
          <Routes>
            <Route
              path="/signup"
              element={
                <SignUpPage onFormFocus={() => setOverlayVisible(true)} />
              }
            />
          </Routes>
        </RootLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
