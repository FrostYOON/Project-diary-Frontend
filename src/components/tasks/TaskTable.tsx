import { Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Task, TaskStatus, TaskPriority } from "../../types/task.types";
import { Box } from "@mui/material";
import { getStatusChipStyle, getPriorityChipStyle } from '../../styles/components/taskTable.styles';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
};

const TaskTable = ({ tasks, loading, onEdit }: TaskTableProps) => {
  const columns: GridColDef[] = [
    {
      field: "project",
      headerName: "프로젝트",
      flex: 1,
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => params.row.project?.title || "프로젝트 없음",
    },
    {
      field: "title",
      headerName: "제목",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value,
    },
    {
      field: "description",
      headerName: "설명",
      flex: 2,
      minWidth: 200,
      width: 300,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.value,
    },
    {
      field: "status",
      headerName: "상태",
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={getStatusChipStyle(params.value as TaskStatus)}
        />
      ),
    },
    {
      field: "priority",
      headerName: "우선순위",
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={getPriorityChipStyle(params.value as TaskPriority)}
        />
      ),
    },
    {
      field: "tag",
      headerName: "태그",
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="default"
          sx={{ fontWeight: "medium" }}
        />
      ),
    },
    {
      field: "startDate",
      headerName: "시작일",
      flex: 1,
      minWidth: 150,
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "";
        return formatDate(params.value);
      },
    },
    {
      field: "endDate",
      headerName: "종료일",
      flex: 1,
      minWidth: 150,
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "";
        return formatDate(params.value);
      },
    },
    {
      field: "remainingDate",
      headerName: "잔여일",
      flex: 1,
      minWidth: 100,
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: Task }) => {
        if (!row?.endDate) return "";
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
                backgroundColor: "#ff4d4f",
                color: "white",
                fontWeight: 500,
              }}
            />
          );
        } else if (diffDays <= 1) {
          return (
            <Chip
              label="마감임박"
              size="small"
              sx={{
                backgroundColor: "#faad14",
                color: "white",
                fontWeight: 500,
              }}
            />
          );
        }

        return `${diffDays}일`;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 140px)" }}>
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
            sortModel: [{ field: "endDate", sort: "asc" }],
          },
        }}
        disableRowSelectionOnClick
        disableColumnMenu
        sx={{
          bgcolor: "white",
          opacity: 0.9,
          borderRadius: 2,
          width: "100%",
          "& .MuiDataGrid-cell": {
            borderColor: "grey.200",
            textAlign: "center",
            justifyContent: "center",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderRadius: "8px 8px 0 0",
            textAlign: "center",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#D4A373",
            color: "#ffffff",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
};

export default TaskTable;
