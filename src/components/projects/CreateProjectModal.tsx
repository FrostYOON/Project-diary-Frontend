import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { CreateProjectData, Project } from '../../types/project.types';
import { createProject } from '../../api/project.api';
import { User } from '../../types/user.types';
import { getUsersByDepartment } from '../../api/user.api';
import { getDepartments } from '../../api/department.api';
import { Department } from '../../types/department.types';
import {
  modalStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  submitButtonStyle,
  textFieldStyle,
  formBoxStyle,
} from '../../styles/components/projectModal.styles';
import { SelectChangeEvent } from '@mui/material/Select';

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
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<CreateProjectData>(initialFormData);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const handleDepartmentChange = async (event: SelectChangeEvent) => {
    const departmentId = event.target.value as string;
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
        }
      }
    } catch (error) {
      console.error('부서별 사용자 목록 조회 실패:', error);
      setDepartmentUsers([]);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setDepartmentUsers([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: modalStyle }}
    >
      {isLoading ? (
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <>
          <DialogTitle sx={modalTitleStyle}>
            프로젝트 생성
          </DialogTitle>
          <DialogContent sx={modalContentStyle}>
            <Box sx={formBoxStyle}>
              <TextField
                label="프로젝트명"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
                sx={textFieldStyle}
              />

              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel>담당 부서</InputLabel>
                <Select
                  value={formData.department}
                  label="담당 부서"
                  onChange={handleDepartmentChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="시작일"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                />
                <TextField
                  label="종료일"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth sx={textFieldStyle}>
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
                  sx={textFieldStyle}
                />
              </Box>

              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel>프로젝트 멤버</InputLabel>
                <Select
                  multiple
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value as string[] })}
                  label="프로젝트 멤버"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((memberId) => {
                        const user = departmentUsers.find(u => u._id === memberId);
                        return user ? (
                          <Chip key={memberId} label={user.name} />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {departmentUsers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="설명"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                sx={textFieldStyle}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={modalActionsStyle}>
            <Button onClick={handleClose}>취소</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={submitButtonStyle}
            >
              생성
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CreateProjectModal; 