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
import NotificationListPage from './pages/notifications/NotificationListPage';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationProvider';

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
    <NotificationProvider>
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
            <Route path="/" element={
              <AppLayout hideHeader>
                <MainPage />
              </AppLayout>
            } />
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
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="notifications" element={<NotificationListPage />} />
                  <Route path="projects" element={
                    <ProtectedRoute>
                      <ProjectListPage />
                    </ProtectedRoute>
                  } />
                  <Route path="tasks" element={
                    <ProtectedRoute>
                      <PersonalTaskPage />
                    </ProtectedRoute>
                  } />
                  <Route path="projectCalendar" element={
                    <ProtectedRoute>
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProjectCalendar />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </NotificationProvider>
  );
};

export default App;
