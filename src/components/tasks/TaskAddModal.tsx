import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import { TaskFormData, ProjectOption, TaskStatus, TaskPriority, TaskTag } from '../../types/task.types';
import { taskApi } from '../../api/task.api';
import {
  modalStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  submitButtonStyle,
  textFieldStyle,
  formBoxStyle
} from '../../styles/components/taskModal.styles';

interface TaskAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  userId: string;
  departmentId: string;
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  status: '대기',
  priority: '보통',
  startDate: '',
  endDate: '',
  tag: '기타',
  projectId: ''
};

const TaskAddModal = ({ open, onClose, onSubmit, userId, departmentId }: TaskAddModalProps) => {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (userId && departmentId) {
          const response = await taskApi.getProjects(departmentId, userId);
          setProjects(response.data.data || []);
        }
      } catch (error) {
        console.error('프로젝트 목록 조회 실패:', error);
        setProjects([]);
      }
    };

    if (open) {
      fetchProjects();
      const today = new Date();
      const initialDates = {
        ...initialFormData,
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
      setFormData(initialDates);
    }
  }, [open, departmentId, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 제출할 때는 ISO 형식으로 변환
    const submissionData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };
    onSubmit(submissionData);
    setFormData(initialFormData);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: modalStyle }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={modalTitleStyle}>
          업무 추가
        </DialogTitle>
        <DialogContent sx={modalContentStyle}>
          <Box sx={formBoxStyle}>
            <TextField
              label="제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
              sx={textFieldStyle}
            />

            <TextField
              label="설명"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
              sx={textFieldStyle}
            />

            <FormControl fullWidth sx={textFieldStyle}>
              <InputLabel>상태</InputLabel>
              <Select
                value={formData.status}
                label="상태"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                <MenuItem value="대기">대기</MenuItem>
                <MenuItem value="진행중">진행중</MenuItem>
                <MenuItem value="완료">완료</MenuItem>
                <MenuItem value="보류">보류</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={textFieldStyle}>
              <InputLabel>우선순위</InputLabel>
              <Select
                value={formData.priority}
                label="우선순위"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              >
                <MenuItem value="낮음">낮음</MenuItem>
                <MenuItem value="보통">보통</MenuItem>
                <MenuItem value="높음">높음</MenuItem>
                <MenuItem value="긴급">긴급</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="시작일"
                type="date"
                value={formatDate(formData.startDate)}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={textFieldStyle}
              />
              <TextField
                label="종료일"
                type="date"
                value={formatDate(formData.endDate)}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={textFieldStyle}
              />
            </Box>

            <FormControl fullWidth sx={textFieldStyle}>
              <InputLabel>프로젝트</InputLabel>
              <Select
                value={formData.projectId}
                label="프로젝트"
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={textFieldStyle}>
              <InputLabel>태그</InputLabel>
              <Select
                value={formData.tag}
                label="태그"
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as TaskTag })}
              >
                <MenuItem value="기타">기타</MenuItem>
                <MenuItem value="회의">회의</MenuItem>
                <MenuItem value="개발">개발</MenuItem>
                <MenuItem value="디자인">디자인</MenuItem>
                <MenuItem value="기획">기획</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={modalActionsStyle}>
          <Button onClick={onClose}>취소</Button>
          <Button 
            type="submit"
            variant="contained"
            sx={submitButtonStyle}
          >
            추가
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskAddModal;