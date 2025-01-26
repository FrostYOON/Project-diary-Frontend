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
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
} 