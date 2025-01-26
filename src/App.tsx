import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles, Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RootLayout from "./layouts/RootLayout";
import HeaderLayout from "./layouts/HeaderLayout";

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
        <Routes>
          {/* 루트 경로에 직접 HeaderLayout과 임시 컨텐츠 추가 */}
          <Route
            path="/"
            element={
              <HeaderLayout>
                <Box sx={{ padding: 3 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    임시 메인 페이지
                  </Typography>
                </Box>
              </HeaderLayout>
            }
          />
          
          <Route
            path="/signup"
            element={
              <RootLayout isOverlayVisible={isOverlayVisible}>
                <SignUpPage onFormFocus={() => setOverlayVisible(true)} />
              </RootLayout>
            }
          />
          <Route
            path="/login"
            element={
              <RootLayout isOverlayVisible={isOverlayVisible}>
                <LoginPage onFormFocus={() => setOverlayVisible(true)} />
              </RootLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
