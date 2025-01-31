import { axiosInstance } from './axios.config';
import { UserResponse } from '../types/user.types';

export const getUsersByDepartment = async (departmentId: string): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get<UserResponse>(`/users/department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error('부서별 사용자 목록 조회 실패:', error);
    throw error;
  }
}; 