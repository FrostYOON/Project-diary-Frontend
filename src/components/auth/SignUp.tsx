import { FormEvent, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useSignUpForm } from "../../features/auth/hooks/useSignUpForm";
import { authService } from "../../features/auth/api/auth.api";

const SignUp = () => {
  const { formData, errors, handleChange, validateForm } = useSignUpForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _confirmPassword, ...signupData } = formData;
        const response = await authService.signup(signupData);
        localStorage.setItem('accessToken', response.accessToken);
        alert("회원가입이 완료되었습니다!");
        window.location.href = '/';
      } catch (error) {
        console.error("회원가입 실패:", error);
        alert(
          error instanceof Error
            ? error.message
            : "회원가입 중 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ width: "500px" }}>
      <Paper
        elevation={3}
        sx={{
          padding: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
          회원가입
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '3px'
              }
            }}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '3px'
              }
            }}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            name="confirmPassword"
            label="Password Confirm"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '3px'
              }
            }}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            id="username"
            label="Name"
            name="name"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '1px'
              }
            }}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            id="phoneNumber"
            label="Phone"
            name="phone"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '3px'
              }
            }}
          />

          <TextField
            margin="normal"
            size="small"
            required
            fullWidth
            id="birthDate"
            label="Birth"
            name="birth"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            sx={{
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                position: 'relative',
                transform: 'none',
                marginBottom: '3px'
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 4, mb: 1 }}
            disabled={isLoading}
          >
            {isLoading ? "처리중..." : "회원가입"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
