import axios from 'axios';
import { SignUpFormData, LoginCredentials, AuthResponse } from '../types/auth.types';
import { axiosInstance } from '../config/axios.config';
import { API_BASE_URL } from '../config/config';

const API_URL = API_BASE_URL;

export const authService = {
  async signup(userData: Omit<SignUpFormData, 'confirmPassword'>) {
    try {
      // 서버 형식에 맞게 데이터 재구성
      const signupData = {
        email: userData.email,
        password: userData.password,
        name: userData.username,    // username을 name으로 변경
        phone: userData.phoneNumber.replace(/-/g, ''),  // phoneNumber를 phone으로 변경
        birth: userData.birthDate,  // birthDate를 birth로 변경
      };
      
      const response = await axios.post(`${API_URL}/auth/signup`, signupData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다');
      }
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data.accessToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      }
      return response.data;
    } catch (error) {
      console.error('Login request:', error);
      throw error;
    }
  }
};

