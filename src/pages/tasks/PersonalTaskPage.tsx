import { useState, useEffect } from 'react';
import { Task } from '../../types/task.types';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskTable from '../../components/tasks/TaskTable';
import TaskAddModal from '../../components/tasks/TaskAddModal';
import TaskEditModal from '../../components/tasks/TaskEditModal';
import { useTaskTable } from '../../hooks/tasks/useTaskTable';
import { TaskFormData } from '../../types/task.types';
import { axiosInstance } from '../../config/axios.config';

const PersonalTaskPage = () => {
  const {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskTable();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setUserId(response.data.data.user._id);
        setDepartmentId(response.data.data.user.department);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenEditModal(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setOpenAddModal(true);
  };

  const handleSubmitAdd = async (data: TaskFormData) => {
    try {
      await createTask(data);
      setOpenAddModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '업무 생성에 실패했습니다.');
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    try {
      await updateTask(selectedTask?._id || '', data);
      setOpenEditModal(false);
      setSelectedTask(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : '업무 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        alert(error instanceof Error ? error.message : '업무 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ flex: 1 }} />
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center' }}>업무 목록</Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#F4A261',
              color: 'white',
              '&:hover': {
                backgroundColor: '#E76F51',
              },
            }}
            onClick={handleAddTask}
          >
            업무 추가
          </Button>
        </Box>
      </Box>
      <TaskTable
        tasks={tasks}
        loading={loading}
        onEdit={handleEditTask}
      />
      <TaskAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleSubmitAdd}
        userId={userId}
        departmentId={departmentId}
      />
      <TaskEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        task={selectedTask}
        onSubmit={handleUpdateTask}
        onDelete={handleDelete}
        userId={userId}
        departmentId={departmentId}
      />
    </Box>
  );
};

export default PersonalTaskPage; 