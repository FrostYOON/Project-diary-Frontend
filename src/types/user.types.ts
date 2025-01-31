export interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  // ... other fields ...
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
  };
} 