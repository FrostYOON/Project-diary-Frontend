import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getCurrentUser, updateUserProfile } from '../../api/user.api';
import { getDepartments } from '../../api/department.api';
import { User } from '../../types/user.types';
import { Department } from '../../types/department.types';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, departmentsData] = await Promise.all([
          getCurrentUser(),
          getDepartments()
        ]);
        console.log('User data in MyPage:', userData);
        console.log('User registerType:', userData.registerType);
        setUser(userData);
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
        } else {
          console.error('부서 데이터가 배열이 아닙니다:', departmentsData);
          setDepartments([]);
        }
        setFormData({
          name: userData.name,
          phone: userData.phone,
          birth: userData.birth?.split('T')[0],
          department: userData.department,
        });
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        alert('정보를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?._id) return;
      const updatedUser = await updateUserProfile(user._id, formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('회원정보가 수정되었습니다.');
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          회원 정보
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              value={user?.email || ''}
              disabled
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              fullWidth
              required
              placeholder={user?.name || ''}
            />

            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                value={typeof formData.department === 'object' ? (formData.department as Department)._id : formData.department || ''}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={!isEditing}
              >
                {departments && departments.length > 0 && departments.map((dept: Department) => (
                  <MenuItem 
                    key={dept._id} 
                    value={dept._id}
                  >
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              fullWidth
              required
              placeholder={user?.phone || ''}
            />

            <TextField
              label="Birth"
              type="date"
              value={formData.birth || ''}
              onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
              disabled={!isEditing}
              fullWidth
              required
              InputLabelProps={{
                shrink: true
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      backgroundColor: '#F4A261',
                      '&:hover': {
                        backgroundColor: '#E76F51',
                      },
                    }}
                  >
                    수정
                  </Button>
                  {(!user?.registerType || user?.registerType === 'normal') && (
                    <Button
                      variant="contained"
                      onClick={() => navigate('/my/change-password')}
                      sx={{
                        backgroundColor: '#F4A261',
                        '&:hover': {
                          backgroundColor: '#E76F51',
                        },
                      }}
                    >
                      비밀번호 변경
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name,
                        phone: user?.phone,
                        birth: user?.birth?.split('T')[0],
                        department: user?.department,
                      });
                    }}
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
                </>
              )}
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default MyPage; 