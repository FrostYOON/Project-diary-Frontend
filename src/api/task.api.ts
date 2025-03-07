import { Task, TaskFormData, ProjectOption } from '../types/task.types';
import { axiosInstance } from '../config/axios.config';

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface ProjectResponse {
  data: ProjectOption[];
}

interface TaskResponse {
  data: {
    tasks: Task[];
  };
}

interface TaskCreateResponse {
  data: {
    task: Task;
  };
}

export const taskApi = {
  getTasks: () => 
    axiosInstance.get<TaskResponse>('/tasks'),
  
  createTask: (data: TaskFormData) => 
    axiosInstance.post<TaskCreateResponse>('/tasks', data),
  
  updateTask: (taskId: string, data: TaskFormData) => 
    axiosInstance.put<TaskCreateResponse>(`/tasks/${taskId}`, data),
  
  deleteTask: (taskId: string) => 
    axiosInstance.delete(`/tasks/${taskId}`),

  getProjects: (departmentId: string, userId: string) => 
    axiosInstance.get<ProjectResponse>(`/projects?departmentId=${departmentId}&userId=${userId}`),
}; 