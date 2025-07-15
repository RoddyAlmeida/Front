import { useEffect, useState } from "react";
import api from "../services/api";
import { getUsers } from "../services/api";
import styled, { keyframes } from "styled-components";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

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
const NewTaskFab = styled.button`
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
  background: ${({ status }) =>
    status === "pendiente"
      ? "linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)"
      : status === "progreso"
      ? "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)"
      : status === "terminada"
      ? "linear-gradient(90deg, #22c55e 0%, #a7f3d0 100%)"
      : "#64748b"};
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
const Select = styled.select`
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

function TaskForm({ initial, onSubmit, onCancel, users }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "pending");
  const [userId, setUserId] = useState(initial?.user_id || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!status || !["pending", "in_progress", "completed"].includes(status)) {
      setError("El estado es obligatorio y debe ser válido");
      return;
    }
    setError("");
    const payload = { title, description, status };
    if (userId) payload.user_id = userId;
    onSubmit(payload, setError);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Título *</Label>
      <Input value={title} onChange={e => setTitle(e.target.value)} required />
      <Label>Descripción</Label>
      <Input as="textarea" value={description} onChange={e => setDescription(e.target.value)} />
      <Label>Estado *</Label>
      <Select value={status} onChange={e => setStatus(e.target.value)} required>
        <option value="pending">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="completed">Terminada</option>
      </Select>
      <Label>Usuario asignado</Label>
      <Select value={userId} onChange={e => setUserId(e.target.value)}>
        <option value="">Sin usuario</option>
        {users && users.map(user => (
          <option key={user.id} value={user.id}>{user.name || user.email}</option>
        ))}
      </Select>
      {error && <div style={{ color: 'red', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <CancelButton type="button" onClick={onCancel}>Cancelar</CancelButton>
        <ActionButton $edit type="submit"><FiPlus />Guardar</ActionButton>
      </div>
    </form>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const fetchTasks = () => {
    setLoading(true);
    api.get("/tasks")
      .then(res => setTasks(res.data.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
    getUsers().then(res => setUsers(res.data.data || []));
  }, []);

  const handleCreate = (data, setFormError) => {
    setLoading(true);
    api.post("/tasks", data)
      .then(() => {
        setShowForm(false);
        fetchTasks();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.status === false && err.response.data.data) {
          setFormError(typeof err.response.data.data === 'string' ? err.response.data.data : "Error al crear tarea");
        } else {
          alert("Error al crear tarea");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (data, setFormError) => {
    setLoading(true);
    api.put(`/tasks/${editing.id}`, data)
      .then(() => {
        setEditing(null);
        fetchTasks();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.status === false && err.response.data.data) {
          setFormError(typeof err.response.data.data === 'string' ? err.response.data.data : "Error al actualizar tarea");
        } else {
          alert("Error al actualizar tarea");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    setLoading(true);
    api.delete(`/tasks/${id}`)
      .then(() => {
        fetchTasks();
      })
      .catch(() => alert("Error al eliminar tarea"))
      .finally(() => setLoading(false));
  };

  const filteredTasks = (filter === "todos" ? tasks : tasks.filter(t => t.status === filter))
    .filter(task => {
      const q = search.toLowerCase();
      const assignedUser = users.find(u => u.id === task.user_id);
      return (
        (task.title || "").toLowerCase().includes(q) ||
        (task.description || "").toLowerCase().includes(q) ||
        (assignedUser && (assignedUser.name || assignedUser.email || "").toLowerCase().includes(q))
      );
    });

  function getStatusLabel(status) {
    if (status === "pending") return "Pendiente";
    if (status === "in_progress") return "En progreso";
    if (status === "completed") return "Terminada";
    return status;
  }

  return (
    <div>
      <Title>Lista de Tareas</Title>
      <input
        type="text"
        placeholder="Buscar por título o descripción..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 350, marginBottom: 18, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <button onClick={() => setFilter("todos")} style={{ background: filter === "todos" ? '#6366f1' : '#e5e7eb', color: filter === "todos" ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Todos</button>
        <button onClick={() => setFilter("pending")} style={{ background: filter === "pending" ? '#f59e42' : '#e5e7eb', color: filter === "pending" ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Pendiente</button>
        <button onClick={() => setFilter("in_progress")} style={{ background: filter === "in_progress" ? '#38bdf8' : '#e5e7eb', color: filter === "in_progress" ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>En progreso</button>
        <button onClick={() => setFilter("completed")} style={{ background: filter === "completed" ? '#22c55e' : '#e5e7eb', color: filter === "completed" ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Terminada</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(!loading && filteredTasks.length === 0) && (
          <li style={{ color: '#888' }}>No hay tareas registradas.</li>
        )}
        {filteredTasks.map(task => {
          const assignedUser = users.find(u => u.id === task.user_id);
          let badgeColor = '#64748b';
          if (task.status === 'pending') badgeColor = 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)';
          if (task.status === 'in_progress') badgeColor = 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)';
          if (task.status === 'completed') badgeColor = 'linear-gradient(90deg, #22c55e 0%, #a7f3d0 100%)';
          return (
            <Card key={task.id}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                {task.title} <Badge style={{ background: badgeColor }}>{getStatusLabel(task.status)}</Badge>
              </div>
              <div style={{ color: '#666', fontSize: '1.05rem' }}>{task.description}</div>
              {assignedUser && <div style={{ fontSize: '0.98rem', color: '#7c3aed' }}>Asignada a: {assignedUser.name || assignedUser.email}</div>}
              <div style={{ fontSize: '0.95rem', color: '#6366f1' }}>Creada: {new Date(task.created_at).toLocaleString()}</div>
              <Actions>
                <ActionButton $edit onClick={() => setEditing(task)}><FiEdit2 />Editar</ActionButton>
                <ActionButton onClick={() => handleDelete(task.id)}><FiTrash2 />Eliminar</ActionButton>
              </Actions>
            </Card>
          );
        })}
      </ul>
      <NewTaskFab onClick={() => setShowForm(true)} title="Nueva tarea">
        <FiPlus />
      </NewTaskFab>
      {showForm && (
        <FormOverlay>
          <FormCard>
            <FormTitle>{editing ? "Editar tarea" : "Crear tarea"}</FormTitle>
            <TaskForm initial={editing} onSubmit={(data, setFormError) => editing ? handleEdit(data, setFormError) : handleCreate(data, setFormError)} onCancel={() => { setShowForm(false); setEditing(null); }} users={users} />
          </FormCard>
        </FormOverlay>
      )}
      {editing && (
        <FormOverlay>
          <FormCard>
            <FormTitle>Editar tarea</FormTitle>
            <TaskForm initial={editing} onSubmit={(data, setFormError) => handleEdit(data, setFormError)} onCancel={() => setEditing(null)} users={users} />
          </FormCard>
        </FormOverlay>
      )}
    </div>
  );
}