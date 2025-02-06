import { axiosInstance } from '../config/axios.config';
import { Project, ProjectResponse, CreateProjectData } from '../types/project.types';

// 프로젝트 목록 조회
export const getProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get<ProjectResponse>('/projects');
  return response.data.data as Project[];
};

// 프로젝트 상세 조회
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axiosInstance.get<ProjectResponse>(`/projects/${id}`);
  return response.data.data as Project;
};

// 프로젝트 생성
export const createProject = async (projectData: CreateProjectData): Promise<Project> => {
  const formattedData = {
    ...projectData,
    startDate: new Date(projectData.startDate).toISOString(),
    endDate: new Date(projectData.endDate).toISOString(),
    department: projectData.department, // department ID
    members: projectData.members // array of user IDs
  };

  const response = await axiosInstance.post<ProjectResponse>('/projects', formattedData);
  return response.data.data as Project;
};

// 프로젝트 수정
export const updateProject = async (id: string, data: Partial<Project>) => {
  const response = await axiosInstance.put<ProjectResponse>(`/projects/${id}`, data);
  return response.data.data as Project;
};

// 프로젝트 삭제
export const deleteProject = async (id: string) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
}; 