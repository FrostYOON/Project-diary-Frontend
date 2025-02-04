import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import google_icon from '@/assets/images/google_icon.png';
import { Container, Paper, Typography } from '@mui/material';
import { formContainerStyle, formPaperStyle, formTitleStyle } from '../../styles/components/form.styles';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, handleGoogleLogin, isLoading } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요');
      return;
    }

    await handleLogin({ email, password });
  };

  return (
    <Container 
      component="main" 
      maxWidth="md" 
      sx={formContainerStyle}
    >
      <Paper
        elevation={3}
        sx={formPaperStyle}
      >
        <Typography component="h1" variant="h3" sx={formTitleStyle}>
          로그인
        </Typography>
        <LoginForm onSubmit={onSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </InputGroup>
          <ButtonGroup>
            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </AuthButton>
            <AuthButton type="button" onClick={() => navigate('/signup')} disabled={isLoading}>
              회원가입
            </AuthButton>
          </ButtonGroup>
          <GoogleButton type="button" onClick={handleGoogleLogin} disabled={isLoading}>
            <GoogleIcon src={google_icon} alt="google icon" />
            구글 로그인
          </GoogleButton>
        </LoginForm>
      </Paper>
    </Container>
  );
};

const LoginForm = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #F4A261;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const AuthButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  background-color: #F4A261;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #E76F51;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(AuthButton)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export default Login;