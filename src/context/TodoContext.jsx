import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.username) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/users/${user.username}/todo`);
      setTodos(data.data || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title, description = '') => {
    try {
      const { data } = await API.post(`/users/${user.username}/todo`, {
        todoName: title,
        todoDescription: description,
      });
      setTodos([...todos, data.data]);
      return data.data;
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  };

  const updateTodoStatus = async (todoId) => {
    try {
      const { data } = await API.get(`/users/${user.username}/todo/${todoId}/status`);
      setTodos(todos.map(t => t._id === todoId ? data.data : t));
      return data.data;
    } catch (error) {
      console.error('Failed to update todo status:', error);
      throw error;
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await API.delete(`/users/${user.username}/todo/${todoId}`);
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  };

  const deleteAllTodos = async () => {
    try {
      await API.delete(`/users/${user.username}/todo`);
      setTodos([]);
    } catch (error) {
      console.error('Failed to delete all todos:', error);
      throw error;
    }
  };

  return (
    <TodoContext.Provider value={{
      todos,
      loading,
      createTodo,
      updateTodoStatus,
      deleteTodo,
      deleteAllTodos,
      fetchTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
