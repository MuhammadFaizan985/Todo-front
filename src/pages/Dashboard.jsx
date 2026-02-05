import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Circle, CheckCircle2 } from 'lucide-react';
import CreateTodoModal from '../components/CreateTodoModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { todos, loading, deleteAllTodos, deleteTodo, updateTodoStatus } = useTodo();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      try {
        await deleteAllTodos();
        toast.success('All tasks deleted');
      } catch (error) {
        toast.error('Failed to delete tasks');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await updateTodoStatus(id);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Map backend "isDone" to "completed" for frontend consistency
  const processedTodos = todos.map(t => ({
    ...t,
    completed: t.isDone
  }));

  const filteredTodos = processedTodos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = processedTodos.filter(t => t.completed).length;
  const activeCount = processedTodos.length - completedCount;

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="dashboard-container">
        {/* Header */}
        <header className="header">
          <div>
            <h1>Tasks</h1>
            <p>Welcome back, {user?.username || 'User'}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{processedTodos.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="filters">
            <button
              onClick={() => setFilter('all')}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed
            </button>
          </div>

          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ width: 'auto' }}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>

        {/* List */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Circle size={48} style={{ opacity: 0.3 }} />
              </div>
              <p>No tasks found</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo._id} className="todo-item">
                <div
                  className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => handleToggle(todo._id)}
                >
                  {todo.completed && <CheckCircle2 size={14} />}
                </div>

                <div className="todo-content">
                  <div className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.todoName}
                  </div>
                  {todo.todoDescription && (
                    <div className="stat-label">{todo.todoDescription}</div>
                  )}
                </div>

                <div className="todo-actions">
                  <button onClick={() => handleDelete(todo._id)} className="icon-btn" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {processedTodos.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={handleDeleteAll} style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
              Clear All Tasks
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTodoModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}