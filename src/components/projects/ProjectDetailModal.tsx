import { useState, useEffect } from 'react';
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
import { DEPARTMENTS } from '../../constants/departments';
import { getUsersByDepartment } from '../../api/user.api';
import { User } from '../../types/user.types';

interface ProjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

const ProjectDetailModal = ({ open, onClose, project, onSuccess }: ProjectDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(project || {});
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);

  const handleUpdate = async () => {
    if (!project?._id) return;
    try {
      await updateProject(project._id, formData);
      onSuccess();
      setIsEditing(false);
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
        department: departmentId,
        members: []
      }));

      if (departmentId) {
        const response = await getUsersByDepartment(departmentId);
        if (response.success && response.data.users) {
          setDepartmentUsers(response.data.users);
        }
      } else {
        setDepartmentUsers([]);
      }
    } catch (error) {
      console.error('부서별 사용자 목록 조회 실패:', error);
      setDepartmentUsers([]);
    }
  };

  useEffect(() => {
    if (project?._id) {
      const departmentId = typeof project.department === 'object' 
        ? (project.department as { _id: string; name: string })._id 
        : project.department;

      setFormData({
        ...project,
        department: departmentId
      });

      if (departmentId) {
        handleDepartmentChange(departmentId);
      }
    }
  }, [project]);

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
            disabled={!isEditing}
          />
          
          <FormControl fullWidth>
            <InputLabel>담당 부서</InputLabel>
            <Select
              value={formData.department || ''}
              label="담당 부서"
              onChange={(e) => handleDepartmentChange(e.target.value as string)}
              disabled={!isEditing}
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
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
            disabled={!isEditing}
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
            disabled={!isEditing}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="시작일"
              type="date"
              value={formData.startDate?.split('T')[0] || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              disabled={!isEditing}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="종료일"
              type="date"
              value={formData.endDate?.split('T')[0] || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={!isEditing}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>상태</InputLabel>
            <Select
              value={formData.status || ''}
              label="상태"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={isEditing}
          >
            삭제
          </Button>
          <Box>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                수정
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(false)} 
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
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectDetailModal; 