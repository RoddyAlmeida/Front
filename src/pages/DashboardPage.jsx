import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import api from "../services/api";
import styled from "styled-components";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useUser from "../components/useUser";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 16px;
`;
const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #3b0764;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(160, 120, 255, 0.08);
`;
const SummaryRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;
const SummaryCard = styled.div`
  background: #f5f3ff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.10);
  padding: 2rem 1.5rem;
  flex: 1 1 220px;
  text-align: center;
  min-width: 180px;
`;
const SummaryNumber = styled.div`
  font-size: 2.3rem;
  font-weight: 800;
  color: #4f46e5;
`;
const SummaryLabel = styled.div`
  font-size: 1.1rem;
  color: #6d28d9;
`;
const Section = styled.div`
  margin-bottom: 2.2rem;
`;
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #4f46e5;
  margin-bottom: 1rem;
  font-weight: 700;
`;
const StyledTable = styled.table`
  width: 100%;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.10), 0 1.5px 8px rgba(79,70,229,0.07);
  margin-bottom: 1.5rem;
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

const COLORS = ["#6366f1", "#a5b4fc", "#f59e42", "#ef4444", "#10b981", "#f472b6", "#fbbf24", "#818cf8", "#f3e8ff"];

// Diccionario para traducir estados y roles
const ESTADO_LABELS = {
  completed: 'Completada',
  in_progress: 'En progreso',
  pending: 'Pendiente',
};
const ROL_LABELS = {
  Admin: 'Administrador',
  Usuario: 'Usuario',
  'Sin rol': 'Sin rol',
};

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

export default function DashboardPage() {
  const { user } = useUser();
  const isAdmin = user?.rol?.name?.toLowerCase() === "admin";
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUsers().then(res => res.data.data || []),
      api.get("/tasks").then(res => res.data.data || [])
    ]).then(([users, tasks]) => {
      setUsers(users);
      setTasks(tasks);
      setLoading(false);
    });
  }, []);

  if (!isAdmin) {
    return <div style={{ color: '#ef4444', fontWeight: 600, margin: '2rem', textAlign: 'center' }}>Acceso denegado</div>;
  }

  // Estadísticas
  const tareasPorEstado = countBy(tasks, "status");
  const usuariosPorRol = countBy(users, u => u.rol?.name || "Sin rol");

  // Datos para gráficos
  const tareasEstadoData = Object.entries(tareasPorEstado).map(([estado, cant]) => ({ name: ESTADO_LABELS[estado] || estado, value: cant, raw: estado }));
  const usuariosRolData = Object.entries(usuariosPorRol).map(([rol, cant]) => ({ name: ROL_LABELS[rol] || rol, value: cant }));

  return (
    <Container>
      <Title>Dashboard</Title>
      {loading ? <div>Cargando...</div> : (
        <>
          <SummaryRow>
            <SummaryCard>
              <SummaryNumber>{users.length}</SummaryNumber>
              <SummaryLabel>Total usuarios</SummaryLabel>
            </SummaryCard>
            <SummaryCard>
              <SummaryNumber>{tasks.length}</SummaryNumber>
              <SummaryLabel>Total tareas</SummaryLabel>
            </SummaryCard>
          </SummaryRow>
          <Section>
            <SectionTitle>Tareas por estado</SectionTitle>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 260px', minWidth: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tareasEstadoData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ cx, cy, midAngle, outerRadius, value }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 18;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#6366f1"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={16}
                            fontWeight={700}
                          >
                            {value}
                          </text>
                        );
                      }}
                    >
                      {tareasEstadoData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: '1 1 320px', minWidth: 220 }}>
                <StyledTable>
                  <thead>
                    <tr><Th>Estado</Th><Th>Cantidad</Th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(tareasPorEstado).map(([estado, cant]) => (
                      <tr key={estado}><Td>{ESTADO_LABELS[estado] || estado}</Td><Td>{cant}</Td></tr>
                    ))}
                  </tbody>
                </StyledTable>
              </div>
            </div>
          </Section>
          <Section>
            <SectionTitle>Usuarios por rol</SectionTitle>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 320px', minWidth: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usuariosRolData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tickFormatter={v => Number(v).toLocaleString('es-ES', { maximumFractionDigits: 0 })} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#6366f1" name="Cantidad">
                      {usuariosRolData.map((entry, idx) => (
                        <Cell key={`cell-bar-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: '1 1 260px', minWidth: 220 }}>
                <StyledTable>
                  <thead>
                    <tr><Th>Rol</Th><Th>Cantidad</Th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(usuariosPorRol).map(([rol, cant]) => (
                      <tr key={rol}><Td>{ROL_LABELS[rol] || rol}</Td><Td>{cant}</Td></tr>
                    ))}
                  </tbody>
                </StyledTable>
              </div>
            </div>
          </Section>
        </>
      )}
    </Container>
  );
} 