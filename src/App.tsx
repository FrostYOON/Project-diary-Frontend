import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RootLayout from "./layouts/RootLayout";
import AuthCallback from './pages/auth/AuthCallback';
import ProjectListPage from "./pages/projects/ProjectListPage";
import PersonalTaskPage from './pages/tasks/PersonalTaskPage';

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
          <Route path="/" element={<MainPage />} />

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
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/projects" 
            element={
              <RootLayout isOverlayVisible={false}>
                <ProjectListPage />
              </RootLayout>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <RootLayout isOverlayVisible={false}>
                <PersonalTaskPage />
              </RootLayout>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
