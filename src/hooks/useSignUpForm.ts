import { useState, ChangeEvent } from 'react';
import { SignUpFormData } from '../types/auth.types';
import { validateSignUpForm } from '../utils/validation';
import { SelectChangeEvent } from '@mui/material';

const initialFormData: SignUpFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  phoneNumber: "",
  birthDate: "",
};

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = validateSignUpForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
  };
}; 