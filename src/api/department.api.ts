import { axiosInstance } from '../config/axios.config';
import { Department, DepartmentResponse } from '../types/department.types';

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axiosInstance.get<DepartmentResponse>('/departments');
    if (!response.data.success) {
      throw new Error(response.data.message || '부서 목록을 불러오는데 실패했습니다.');
    }
    // departments 배열 반환
    return response.data.data.departments;
  } catch (error) {
    console.error('부서 목록 조회 실패:', error);
    throw error;
  }
};

export const getDepartmentByName = async (departmentName: string) => {
  try {
    const response = await axiosInstance.get(`/departments/name/${departmentName}`);
    return response.data;
  } catch (error) {
    console.error('부서 정보 조회 실패:', error);
    throw error;
  }
}; 