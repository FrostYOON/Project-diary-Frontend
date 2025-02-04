import { axiosInstance } from '../config/axios.config';
import { User, UserResponse } from '../types/user.types';

export const getUsersByDepartment = async (departmentId: string): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get<UserResponse>(`/users/department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error('부서별 사용자 목록 조회 실패:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: { user: User } }>('/users/me');
    return response.data.data.user;
  } catch (error) {
    console.error('현재 사용자 정보 조회 실패:', error);
    throw error;
  }
};

export const updateUserProfile = async (id: string, userData: Partial<User>): Promise<User> => {
  try { 
    const response = await axiosInstance.put<{ success: boolean; data: { user: User } }>(`/users/${id}`, userData);
    return response.data.data.user;
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const response = await axiosInstance.put('/users/me/password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    throw error;
  }
};    