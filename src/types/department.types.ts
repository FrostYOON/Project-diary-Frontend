export interface Department {
  _id: string;
  name: string;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department[];
}