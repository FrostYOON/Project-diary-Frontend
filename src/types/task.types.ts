// 태스크 상태 타입
export type TaskStatus = '대기' | '진행중' | '완료' | '보류';

// 우선순위 타입
export type TaskPriority = '낮음' | '보통' | '높음' | '긴급';

// 태그 타입
export type TaskTag = '기획' | '디자인' | '개발' | '마케팅' | '기타';

// 태스크 타입
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  tag: TaskTag;
  project?: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    name: string;
  };
  __v?: number;
}

// 태스크 생성/수정 시 사용할 타입
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  tag: TaskTag;
  projectId: string;
} 

export interface ProjectOption {
  _id: string;
  title: string;
}