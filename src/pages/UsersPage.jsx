import { useEffect, useState } from "react";
import api from "../services/api";
import styled, { keyframes } from "styled-components";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getRoles } from "../services/api";

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
const NewUserFab = styled.button`
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
  background: linear-gradient(90deg, #6366f1 0%, #f0abfc 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 8px 32px rgba(99,102,241,0.25);
    transform: scale(1.08);
  }
`;
const Card = styled.li`
  background: rgba(255,255,255,0.95);
  border-radius: 1.2rem;
  margin: 1.5rem 0;
  padding: 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.10), 0 1.5px 8px rgba(79,70,229,0.07);
  animation: ${fadeIn} 0.5s;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 6px 32px rgba(99,102,241,0.18), 0 2px 12px rgba(79,70,229,0.13);
    transform: translateY(-2px) scale(1.01);
  }
  @media (max-width: 600px) {
    padding: 1rem 0.7rem;
  }
`;
const Actions = styled.div`
  display: flex;
  gap: 0.7rem;
`;
const ActionButton = styled.button`
  background: ${props => props.$edit ? 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)' : 'linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)'};
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 4px rgba(99,102,241,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  &:hover {
    background: ${props => props.$edit ? 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)' : 'linear-gradient(90deg, #dc2626 0%, #fca5a5 100%)'};
    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
    transform: scale(1.04);
  }
`;
const Badge = styled.span`
  display: inline-block;
  padding: 0.25em 0.9em;
  border-radius: 1em;
  font-size: 0.95em;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%);
  box-shadow: 0 1px 4px rgba(99,102,241,0.08);
  text-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;
const FormOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(99,102,241,0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  backdrop-filter: blur(2.5px);
`;
const FormCard = styled.div`
  background: rgba(255,255,255,0.93);
  border-radius: 1.2rem;
  box-shadow: 0 2px 24px rgba(99,102,241,0.13);
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(2.5px);
`;
const FormTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #6366f1;
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
const CancelButton = styled.button`
  background: #e5e7eb;
  color: #22223b;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1.1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.18s;
  &:hover {
    background: #c7d2fe;
  }
`;

function UserForm({ initial, onSubmit, onCancel, roles }) {
  const [nombre, setNombre] = useState(initial?.name || initial?.nombre || "");
  const [correo, setCorreo] = useState(initial?.email || initial?.correo || "");
  const [contrasena, setContrasena] = useState("");
  const [rolId, setRolId] = useState(initial?.rol_id || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || (!initial && !contrasena.trim())) {
      setError("Todos los campos son obligatorios (excepto contraseña al editar)");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      setError("Correo inválido");
      return;
    }
    if (contrasena && contrasena.length > 0 && contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError("");
    onSubmit({ nombre, correo, contrasena, rol_id: rolId }, setError);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Nombre *</Label>
      <Input value={nombre} onChange={e => setNombre(e.target.value)} required />
      <Label>Correo *</Label>
      <Input value={correo} onChange={e => setCorreo(e.target.value)} required type="email" />
      <Label>Contraseña {initial ? "(dejar vacío para no cambiar)" : "*"}</Label>
      <Input value={contrasena} onChange={e => setContrasena(e.target.value)} type="password" placeholder={initial ? "Nueva contraseña (opcional)" : "Contraseña"} />
      <div style={{ fontSize: '0.92rem', color: '#888', marginBottom: 6 }}>
        Mínimo 6 caracteres
      </div>
      <Label>Rol</Label>
      <select value={rolId} onChange={e => setRolId(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '0.7rem', marginBottom: '1.1rem' }}>
        <option value="">Sin rol</option>
        {roles && roles.map(role => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
      {error && <div style={{ color: 'red', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <CancelButton type="button" onClick={onCancel}>Cancelar</CancelButton>
        <ActionButton $edit type="submit"><FiPlus />Guardar</ActionButton>
      </div>
    </form>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
    getRoles().then(res => setRoles(res.data.data || []));
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get("/users")
      .then(res => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase();
    return (
      (user.name || user.nombre || "").toLowerCase().includes(q) ||
      (user.email || user.correo || "").toLowerCase().includes(q) ||
      (user.rol && user.rol.name && user.rol.name.toLowerCase().includes(q))
    );
  });

  const handleCreate = (data, setFormError) => {
    setLoading(true);
    const payload = {
      name: data.nombre,
      email: data.correo,
      password: data.contrasena,
    };
    if (data.rol_id) payload.rol_id = data.rol_id;
    api.post("/users", payload)
      .then(() => {
        setToast({ message: "Usuario creado", type: "success" });
        setShowForm(false);
        setEditing(null);
        fetchUsers();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.status === false && err.response.data.data && err.response.data.data.email) {
          setFormError("El email ya está registrado");
        } else {
          setToast({ message: "Error al crear usuario", type: "error" });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (data, setFormError) => {
    setLoading(true);
    const payload = {
      name: data.nombre,
      email: data.correo,
    };
    if (data.contrasena) payload.password = data.contrasena;
    if (data.rol_id) payload.rol_id = data.rol_id;
    api.put(`/users/${editing.id}`, payload)
      .then(() => {
        setToast({ message: "Usuario actualizado", type: "success" });
        setEditing(null);
        setShowForm(false);
        fetchUsers();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.status === false && err.response.data.data && err.response.data.data.email) {
          setFormError("El email ya está registrado");
        } else {
          setToast({ message: "Error al actualizar usuario", type: "error" });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setLoading(true);
    api.delete(`/users/${id}`)
      .then(() => {
        setToast({ message: "Usuario eliminado", type: "success" });
        fetchUsers();
      })
      .catch(() => setToast({ message: "Error al eliminar usuario", type: "error" }))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Title>Usuarios</Title>
      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 350, marginBottom: 18, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(!loading && filteredUsers.length === 0) && (
          <li style={{ color: '#888' }}>No hay usuarios registrados.</li>
        )}
        {filteredUsers.map(user => {
          return (
            <Card key={user.id}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                {user.name || user.nombre} <Badge>ID: {user.id.slice(-4)}</Badge>
              </div>
              <div style={{ color: '#666', fontSize: '1.05rem' }}>{user.email || user.correo}</div>
              {user.rol && <div style={{ fontSize: '0.98rem', color: '#7c3aed' }}>Rol: {user.rol.name}</div>}
              <div style={{ fontSize: '0.95rem', color: '#6366f1' }}>Creado: {new Date(user.created_at).toLocaleString()}</div>
              <Actions>
                <ActionButton $edit onClick={() => { setEditing(user); setShowForm(true); }}><FiEdit2 />Editar</ActionButton>
                <ActionButton onClick={() => handleDelete(user.id)}><FiTrash2 />Eliminar</ActionButton>
              </Actions>
            </Card>
          );
        })}
      </ul>
      <NewUserFab onClick={() => { setShowForm(true); setEditing(null); }} title="Nuevo usuario">
        <FiPlus />
      </NewUserFab>
      {(showForm) && (
        <FormOverlay>
          <FormCard>
            <FormTitle>{editing ? "Editar usuario" : "Crear usuario"}</FormTitle>
            <UserForm
              initial={editing}
              onSubmit={(data, setFormError) => editing ? handleEdit(data, setFormError) : handleCreate(data, setFormError)}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              roles={roles}
            />
          </FormCard>
        </FormOverlay>
      )}
      {toast && <div style={{ textAlign: 'center', padding: '1rem', color: toast.type === 'error' ? 'red' : 'green' }}>{toast.message}</div>}
    </div>
  );
}