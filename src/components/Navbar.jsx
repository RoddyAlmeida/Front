import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import useUser from "./useUser";

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
  const { user, logout } = useUser();
  const isAdmin = user?.rol?.name?.toLowerCase() === "admin";
  return (
    <Nav>
      <NavContainer>
        <Brand>Todo Pro</Brand>
        <NavLinks>
          <NavLink to="/" $active={location.pathname === "/"}>Tareas</NavLink>
          {isAdmin && <NavLink to="/users" $active={location.pathname === "/users"}>Usuarios</NavLink>}
          {isAdmin && <NavLink to="/roles" $active={location.pathname === "/roles"}>Roles</NavLink>}
          {isAdmin && <NavLink to="/dashboard" $active={location.pathname === "/dashboard"}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" $active={location.pathname === "/profile"}>Perfil</NavLink>}
          {user && (
            <span style={{
              marginLeft: 16,
              color: '#6366f1',
              fontWeight: 700,
              fontSize: '1.08rem',
              background: 'rgba(99,102,241,0.08)',
              padding: '4px 14px',
              borderRadius: '1.1em',
              boxShadow: '0 1px 4px rgba(99,102,241,0.08)',
              letterSpacing: '0.5px',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}>
              {user.name} <span style={{ color: '#7c3aed', fontWeight: 500 }}>({user.rol?.name})</span>
            </span>
          )}
          {user && <NavLink as="button" onClick={logout} style={{ marginLeft: 12, background: '#f3e8ff', color: '#4f46e5', border: 'none', cursor: 'pointer' }}>Cerrar sesión</NavLink>}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}