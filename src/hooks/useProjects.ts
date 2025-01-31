import { useState, useCallback } from 'react';
import { Project } from '../types/project.types';
import { getProjects } from '../api/project.api';
import { retryRequest } from '../utils/api.utils';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (force = false) => {
    // 이미 데이터가 있고 강제 새로고침이 아니면 스킵
    if (projects.length > 0 && !force) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await retryRequest(getProjects, {
        maxRetries: 3,
        delayMs: 2000,
        backoffFactor: 2
      });
      setProjects(data);
    } catch (error: any) {
      const errorMessage = error?.response?.status === 429
        ? '서버 요청이 많아 잠시 후 다시 시도해주세요.'
        : '데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('프로젝트 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projects.length]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects
  };
}; 