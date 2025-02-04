export interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  birth: string;
  registerType?: 'normal' | 'google';
  // ... other fields ...
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
  };
}