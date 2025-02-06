export interface Project {
  _id: string;
  title: string;
  department: { _id: string; name: string } | string;
  description: string;
  startDate: string;
  endDate: string;
  status: '준비' | '진행중' | '완료' | '보류';
  createdAt: string;
  updatedAt: string;
  author: { _id: string; name: string } | string;
  progress: number;
  members: Array<{ _id: string; name: string }> | string[];
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project | Project[];
}

export interface CreateProjectData {
  title: string;
  department: string;
  description: string;
  startDate: string;
  endDate: string;
  status: '준비' | '진행중' | '완료' | '보류';
  progress: number;
  members: string[];
} 