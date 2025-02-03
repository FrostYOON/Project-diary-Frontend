export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  phoneNumber: string;
  birthDate: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      // ... 기타 사용자 정보 필드
    };
  };
} 