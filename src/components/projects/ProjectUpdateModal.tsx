import { useState, useEffect, useCallback } from 'react';
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
  Autocomplete,
  Chip,
} from '@mui/material';
import { Project } from '../../types/project.types';
import { updateProject, deleteProject } from '../../api/project.api';
import { getUsersByDepartment } from '../../api/user.api';
import { User } from '../../types/user.types';
import { getDepartments } from '../../api/department.api';
import { Department } from '../../types/department.types';

interface ProjectUpdateModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

const ProjectUpdateModal = ({ open, onClose, project, onSuccess }: ProjectUpdateModalProps) => {
  const [formData, setFormData] = useState<Partial<Project>>(project || {});
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = useCallback(async () => {
    try {
      const { departments } = await getDepartments() as unknown as { departments: Department[] };
      setDepartments(departments);
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
      setDepartments([]);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (project) {
      const departmentId = typeof project.department === 'object' 
        ? project.department._id 
        : project.department;

      setFormData({
        ...project,
        department: departmentId,
        members: project.members?.map(member => 
          typeof member === 'object' ? member._id : member
        )
      });

      // 부서 사용자 목록 즉시 로드
      if (departmentId) {
        handleDepartmentChange(departmentId);
      }
    }
  }, [project]);

  const handleUpdate = async () => {
    if (!project?._id) return;
    console.log(formData);
    try {
      await updateProject(project._id, formData);
      onSuccess();
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
      onSuccess();
      onClose();
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleDepartmentChange = async (departmentId: string) => {
    try {
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Typography variant="h6" sx={{ mb: 3 }}>프로젝트 상세</Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="프로젝트명"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          
          <FormControl fullWidth>
            <InputLabel>담당 부서</InputLabel>
            <Select
              value={typeof formData.department === 'object' ? formData.department._id : formData.department || ''}
              label="담당 부서"
              onChange={(e) => handleDepartmentChange(e.target.value as string)}
            >
              <MenuItem value="">
                <em>부서 선택</em>
              </MenuItem>
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

          <Autocomplete
            multiple
            options={departmentUsers}
            getOptionLabel={(option) => option.name}
            value={departmentUsers.filter(user => 
              formData.members?.some(member => 
                (typeof member === 'string' ? member : member._id) === user._id
              )
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
            rows={4}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="시작일"
              type="date"
              value={formData.startDate?.split('T')[0] || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="종료일"
              type="date"
              value={formData.endDate?.split('T')[0] || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={formData.status || ''}
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
            value={formData.progress || 0}
            onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          borderTop: '1px solid #eee',
          pt: 3
        }}>
          <Button 
            color="error" 
            onClick={handleDelete}
          >
            삭제
          </Button>
          <Box>
            <Button 
              onClick={onClose} 
              sx={{ mr: 1 }}
            >
              취소
            </Button>
            <Button 
              variant="contained"
              onClick={handleUpdate}
            >
              저장
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectUpdateModal; 