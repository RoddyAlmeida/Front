import { useEffect, useState } from "react";
import api from "../services/api";
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

function TaskForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "pendiente");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, status });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Título *</Label>
      <Input value={title} onChange={e => setTitle(e.target.value)} required />
      <Label>Descripción</Label>
      <Input as="textarea" value={description} onChange={e => setDescription(e.target.value)} />
      <Label>Estado *</Label>
      <Select value={status} onChange={e => setStatus(e.target.value)} required>
        <option value="pendiente">Pendiente</option>
        <option value="progreso">En progreso</option>
        <option value="terminada">Terminada</option>
      </Select>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <CancelButton type="button" onClick={onCancel}>Cancelar</CancelButton>
        <ActionButton $edit type="submit"><FiPlus />Guardar</ActionButton>
      </div>
    </form>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    api.get("/tasks")
      .then(res => setTasks(res.data.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = (data) => {
    setLoading(true);
    api.post("/tasks", data)
      .then(() => {
        setShowForm(false);
        fetchTasks();
      })
      .catch(() => alert("Error al crear tarea"))
      .finally(() => setLoading(false));
  };

  const handleEdit = (data) => {
    setLoading(true);
    api.put(`/tasks/${editing.id}`, data)
      .then(() => {
        setEditing(null);
        fetchTasks();
      })
      .catch(() => alert("Error al actualizar tarea"))
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

  return (
    <div>
      <Title>Lista de Tareas</Title>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(!loading && tasks.length === 0) && (
          <li style={{ color: '#888' }}>No hay tareas registradas.</li>
        )}
        {tasks.map(task => (
          <Card key={task.id}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              {task.title} <Badge status={task.status}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</Badge>
            </div>
            <div style={{ color: '#666', fontSize: '1.05rem' }}>{task.description}</div>
            <div style={{ fontSize: '0.95rem', color: '#6366f1' }}>Creada: {new Date(task.created_at).toLocaleString()}</div>
            <Actions>
              <ActionButton $edit onClick={() => setEditing(task)}><FiEdit2 />Editar</ActionButton>
              <ActionButton onClick={() => handleDelete(task.id)}><FiTrash2 />Eliminar</ActionButton>
            </Actions>
          </Card>
        ))}
      </ul>
      <NewTaskFab onClick={() => setShowForm(true)} title="Nueva tarea">
        <FiPlus />
      </NewTaskFab>
      {showForm && (
        <FormOverlay>
          <FormCard>
            <FormTitle>{editing ? "Editar tarea" : "Crear tarea"}</FormTitle>
            <TaskForm initial={editing} onSubmit={editing ? handleEdit : handleCreate} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </FormCard>
        </FormOverlay>
      )}
      {editing && (
        <FormOverlay>
          <FormCard>
            <FormTitle>Editar tarea</FormTitle>
            <TaskForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
          </FormCard>
        </FormOverlay>
      )}
    </div>
  );
}