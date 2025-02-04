import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RootLayout from "./layouts/RootLayout";
import AuthCallback from "./pages/auth/AuthCallback";
import ProjectListPage from "./pages/projects/ProjectListPage";
import PersonalTaskPage from "./pages/tasks/PersonalTaskPage";
import NotificationListPage from "./pages/notifications/NotificationListPage";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { NotificationProvider } from "./components/providers/NotificationProvider";
import MyPage from "./pages/my/myPage";
import ChangePassword from "./pages/my/ChangePassword";
import { AppThemeProvider } from "./components/providers/ThemeProvider";
import { useState } from "react";

const ProjectCalendar = lazy(() => import("./pages/projects/ProjectCalendar"));

const App: React.FC = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  return (
    <NotificationProvider>
      <AppThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <AppLayout hideHeader>
                  <MainPage />
                </AppLayout>
              }
            />
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
              path="/*"
              element={
                <AppLayout>
                  <Routes>
                    <Route
                      path="notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="projectCalendar"
                      element={
                        <ProtectedRoute>
                          <Suspense fallback={<div>Loading...</div>}>
                            <ProjectCalendar />
                          </Suspense>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="projects"
                      element={
                        <ProtectedRoute>
                          <ProjectListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="tasks"
                      element={
                        <ProtectedRoute>
                          <PersonalTaskPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mypage"
                      element={
                        <ProtectedRoute>
                          <MyPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my/change-password"
                      element={
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
        </Router>
      </AppThemeProvider>
    </NotificationProvider>
  );
};

export default App;
