import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { getProjects } from '../../api/project.api';
import { Project } from '../../types/project.types';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import ProjectDetailModal from '../../components/projects/ProjectDetailModal';
import { retryRequest } from '../../utils/api.utils';
import ProjectLayout from '../../layouts/ProjectLayout';


const ProjectListPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  // 남은 일자 계산 함수
  const calculateRemainingDays = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
      renderCell: (params) => (
        <div
          style={{ cursor: 'pointer', color: '#F4A261' }}
          onClick={() => {
            setSelectedProject(params.row);
            setIsDetailModalOpen(true);
          }}
        >
          {params.value}
        </div>
      ),
    },
    { field: 'department', headerName: '담당 부서', flex: 1 },
    { 
      field: 'startDate', 
      headerName: '시작일', 
      flex: 1,
      renderCell: (params) => formatDate(params.value)
    },
    { 
      field: 'endDate', 
      headerName: '종료일', 
      flex: 1,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'remainingDays',
      headerName: '남은일자',
      flex: 1,
      valueGetter: (params: { row: { endDate: string } }) => {
        if (!params?.row?.endDate) return 0;
        return calculateRemainingDays(params.row.endDate);
      },
      valueFormatter: (params: { value: number }) => `${params.value}일`,
    },
    {
      field: 'progress',
      headerName: '진행률',
      flex: 1,
      valueFormatter: (params: { value: number }) => `${params.value}%`,
    },
  ];

  const handleCreateSuccess = () => {
    fetchInitialData();
  };

  const handleDetailSuccess = () => {
    fetchInitialData();
  };

  return (
    <ProjectLayout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              backgroundColor: '#F4A261',
              '&:hover': {
                backgroundColor: '#E76F51',
              },
            }}
          >
            프로젝트 생성
          </Button>
        </Box>
        <DataGrid
          rows={projects || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row._id}
          autoHeight
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '& .MuiDataGrid-cell:hover': {
              color: '#F4A261',
            },
          }}
        />
      </Container>
      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <ProjectDetailModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSuccess={handleDetailSuccess}
      />
    </ProjectLayout>
  );
};

export default ProjectListPage;
