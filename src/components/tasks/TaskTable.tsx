import { 
  Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Task, TaskStatus, TaskPriority } from '../../types/task.types';
import { Box } from '@mui/material';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const TaskTable = ({ tasks, loading, onEdit }: TaskTableProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '진행중':
        return { color: '#ed6c02', backgroundColor: '#fff7ed' };
      case '완료':
        return { color: '#2e7d32', backgroundColor: '#edf7ed' };
      case '대기':
        return { color: '#0288d1', backgroundColor: '#e3f2fd' };
      case '보류':
        return { color: '#9e9e9e', backgroundColor: '#f5f5f5' };
      default:
        return { color: 'grey.700', backgroundColor: 'grey.100' };
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case '긴급':
        return { color: '#d32f2f', backgroundColor: '#ffeaea' };
      case '높음':
        return { color: '#ed6c02', backgroundColor: '#fff7ed' };
      case '보통':
        return { color: '#2e7d32', backgroundColor: '#edf7ed' };
      case '낮음':
        return { color: '#0288d1', backgroundColor: '#e3f2fd' };
      default:
        return { color: 'grey.700', backgroundColor: 'grey.100' };
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'project', 
      headerName: '프로젝트', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) => (
        params.row.project?.title || '프로젝트 없음'
      )
    },
    { 
      field: 'title', 
      headerName: '제목',
      flex: 1,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => params.value
    },
    { 
      field: 'description', 
      headerName: '설명', 
      flex: 2,
      minWidth: 200,
      width: 300,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => params.value
    },
    { 
      field: 'status', 
      headerName: '상태',
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={getStatusColor(params.value as TaskStatus)}
        />
      )
    },
    { 
      field: 'priority', 
      headerName: '우선순위', 
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={getPriorityColor(params.value as TaskPriority)}
        />
      )
    },
    { 
      field: 'tag', 
      headerName: '태그', 
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="default"
          sx={{ fontWeight: 'medium' }}
        />
      )
    },
    { 
      field: 'startDate', 
      headerName: '시작일', 
      flex: 1,
      minWidth: 150,
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '';
        return formatDate(params.value);
      }
    },
    { 
      field: 'endDate', 
      headerName: '종료일', 
      flex: 1,
      minWidth: 150,
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return '';
        return formatDate(params.value);
      }
    },
    { 
      field: 'remainingDate', 
      headerName: '잔여일', 
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: { row: Task }) => {
        if (!row?.endDate) return '';
        const endDate = new Date(row.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}일`;
      }
    },
  ];

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 140px)' }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        loading={loading}
        getRowId={(row: Task) => row._id}
        onRowClick={(params) => onEdit(params.row)}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: {
            sortModel: [{ field: 'endDate', sort: 'asc' }],
          }
        }}
        disableRowSelectionOnClick
        disableColumnMenu
        sx={{ 
          bgcolor: 'white', 
          borderRadius: 2,
          width: '100%',
          '& .hidden-column': {
            display: 'none'
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'grey.200',
            textAlign: 'center',
            justifyContent: 'center'
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderRadius: '8px 8px 0 0',
            textAlign: 'center',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#D4A373',
            color: '#ffffff',
            fontWeight: 'bold',
          }
        }}
      />
    </Box>
  );
};

export default TaskTable;