import { axiosInstance } from '../config/axios.config';
import { Department, DepartmentListResponse, DepartmentSingleResponse, DepartmentDeleteResponse } from '../types/department.types';

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axiosInstance.get<DepartmentListResponse>('/departments');
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

export const createDepartment = async (data: { name: string }): Promise<Department> => {
  try {
    const response = await axiosInstance.post<DepartmentSingleResponse>('/departments', data);

    if (!response.data.success) {
      throw new Error(response.data.message || '부서 생성에 실패했습니다.');
    }

    // 응답 데이터 구조에 따라 수정
    const department = response.data.data.department;
    if (!department) {
      throw new Error('생성된 부서 정보를 찾을 수 없습니다.');
    }

    return department;
  } catch (error) {
    console.error('부서 생성 실패:', error);
    throw error;
  }
};

export const updateDepartment = async (id: string, data: { name: string }): Promise<Department> => {
  try {
    const response = await axiosInstance.put<DepartmentSingleResponse>(`/departments/${id}`, data);

    if (!response.data.success) {
      throw new Error(response.data.message || '부서 수정에 실패했습니다.');
    }

    const department = response.data.data.department;
    if (!department) {
      throw new Error('수정된 부서 정보를 찾을 수 없습니다.');
    }

    return department;
  } catch (error) {
    console.error('부서 수정 실패:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<DepartmentDeleteResponse>(`/departments/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || '부서 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('부서 삭제 실패:', error);
    throw error;
  }
};
