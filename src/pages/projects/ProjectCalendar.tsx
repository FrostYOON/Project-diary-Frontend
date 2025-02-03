import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { getProjects } from '../../api/project.api';
import { Project } from '../../types/project.types';
import AppLayout from '../../layouts/AppLayout';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, Chip } from '@mui/material';

const locales = {
  'ko': ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarContainer = styled(Box)`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .rbc-calendar {
    .rbc-header {
      &:first-of-type {  /* 일요일 */
        color: #ff4d4f;
      }
      &:last-of-type {   /* 토요일 */
        color: #1890ff;
      }
    }

    .rbc-date-cell {
      &:first-of-type {  /* 일요일 날짜 */
        color: #ff4d4f;
      }
      &:last-of-type {   /* 토요일 날짜 */
        color: #1890ff;
      }
      
      &.rbc-off-range {
        color: #ccc;
      }
      &.rbc-today {
        background-color: #e6f7ff;
      }
      &.rbc-off-range-bg {
        background-color: #f5f5f5;
      }
    }
  }
`;

const ProjectCalendar = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('프로젝트 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const events = projects.map(project => ({
    id: project._id,
    title: project.title,
    start: new Date(project.startDate),
    end: new Date(project.endDate),
    resource: project
  }));

  const handleEventClick = (event: { resource: Project }) => {
    setSelectedEvent(event.resource);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <AppLayout>
      <CalendarContainer>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
        }}>
          <Box sx={{ flex: 1 }} /> {/* 왼쪽 여백 */}
          <Typography variant="h3" sx={{ flex: 1, textAlign: 'center' }}>프로젝트 현황</Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#90CAF9', borderRadius: 1 }} />
              <Typography>준비</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#F4A261', borderRadius: 1 }} />
              <Typography>진행중</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#4CAF50', borderRadius: 1 }} />
              <Typography>완료</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#9E9E9E', borderRadius: 1 }} />
              <Typography>보류</Typography>
            </Box>
          </Box>
        </Box>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 180px)' }}
          views={['month', 'week', 'day']}
          defaultView="month"
          tooltipAccessor={event => `${event.title}`}
          onSelectEvent={handleEventClick}
          dayPropGetter={date => {
            const day = date.getDay();
            if (day === 0) { // 일요일
              return {
                style: {
                  backgroundColor: '#fff1f0',
                  color: '#ff4d4f'
                }
              };
            }
            if (day === 6) { // 토요일
              return {
                style: {
                  backgroundColor: '#f0f5ff',
                  color: '#1890ff'
                }
              };
            }
            return {};
          }}
          messages={{
            next: "다음",
            previous: "이전",
            today: "오늘",
            month: "월",
            week: "주",
            day: "일",
          }}
          eventPropGetter={(event: { resource?: { status: string } }) => ({
            style: {
              backgroundColor: 
                event.resource?.status === '완료' ? '#4CAF50' :  // 완료: 초록색
                event.resource?.status === '진행중' ? '#F4A261' : // 진행중: 주황색
                event.resource?.status === '보류' ? '#9E9E9E' :    // 보류: 회색
                '#90CAF9',                                            // 준비: 연한 파란색
              borderRadius: '4px',
            },
          })}
        />
      </CalendarContainer>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          px: 3,
          py: 2
        }}>
          프로젝트 상세
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                  {selectedEvent.title}
                </Typography>
                <Chip 
                  label={selectedEvent.status} 
                  size="small"
                  sx={{ 
                    backgroundColor: 
                      selectedEvent.status === '완료' ? '#4CAF50' :
                      selectedEvent.status === '진행중' ? '#F4A261' :
                      selectedEvent.status === '보류' ? '#9E9E9E' : '#90CAF9',
                    color: 'white',
                    fontWeight: 500
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2, alignItems: 'center' }}>
                <Typography sx={{ color: '#666', fontWeight: 500 }}>시작일:</Typography>
                <Typography>{new Date(selectedEvent.startDate).toLocaleDateString()}</Typography>
                
                <Typography sx={{ color: '#666', fontWeight: 500 }}>종료일:</Typography>
                <Typography>{new Date(selectedEvent.endDate).toLocaleDateString()}</Typography>
                
                <Typography sx={{ color: '#666', fontWeight: 500 }}>담당 부서:</Typography>
                <Typography>{typeof selectedEvent.department === 'object' ? selectedEvent.department.name : '-'}</Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: '#666', fontWeight: 500, mb: 1 }}>설명:</Typography>
                <Typography sx={{ 
                  backgroundColor: '#f8f9fa',
                  p: 2,
                  borderRadius: 1,
                  minHeight: '80px'
                }}>
                  {selectedEvent.description || '-'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa'
        }}>
          <Button 
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            sx={{ 
              backgroundColor: '#F4A261',
              '&:hover': {
                backgroundColor: '#E76F51'
              }
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default ProjectCalendar; 