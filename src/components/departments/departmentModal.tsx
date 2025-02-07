import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '../../api/department.api';
import { Department } from '../../types/department.types';
import {
  modalStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  submitButtonStyle,
  textFieldStyle,
} from '../../styles/components/projectModal.styles';

interface DepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepartmentModal = ({ open, onClose, onSuccess }: DepartmentModalProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('부서 목록 조회 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment._id, { name: departmentName });
      } else {
        await createDepartment({ name: departmentName });
      }
      await fetchDepartments();
      setDepartmentName('');
      setEditingDepartment(null);
      onSuccess();
    } catch (error) {
      console.error('부서 처리 실패:', error);
      alert(editingDepartment ? '부서 수정에 실패했습니다.' : '부서 생성에 실패했습니다.');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentName(department.name);
  };

  const handleDelete = async (departmentId: string) => {
    if (!window.confirm('정말로 이 부서를 삭제하시겠습니까?')) return;
    
    try {
      await deleteDepartment(departmentId);
      await fetchDepartments();
      onSuccess();
    } catch (error) {
      console.error('부서 삭제 실패:', error);
      alert('부서 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setDepartmentName('');
    setEditingDepartment(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: modalStyle }}
    >
      <DialogTitle sx={modalTitleStyle}>
        부서 관리
      </DialogTitle>
      <DialogContent sx={modalContentStyle}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label={editingDepartment ? "부서명 수정" : "새 부서명"}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            fullWidth
            required
            sx={textFieldStyle}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={submitButtonStyle}
            >
              {editingDepartment ? '수정' : '추가'}
            </Button>
            {editingDepartment && (
              <Button onClick={handleCancel}>
                취소
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <List>
          {departments.map((department) => (
            <ListItem
              key={department._id}
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleEdit(department)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(department._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={department.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={modalActionsStyle}>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentModal; 