import { SignUpFormData } from '../types/auth.types';

export const validateSignUpForm = (formData: SignUpFormData): Partial<SignUpFormData> => {
  const errors: Partial<SignUpFormData> = {};

  // 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = "유효한 이메일 주소를 입력해주세요 (예: example@example.com)";
  }

  // 비밀번호 검증
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    errors.password = "유효한 비밀번호를 입력해주세요 (최소 8자, 영문, 숫자, 특수문자 포함)";
  }

  // 비밀번호 확인 검증
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다";
  }

  // 사용자 이름 검증
  if (formData.username.length < 2) {
    errors.username = "사용자 이름은 최소 2자 이상이어야 합니다";
  }

  // 전화번호 검증
  const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
  if (!phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "유효한 전화번호를 입력해주세요 (예: 010-1234-5678)";
  }

  // 생년월일 검증
  const birthDateRegex = /^(20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!birthDateRegex.test(formData.birthDate)) {
    errors.birthDate = "유효한 생년월일을 입력해주세요 (예: 2000-01-01)";
  }

  return errors;
}; 