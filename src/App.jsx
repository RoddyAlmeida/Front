import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import TasksPage from "./pages/TasksPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import styled, { createGlobalStyle } from "styled-components";
import { UserProvider } from "./components/UserContext.jsx";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Roboto', Arial, sans-serif;
    background: #f3f4fa;
    margin: 0;
    color: #22223b;
  }
`;

const AppBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0e7ff 0%, #f3e8ff 60%, #a5b4fc 100%);
  background-attachment: fixed;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(240, 240, 255, 0.45);
    pointer-events: none;
    z-index: 0;
  }
`;
const CenteredContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
  position: relative;
  z-index: 1;
`;

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";
  return (
    <>
      <GlobalStyle />
      <UserProvider>
        <AppBackground>
          {!hideNavbar && <Navbar />}
          <CenteredContainer>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
              <Route path="/roles" element={<PrivateRoute><RolesPage /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            </Routes>
          </CenteredContainer>
        </AppBackground>
      </UserProvider>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
