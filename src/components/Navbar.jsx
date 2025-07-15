import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.07);
  padding: 0.7rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;
const NavContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;
const Brand = styled.span`
  color: #4f46e5;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;
const NavLinks = styled.div`
  display: flex;
  gap: 1.2rem;
`;
const NavLink = styled(Link)`
  color: #22223b;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: none;
  padding: 0.35rem 1.1rem;
  border-radius: 0.7rem;
  transition: background 0.18s, color 0.18s;
  background: ${({ $active }) => $active ? 'rgba(79,70,229,0.09)' : 'transparent'};
  &:hover {
    background: rgba(79,70,229,0.13);
    color: #4f46e5;
  }
`;

export default function Navbar() {
  const location = useLocation();
  return (
    <Nav>
      <NavContainer>
        <Brand>Todo Pro</Brand>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === "/"}>Tareas</NavLink>
          <NavLink to="/users" $active={location.pathname === "/users"}>Usuarios</NavLink>
          <NavLink to="/roles" $active={location.pathname === "/roles"}>Roles</NavLink>
          <NavLink to="/dashboard" $active={location.pathname === "/dashboard"}>Dashboard</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}