import React, { useState, useEffect } from "react";
import { login, getMe, register } from "../services/api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useUser from "../components/useUser";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      console.log("Login exitoso:", res.data);
      const token = res.data.token;
      localStorage.setItem("token", token);
      // Obtener usuario actual y guardar en localStorage
      console.log("Llamando a getMe...");
      const meRes = await getMe();
      console.log("Respuesta de /me:", meRes.data);
      localStorage.setItem("user", JSON.stringify(meRes.data));
      setUser(meRes.data);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.error("Error en login o /me:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Credenciales incorrectas o error de red"
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);
    if (registerData.password !== registerData.password_confirmation) {
      setRegisterError("Las contraseñas no coinciden");
      setRegisterLoading(false);
      return;
    }
    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.password_confirmation
      });
      setRegisterLoading(false);
      setShowRegister(false);
      setEmail(registerData.email);
      setPassword("");
    } catch (err) {
      setRegisterLoading(false);
      setRegisterError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al registrar usuario"
      );
    }
  };

  return (
    <Container>
      {showRegister ? (
        <>
          <Title>Crear cuenta</Title>
          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Nombre"
              value={registerData.name}
              onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={registerData.email}
              onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Confirmar contraseña"
              value={registerData.password_confirmation}
              onChange={e => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
              required
            />
            {registerError && <div style={{ color: "red", marginBottom: 12 }}>{registerError}</div>}
            <Button type="submit" disabled={registerLoading}>{registerLoading ? "Creando..." : "Crear cuenta"}</Button>
          </form>
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <button type="button" style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowRegister(false)}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </>
      ) : (
        <>
          <Title>Iniciar sesión</Title>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <Button type="submit" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</Button>
          </form>
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <button type="button" style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowRegister(true)}>
              ¿No tienes cuenta? Crear usuario
            </button>
          </div>
        </>
      )}
    </Container>
  );
} 