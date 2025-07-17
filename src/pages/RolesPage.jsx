import React, { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../services/api";
import styled, { keyframes } from "styled-components";
import useUser from "../components/useUser";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
`;
const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #3b0764;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(160, 120, 255, 0.08);
`;
const FormCard = styled.div`
  background: rgba(255,255,255,0.93);
  border-radius: 1.2rem;
  box-shadow: 0 2px 24px rgba(99,102,241,0.13);
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
`;
const Input = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 0.7rem;
  padding: 0.7rem;
  margin-bottom: 1.1rem;
  font-size: 1rem;
  background: rgba(245,245,255,0.85);
  transition: border 0.18s;
  &:focus {
    border: 1.5px solid #6366f1;
    outline: none;
  }
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
`;
const Button = styled.button`
  background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(99,102,241,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
    transform: scale(1.04);
  }
`;
const Table = styled.table`
  width: 100%;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.10), 0 1.5px 8px rgba(79,70,229,0.07);
  margin-bottom: 2rem;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
`;
const Th = styled.th`
  background: #e0e7ff;
  color: #4f46e5;
  font-weight: 700;
  padding: 0.9rem 0.5rem;
  text-align: left;
`;
const Td = styled.td`
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid #f3f4fa;
`;
const ActionButton = styled.button`
  background: ${props => props.$edit ? 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)' : 'linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)'};
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  &:hover {
    background: ${props => props.$edit ? 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)' : 'linear-gradient(90deg, #dc2626 0%, #fca5a5 100%)'};
    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
    transform: scale(1.04);
  }
`;

const StyledTr = styled.tr`
  animation: ${fadeIn} 0.5s;
`;

function RolesPage() {
  const { user } = useUser();
  const isAdmin = user?.rol?.name?.toLowerCase() === "admin";
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoles();
      setRoles(res.data.data || []);
    } catch {
      setError("Error al cargar roles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (!isAdmin) {
    return <div style={{ color: '#ef4444', fontWeight: 600, margin: '2rem', textAlign: 'center' }}>Acceso denegado</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    try {
      if (editingId) {
        await updateRole(editingId, form);
      } else {
        await createRole(form);
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchRoles();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.status === false && err.response.data.data && err.response.data.data.name) {
        setError("El nombre del rol ya existe");
      } else {
        setError("Error al guardar el rol");
      }
    }
  };

  const handleEdit = (role) => {
    setForm({ name: role.name, description: role.description || "" });
    setEditingId(role.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este rol?")) return;
    try {
      await deleteRole(id);
      fetchRoles();
    } catch {
      setError("Error al eliminar el rol");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <Title>Gestión de Roles</Title>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <Label>Nombre *</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Label>Descripción</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <Button type="submit">{editingId ? "Actualizar" : "Crear"} Rol</Button>
          {editingId && (
            <Button type="button" onClick={() => { setForm({ name: "", description: "" }); setEditingId(null); }} style={{ background: '#e5e7eb', color: '#222', marginLeft: 8 }}>Cancelar</Button>
          )}
        </form>
      </FormCard>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <StyledTr key={role.id}>
                <Td>{role.name}</Td>
                <Td>{role.description}</Td>
                <Td>
                  <ActionButton $edit onClick={() => handleEdit(role)}>Editar</ActionButton>
                  <ActionButton onClick={() => handleDelete(role.id)}>Eliminar</ActionButton>
                </Td>
              </StyledTr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default RolesPage; 