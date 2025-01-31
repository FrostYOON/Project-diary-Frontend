export interface Project {
  _id: string;
  title: string;
  department: string | { _id: string; name: string };
  description: string;
  startDate: string;
  endDate: string;
  status: '준비' | '진행중' | '완료' | '보류';
  createdAt: string;
  updatedAt: string;
  author: string | { _id: string; name: string };
  progress: number;
  members: string[] | { _id: string; name: string }[];
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