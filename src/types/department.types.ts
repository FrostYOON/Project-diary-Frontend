export interface Department {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// 부서 목록 조회 응답
export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: {
    departments: Department[];
  };
}

// 부서 생성/수정 응답
export interface DepartmentSingleResponse {
  success: boolean;
  message: string;
  data: {
    department: Department;
  };
}

// 부서 삭제 응답
export interface DepartmentDeleteResponse {
  success: boolean;
  message: string;
}