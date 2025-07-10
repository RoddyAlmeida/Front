import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TasksPage from "./pages/TasksPage";
import UsersPage from "./pages/UsersPage";
import styled, { createGlobalStyle } from "styled-components";

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

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <AppBackground>
        <Navbar />
        <CenteredContainer>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </CenteredContainer>
      </AppBackground>
    </BrowserRouter>
  );
}

export default App;
