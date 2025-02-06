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
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Task,
  TaskFormData,
  TaskStatus,
  TaskPriority,
  ProjectOption,
} from "../../types/task.types";
import { taskApi } from "../../api/task.api";
import {
  modalStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  submitButtonStyle,
  textFieldStyle,
  formBoxStyle,
} from "../../styles/components/taskModal.styles";

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onDelete: (taskId: string) => void;
  userId: string;
  departmentId: string;
}

const TaskEditModal = ({
  open,
  onClose,
  task,
  onSubmit,
  onDelete,
  userId,
  departmentId,
}: TaskEditModalProps) => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "대기",
    priority: task?.priority || "보통",
    startDate: task?.startDate || "",
    endDate: task?.endDate || "",
    tag: task?.tag || "기타",
    projectId: task?.project?._id || "",
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
        console.error("프로젝트 목록 조회 실패:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && task) {
      fetchProjects().then(() => {
        setFormData({
          title: task.title || "",
          description: task.description || "",
          status: task.status || "대기",
          priority: task.priority || "보통",
          startDate: task.startDate
            ? new Date(task.startDate).toISOString().split("T")[0]
            : "",
          endDate: task.endDate
            ? new Date(task.endDate).toISOString().split("T")[0]
            : "",
          tag: task.tag || "기타",
          projectId: task.project?._id || "",
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
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: modalStyle }}
    >
      {isLoading ? (
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={modalTitleStyle}>업무 수정</DialogTitle>
          <DialogContent sx={modalContentStyle}>
            <Box sx={formBoxStyle}>
              <TextField
                label="제목"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                fullWidth
                sx={textFieldStyle}
              />

              <TextField
                label="설명"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as TaskStatus,
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                >
                  <MenuItem value="낮음">낮음</MenuItem>
                  <MenuItem value="보통">보통</MenuItem>
                  <MenuItem value="높음">높음</MenuItem>
                  <MenuItem value="긴급">긴급</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="시작일"
                  type="date"
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                />
                <TextField
                  label="종료일"
                  type="date"
                  value={
                    formData.endDate
                      ? new Date(formData.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>

              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel>프로젝트</InputLabel>
                <Select
                  value={formData.projectId || ""}
                  label="프로젝트"
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                >
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={modalActionsStyle}>
            <Box>
              <Button 
                onClick={() => {
                  onDelete(task?._id || "");
                  onClose();
                }} 
                color="error"
              >
                삭제
              </Button>
            </Box>
            <Box>
              <Button onClick={onClose}>취소</Button>
              <Button type="submit" variant="contained" sx={submitButtonStyle}>
                수정
              </Button>
            </Box>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default TaskEditModal;
