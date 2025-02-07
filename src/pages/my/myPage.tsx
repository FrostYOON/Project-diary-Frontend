import { useState, useEffect, useRef } from 'react';
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
  Avatar,
  IconButton,
} from '@mui/material';
import { getCurrentUser, updateUserProfile, updateProfileImage } from '../../api/user.api';
import { getDepartments } from '../../api/department.api';
import { User } from '../../types/user.types';
import { Department } from '../../types/department.types';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { authService } from '../../api/auth.api';
import default_profile from '@/assets/images/profile_default.png';

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, departmentsData] = await Promise.all([
          getCurrentUser(),
          getDepartments()
        ]);
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

  const handleDeleteAccount = async () => {
    if (!user?._id) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    const isConfirmed = window.confirm(
      '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'
    );

    if (isConfirmed) {
      try {
        await authService.deleteAccount(user._id);
        // 토큰 삭제 및 로그아웃 처리
        localStorage.removeItem('accessToken');
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/', { replace: true });  // 뒤로가기 방지
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      await updateProfileImage(file);
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      setImageKey(prev => prev + 1);
      alert('프로필 이미지가 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    }
  };

  const imageUrl = user?.profileImage 
    ? `${user.profileImage}`
    : default_profile;

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 2, 
        mb: 2,
        height: 'calc(100vh - 140px)',  // 화면 높이에서 헤더/푸터 높이 제외
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          maxHeight: '90vh',  // 최대 높이 설정
          overflow: 'hidden',   // 내용이 넘칠 경우 스크롤
          margin: 'auto'      // 중앙 정렬
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 1 }}>
          회원 정보
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              key={imageKey}
              src={imageUrl}
              alt={user?.name || '프로필 이미지'}
              sx={{
                width: 120,
                height: 120,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleImageClick}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
              onClick={handleImageClick}
            >
              <PhotoCameraIcon sx={{ color: 'white' }} />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </Box>
        </Box>

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

        <Box sx={{ mt: 1, borderTop: '1px solid #eee', pt: 1 }}>
          <Typography variant="h6" color="error" gutterBottom>
            계정 삭제
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            startIcon={<DeleteIcon />}
          >
            회원 탈퇴
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MyPage; 
