import { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Project } from '../../types/project.types';
import { updateProject, deleteProject } from '../../api/project.api';
import { getUsersByDepartment } from '../../api/user.api';
import { User } from '../../types/user.types';
import { getDepartments } from '../../api/department.api';
import { Department } from '../../types/department.types';
import {
  modalStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  submitButtonStyle,
  textFieldStyle,
  formBoxStyle
} from '../../styles/components/projectModal.styles';
import { SelectChangeEvent } from '@mui/material';

interface ProjectUpdateModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: (data: Partial<Project>) => void;
  userRole: string;
}

const ProjectUpdateModal = ({ open, onClose, project, onSuccess, userRole }: ProjectUpdateModalProps) => {
  const [formData, setFormData] = useState<Partial<Project>>(project || {});
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      if (!open) return;
      
      try {
        setIsLoading(true);
        const deps = await getDepartments();
        setDepartments(deps);

        if (project) {
          const departmentId = typeof project.department === 'object' 
            ? project.department._id 
            : project.department;

          // 부서 ID가 유효한지 확인
          const isValidDepartment = deps.some(dep => dep._id === departmentId);
          
          setFormData({
            ...project,
            department: isValidDepartment ? departmentId : ''
          });

          if (isValidDepartment) {
            const response = await getUsersByDepartment(departmentId);
            if (response.success && response.data.users) {
              setDepartmentUsers(response.data.users);
              // 프로젝트의 멤버 ID 배열을 설정
              const memberIds = project.members?.map(member => 
                typeof member === 'object' ? member._id : member
              ) || [];
              setSelectedMembers(memberIds);
            }
          }
        }
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [open, project]);

  const handleUpdate = async () => {
    if (!project?._id) return;
    try {
      await updateProject(project._id, formData);
      onSuccess(formData);
      onClose();
    } catch (error) {
      console.error('프로젝트 수정 실패:', error);
      alert('프로젝트 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!project?._id || !window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
    try {
      await deleteProject(project._id);
      onSuccess(formData);
      onClose();
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleDepartmentChange = async (event: SelectChangeEvent) => {
    try {
      const departmentId = event.target.value as string;
      setFormData(prev => ({
        ...prev,
        department: departmentId
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

  const handleMemberChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;  // 이미 string[] 타입
    setSelectedMembers(value as string[]);
    setFormData(prev => ({
      ...prev,
      members: value as string[]
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            {userRole === 'user' ? '프로젝트 상세' : '프로젝트 수정'}
          </DialogTitle>
          <DialogContent sx={modalContentStyle}>
            <Box sx={formBoxStyle}>
              <TextField
                label="프로젝트명"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
                sx={textFieldStyle}
                disabled={userRole === 'user'}
              />

              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel>담당 부서</InputLabel>
                <Select
                  value={typeof formData.department === 'object' ? formData.department._id : (formData.department || '')}
                  label="담당 부서"
                  onChange={handleDepartmentChange}
                  disabled={userRole === 'user'}
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
                  value={formData.startDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                  disabled={userRole === 'user'}
                />
                <TextField
                  label="종료일"
                  type="date"
                  value={formData.endDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                  disabled={userRole === 'user'}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth sx={textFieldStyle}>
                  <InputLabel>상태</InputLabel>
                  <Select
                    value={formData.status || ''}
                    label="상태"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                    disabled={userRole === 'user'}
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
                  value={formData.progress || 0}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  fullWidth
                  sx={textFieldStyle}
                  disabled={userRole === 'user'}
                />
              </Box>

              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel>프로젝트 멤버</InputLabel>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={handleMemberChange}
                  label="프로젝트 멤버"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((memberId) => {
                        const user = departmentUsers.find(u => u._id === memberId);
                        return user ? (
                          <Chip key={memberId} label={user.name}/>
                        ) : null;
                      })}
                    </Box>
                  )}
                  disabled={userRole === 'user'}
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
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                sx={textFieldStyle}
                disabled={userRole === 'user'}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={modalActionsStyle}>
            {userRole === 'user' ? (
              <Button onClick={onClose}>닫기</Button>
            ) : (
              <>
                <Box>
                  <Button onClick={handleDelete} color="error">삭제</Button>
                </Box>
                <Box>
                  <Button onClick={onClose}>취소</Button>
                  <Button
                    onClick={handleUpdate}
                    variant="contained"
                    sx={submitButtonStyle}
                  >
                    수정
                  </Button>
                </Box>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ProjectUpdateModal; 