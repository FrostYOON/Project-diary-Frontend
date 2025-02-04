import { useState } from 'react';
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
import { changePassword } from '../../api/user.api';

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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, width: "500px" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          비밀번호 변경
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              type="password"
              name="currentPassword"
              label="현재 비밀번호"
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              fullWidth
              required
            />

            <TextField
              type="password"
              name="newPassword"
              label="새 비밀번호"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              fullWidth
              required
            />

            <TextField
              type="password"
              name="confirmNewPassword"
              label="새 비밀번호 확인"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
              fullWidth
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/mypage')}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#F4A261',
                  '&:hover': {
                    backgroundColor: '#E76F51',
                  },
                }}
              >
                저장
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePassword; 