import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, LinearProgress, Typography, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { getProjects } from '../../api/project.api';
import { Project } from '../../types/project.types';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import ProjectUpdateModal from '../../components/projects/ProjectUpdateModal';
import { retryRequest } from '../../utils/api.utils';

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const projects = await retryRequest(getProjects);

      setProjects(projects);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchInitialData();
  }, [navigate, fetchInitialData]);


  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: '프로젝트명',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer', color: '#F4A261' }}
          onClick={() => {
            setSelectedProject(params.row);
            setIsUpdateModalOpen(true);
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: 'department',
      headerName: '담당 부서',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const department = params.value;
        if (department && typeof department === 'object' && 'name' in department) {
          return department.name;
        }
        return '';
      }
    },
    { 
      field: 'startDate', 
      headerName: '시작일', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => formatDate(params.value)
    },
    { 
      field: 'endDate', 
      headerName: '종료일', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'remainingDays',
      headerName: '잔여일',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: { row: Project }) => {
        if (!row?.endDate) return '';
        const endDate = new Date(row.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          return (
            <Chip 
              label="만료" 
              size="small"
              sx={{ 
                backgroundColor: '#ff4d4f',
                color: 'white',
                fontWeight: 500
              }}
            />
          );
        } else if (diffDays <= 1) {
          return (
            <Chip 
              label="마감임박" 
              size="small"
              sx={{ 
                backgroundColor: '#faad14',
                color: 'white',
                fontWeight: 500
              }}
            />
          );
        }

        return `${diffDays}일`;
      },
    },
    {
      field: 'progress',
      headerName: '진행률',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: { row: Project }) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={row.progress || 0} 
            sx={{ 
              width: '70%',
              height: 8,
              borderRadius: 5
            }}
          />
          <Box sx={{ minWidth: 35 }}>
            {`${row.progress || 0}%`}
          </Box>
        </Box>
      )
    },
  ];

  const handleCreateSuccess = () => {
    fetchInitialData();
  };

  const handleDetailSuccess = () => {
    fetchInitialData();
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2, 
      }}>
        <Box sx={{ flex: 1 }} />
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center' }}>프로젝트 목록</Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#F4A261',
              color: 'white',
              '&:hover': {
                backgroundColor: '#E76F51',
              },
            }}
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            프로젝트 추가
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: 'calc(100vh - 140px)' }}>
        <DataGrid
          rows={projects || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row: Project) => row._id}
          onRowClick={(params) => setSelectedProject(params.row)}
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
      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <ProjectUpdateModal
        open={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        project={selectedProject}
        onSuccess={handleDetailSuccess}
      />
    </Box>
  );
};

export default ProjectListPage;
