import { useQuery } from '@tanstack/react-query';
import * as teacherService from '@api/services/teacherService';

// Query keys
export const teacherKeys = {
  all: ['teacher'],
  lists: () => [...teacherKeys.all, 'getTeacherList'],
};

// Custom hooks for teacher operations
export const useTeacherList = () => {
  return useQuery({
    queryKey: teacherKeys.lists(),
    queryFn: teacherService.getTeacherList,
    retry: (failureCount, error) => {
      // Only retry once if it's not a 4xx error
      return failureCount < 1 && !(error?.response?.status >= 400 && error?.response?.status < 500);
    },
    staleTime: 30000, // Data remains fresh for 30 seconds
    cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });
};
