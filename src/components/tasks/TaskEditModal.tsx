import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, TaskPriority, TaskTag, ProjectOption } from '../../types/task.types';
import { taskApi } from '../../api/task.api';

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onDelete: (taskId: string) => void;
  userId: string;
  departmentId: string;
}

const TaskEditModal = ({ open, onClose, task, onSubmit, onDelete, userId, departmentId }: TaskEditModalProps) => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: '대기',
    priority: '보통',
    startDate: '',
    endDate: '',
    tag: '기타',
    projectId: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        if (userId && departmentId) {
          const response = await taskApi.getProjects(departmentId, userId);
          setProjects(response.data.data || []);
        }
      } catch (error) {
        console.error('프로젝트 목록 조회 실패:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && task) {
      fetchProjects().then(() => {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || '대기',
          priority: task.priority || '보통',
          startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
          endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
          tag: task.tag || '기타',
          projectId: task.project?._id || ''
        });
      });
    }
  }, [open, task, userId, departmentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!task) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>업무 수정</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="설명"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={formData.status}
                label="상태"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                <MenuItem value="대기">대기</MenuItem>
                <MenuItem value="진행중">진행중</MenuItem>
                <MenuItem value="완료">완료</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
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

            <FormControl fullWidth>
              <InputLabel>태그</InputLabel>
              <Select
                value={formData.tag}
                label="태그"
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as TaskTag })}
              >
                <MenuItem value="기획">기획</MenuItem>
                <MenuItem value="디자인">디자인</MenuItem>
                <MenuItem value="개발">개발</MenuItem>
                <MenuItem value="마케팅">마케팅</MenuItem>
                <MenuItem value="기타">기타</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>프로젝트</InputLabel>
              <Select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                label="프로젝트"
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>프로젝트 없음</em>
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="시작일"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="종료일"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              if (task) onDelete(task._id);
              onClose();
            }}
            color="error"
          >
            삭제
          </Button>
          <Button onClick={onClose}>
            취소
          </Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
          >
            수정
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskEditModal;