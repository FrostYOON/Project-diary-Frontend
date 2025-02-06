import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
} from '@mui/material';
import { changePassword, getCurrentUser } from '../../api/user.api';
import { 
  changePasswordContainerStyle,
  changePasswordPaperStyle,
  buttonGroupStyle,
  submitButtonStyle,
  passwordFieldStyle
} from '../../styles/pages/changePassword.styles';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const user = await getCurrentUser();
        
        // 일반 이메일 로그인 사용자가 아닌 경우 접근 제한
        if (!user || user.registerType !== 'normal') {
          navigate('/mypage');
        }
      } catch (error) {
        console.error('사용자 정보 확인 실패:', error);
      }
    };

    checkUserAccess();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
    let isValid = true;

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = '비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await changePassword(formData.currentPassword, formData.newPassword);
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/mypage');
      } catch (error) {
        alert(error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container sx={changePasswordContainerStyle}>
      <Paper elevation={3} sx={changePasswordPaperStyle}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          비밀번호 변경
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              sx={passwordFieldStyle}
              label="현재 비밀번호"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              fullWidth
              required
            />

            <TextField
              sx={passwordFieldStyle}
              label="새 비밀번호"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              fullWidth
              required
            />

            <TextField
              sx={passwordFieldStyle}
              label="새 비밀번호 확인"
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
              fullWidth
              required
            />

            <Box sx={buttonGroupStyle}>
              <Button
                variant="contained"
                type="submit"
                sx={submitButtonStyle}
              >
                변경하기
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePassword; 