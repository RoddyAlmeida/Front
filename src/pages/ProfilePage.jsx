import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useUser from "../components/useUser";
import api from "../services/api";
import { getRoles } from "../services/api";

const Container = styled.div`
  max-width: 400px;
  margin: 60px auto;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 24px rgba(99,102,241,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 1.5rem;
  text-align: center;
`;
const Label = styled.div`
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 0.2rem;
`;
const Value = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1.1rem;
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
const Button = styled.button`
  background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
  box-shadow: 0 1px 4px rgba(99,102,241,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  &:hover {
    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
    transform: scale(1.03);
  }
`;

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const isAdmin = user?.rol?.name?.toLowerCase() === "admin";
  const [edit, setEdit] = useState(false);
  const [nombre, setNombre] = useState(user?.name || "");
  const [correo, setCorreo] = useState(user?.email || "");
  const [contrasena, setContrasena] = useState("");
  const [rolId, setRolId] = useState(user?.rol?.id || "");
  const [roles, setRoles] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin && edit) {
      getRoles().then(res => setRoles(res.data.data || []));
    }
  }, [isAdmin, edit]);

  if (!user) return null;

  const handleEdit = () => {
    setEdit(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEdit(false);
    setNombre(user.name || "");
    setCorreo(user.email || "");
    setContrasena("");
    setRolId(user?.rol?.id || "");
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre.trim() || !correo.trim()) {
      setError("Nombre y correo son obligatorios");
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
    setLoading(true);
    try {
      const payload = { name: nombre, email: correo };
      if (contrasena) payload.password = contrasena;
      if (isAdmin && rolId) payload.rol_id = rolId;
      const res = await api.put(`/users/${user.id}`, payload);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setSuccess("Datos actualizados correctamente");
      setEdit(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.data?.data?.email ? "El correo ya está registrado" : "Error al actualizar")
      );
    }
    setLoading(false);
  };

  return (
    <Container>
      <Title>Mi perfil</Title>
      {edit ? (
        <form onSubmit={handleSave}>
          <Label>Nombre</Label>
          <Input value={nombre} onChange={e => setNombre(e.target.value)} required />
          <Label>Correo</Label>
          <Input value={correo} onChange={e => setCorreo(e.target.value)} required type="email" />
          <Label>Contraseña (dejar vacío para no cambiar)</Label>
          <Input value={contrasena} onChange={e => setContrasena(e.target.value)} type="password" placeholder="Nueva contraseña (opcional)" />
          <div style={{ fontSize: '0.92rem', color: '#888', marginBottom: 6 }}>Mínimo 6 caracteres</div>
          {isAdmin ? (
            <>
              <Label>Rol</Label>
              <select value={rolId} onChange={e => setRolId(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '0.7rem', marginBottom: '1.1rem' }}>
                <option value="">Sin rol</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <Label>Rol</Label>
              <Value>{user.rol?.name}</Value>
            </>
          )}
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 10 }}>{success}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
          <Button type="button" onClick={handleCancel} style={{ background: '#e5e7eb', color: '#222', marginTop: 8 }}>Cancelar</Button>
        </form>
      ) : (
        <>
          <Label>Nombre</Label>
          <Value>{user.name}</Value>
          <Label>Correo</Label>
          <Value>{user.email}</Value>
          <Label>Rol</Label>
          <Value>{user.rol?.name}</Value>
          <Label>Fecha de creación</Label>
          <Value>{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</Value>
          <Button onClick={handleEdit}>Editar perfil</Button>
        </>
      )}
    </Container>
  );
} 