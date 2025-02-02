import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { getProjects } from '../../api/project.api';
import { Project } from '../../types/project.types';
import AppLayout from '../../layouts/AppLayout';

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

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <AppLayout>
      <CalendarContainer>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 100px)' }}
          views={['month', 'week', 'day']}
          defaultView="month"
          tooltipAccessor={event => `${event.title}`}
          messages={{
            next: "다음",
            previous: "이전",
            today: "오늘",
            month: "월",
            week: "주",
            day: "일",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#1976d2',
              borderRadius: '4px',
            },
          })}
        />
      </CalendarContainer>
    </AppLayout>
  );
};

const CalendarContainer = styled.div`
  padding: 20px;
  height: calc(100vh - 64px);
  
  .rbc-calendar {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .rbc-header {
    padding: 10px;
    font-weight: bold;
  }

  .rbc-event {
    padding: 4px;
  }
`;

export default ProjectCalendar; 