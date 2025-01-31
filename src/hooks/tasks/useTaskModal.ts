import { useState } from 'react';
import { Task } from '../../types/task.types';

export const useTaskModal = () => {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setOpenDetailModal(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setOpenAddModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenEditModal(true);
  };

  const handleCloseModals = () => {
    setOpenDetailModal(false);
    setOpenAddModal(false);
    setOpenEditModal(false);
    setSelectedTask(null);
  };

  return {
    openDetailModal,
    openAddModal,
    openEditModal,
    selectedTask,
    handleViewTask,
    handleAddTask,
    handleEditTask,
    handleCloseModals
  };
};