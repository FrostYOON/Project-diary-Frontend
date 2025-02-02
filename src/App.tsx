import { useState, lazy, Suspense } from "react";
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
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

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

const ProjectCalendar = lazy(() => import('./pages/projects/ProjectCalendar'));

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
          <Route path="/" element={<MainPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route
            path="/login"
            element={
              <RootLayout isOverlayVisible={isOverlayVisible}>
                <AuthLayout>
                  <LoginPage onFormFocus={() => setOverlayVisible(true)} />
                </AuthLayout>
              </RootLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <RootLayout isOverlayVisible={isOverlayVisible}>
                <AuthLayout>
                  <SignUpPage onFormFocus={() => setOverlayVisible(true)} />
                </AuthLayout>
              </RootLayout>
            }
          />
          
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PersonalTaskPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/projectCalendar" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading...</div>}>
                  <ProjectCalendar />
                </Suspense>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
