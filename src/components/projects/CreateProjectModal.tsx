import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
  Chip,
} from '@mui/material';
import { CreateProjectData, Project } from '../../types/project.types';
import { createProject } from '../../api/project.api';
import { User } from '../../types/user.types';
import { getUsersByDepartment } from '../../api/user.api';
import { getDepartments } from '../../api/department.api';
import { Department } from '../../types/department.types';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData: CreateProjectData = {
  title: '',
  department: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '준비' as const,
  progress: 0,
  members: [],
};

const CreateProjectModal = ({ open, onClose, onSuccess }: CreateProjectModalProps) => {
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<CreateProjectData>(initialFormData);

  const fetchDepartments = useCallback(async () => {
    try {
      const departments = await getDepartments();
      
      if (Array.isArray(departments)) {
        setDepartments(departments);
      } else {
        console.error('부서 목록이 배열이 아님:', departments);
        setDepartments([]);
      }
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
      setDepartments([]);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      setFormData(initialFormData);
      setDepartmentUsers([]);
    }
  }, [open, fetchDepartments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        department: formData.department,
        members: formData.members
      };

      await createProject(projectData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleDepartmentChange = async (departmentId: string) => {
    try {
      setFormData(prev => ({
        ...prev,
        department: departmentId,
        members: []
      }));

      if (departmentId) {
        const response = await getUsersByDepartment(departmentId);
        if (response.success && response.data.users) {
          setDepartmentUsers(response.data.users);
        } else {
          setDepartmentUsers([]);
        }
      } else {
        setDepartmentUsers([]);
      }
    } catch (error) {
      console.error('부서별 사용자 목록 조회 실패:', error);
      setDepartmentUsers([]);
      alert('부서별 사용자 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setDepartmentUsers([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 1200,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          새 프로젝트 생성
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="프로젝트명"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>담당 부서</InputLabel>
              <Select
                value={formData.department}
                label="담당 부서"
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>부서 선택</em>
                </MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              multiple
              options={departmentUsers}
              getOptionLabel={(option) => option.name}
              value={departmentUsers.filter(user => 
                formData.members.includes(user._id)
              )}
              onChange={(_, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  members: newValue.map(user => user._id)
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="프로젝트 멤버"
                  placeholder={departmentUsers.length ? "멤버 선택" : "부서를 먼저 선택해주세요"}
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((user, index) => {
                  const { key, ...otherProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={user.name}
                      {...otherProps}
                    />
                  );
                })
              }
            />
            <TextField
              label="프로젝트 설명"
              multiline
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />
            <Box display="flex" gap={2}>
              <TextField
                label="시작일"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="종료일"
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>상태</InputLabel>
                <Select
                  value={formData.status}
                  label="상태"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                >
                  <MenuItem value="준비">준비</MenuItem>
                  <MenuItem value="진행중">진행중</MenuItem>
                  <MenuItem value="완료">완료</MenuItem>
                  <MenuItem value="보류">보류</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="진행률"
                type="number"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={onClose}>
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
                생성
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal; 