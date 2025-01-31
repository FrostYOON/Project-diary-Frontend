import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../../types/task.types';
import { taskApi } from '../../api/task.api';

export const useTaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks();
      setTasks(response.data.data.tasks || []);
    } catch (err) {
      setError('업무 목록을 불러오는데 실패했습니다.');
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setLoading(true);
      const response = await taskApi.createTask(data);
      const newTask = response.data.data.task;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 생성에 실패했습니다.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, data: TaskFormData) => {
    try {
      setLoading(true);
      const response = await taskApi.updateTask(taskId, data);
      const updatedTask = response.data.data.task;
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 수정에 실패했습니다.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await taskApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 삭제에 실패했습니다.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    refreshTasks: fetchTasks
  };
};