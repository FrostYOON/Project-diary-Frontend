import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getProjects } from '../../api/project.api';
import { Project } from '../../types/project.types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, Chip } from '@mui/material';
import {
  calendarHeaderStyle,
  calendarTitleStyle,
  legendContainerStyle,
  legendItemStyle,
  legendColorBoxStyle,
  modalTitleStyle,
  modalContentStyle,
  modalActionsStyle,
  closeButtonStyle,
  calendarPageContainerStyle,
  calendarContainerStyle,
  calendarWrapperStyle,
  calendarEventStyle
} from '../../styles/pages/projectCalendar.styles';

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

  const eventContent = ({ event }: { 
    event: { resource: Project; start: Date; title: string }
  }) => {
    const allEvents = events.filter((e) => 
      new Date(e.start).toDateString() === event.start.toDateString()
    );
    
    const currentIndex = allEvents.findIndex((event: { id: string }) => 
      event.id === event.id
    );

    // 3개 이상의 이벤트가 있고, 현재 이벤트가 3번째 이후일 경우
    if (allEvents.length > 3 && currentIndex >= 3) {
      // 3번째 이벤트일 경우에만 +n 표시
      if (currentIndex === 3) {
        return (
          <div style={{ 
            fontSize: '0.85em',
            padding: '2px 4px',
            color: '#666'
          }}>
            +{allEvents.length - 3}
          </div>
        );
      }
      // 4번째 이후의 이벤트는 숨김
      return null;
    }

    // 3개 이하의 이벤트이거나 처음 3개의 이벤트는 정상 표시
    return (
      <div style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.85em',
        padding: '2px 4px',
      }}>
        {event.title}
      </div>
    );
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Box sx={calendarPageContainerStyle}>
      <Box sx={calendarContainerStyle}>
        <Box sx={calendarHeaderStyle}>
          <Box sx={{ flex: 1 }} />
          <Typography variant="h3" sx={calendarTitleStyle}>
            프로젝트 현황
          </Typography>
          <Box sx={legendContainerStyle}>
            <Box sx={legendItemStyle}>
              <Box sx={legendColorBoxStyle('#90CAF9')} />
              <Typography>준비</Typography>
            </Box>
            <Box sx={legendItemStyle}>
              <Box sx={legendColorBoxStyle('#F4A261')} />
              <Typography>진행중</Typography>
            </Box>
            <Box sx={legendItemStyle}>
              <Box sx={legendColorBoxStyle('#4CAF50')} />
              <Typography>완료</Typography>
            </Box>
            <Box sx={legendItemStyle}>
              <Box sx={legendColorBoxStyle('#9E9E9E')} />
              <Typography>보류</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={calendarWrapperStyle}>
          <Calendar
            localizer={localizer}
            events={events}
            components={{
              event: eventContent
            }}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView="month"
            tooltipAccessor={event => `${event.title}`}
            onSelectEvent={handleEventClick}
            className="custom-calendar"
            dayPropGetter={date => {
              const day = date.getDay();
              if (day === 0) return { className: 'sunday' };
              if (day === 6) return { className: 'saturday' };
              return {};
            }}
            messages={{
              next: "다음",
              previous: "이전",
              today: "오늘",
              month: "월",
              week: "주",
              day: "일",
              agenda: "일정",
              date: "날짜",
              time: "시간",
              event: "일정",
              noEventsInRange: "해당 기간에 일정이 없습니다."
            }}
            eventPropGetter={(event: { resource?: { status: string } }) => ({
              style: calendarEventStyle(event.resource?.status || '')
            })}
          />
        </Box>
      </Box>

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
        <DialogTitle sx={modalTitleStyle}>
          프로젝트 상세
        </DialogTitle>
        <DialogContent sx={modalContentStyle}>
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
        <DialogActions sx={modalActionsStyle}>
          <Button 
            onClick={() => setIsModalOpen(false)}
            variant="contained"
            sx={closeButtonStyle}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectCalendar; 