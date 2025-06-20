import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lessonService from '@api/services/lessonService';

// Query keys
export const lessonKeys = {
  all: ['lesson'],
  lists: () => [...lessonKeys.all, 'getLessonList'],
  create: () => [...lessonKeys.all, 'createLesson'],
  update: (id) => [...lessonKeys.all, 'updateLesson', id],
  detail: (id) => [...lessonKeys.all, 'getLessonDetail', id],
  syllabuses: (id) => [...lessonKeys.all, 'getLessonSyllabuses', id],
};

// Custom hooks for lesson operations
export const useLessonList = () => {
  return useQuery({
    queryKey: lessonKeys.lists(),
    queryFn: lessonService.getLessonList,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: lessonKeys.create(),
    mutationFn: lessonService.createLesson,
    onSuccess: (newLesson) => {
      // Invalidate and refetch lesson list
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });

      // Optionally update the cache directly
      queryClient.setQueryData(lessonKeys.lists(), (old) => {
        if (!old?.data?.data) return old;
        return {
          data: {
            ...old.data,
            data: [...old.data.data, newLesson.data]
          }
        };
      });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: lessonKeys.update(),
    mutationFn: async ({ id, data }) => {
      try {
        const response = await lessonService.updateLesson(id, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });

      // Optionally update the cache directly
      queryClient.setQueryData(lessonKeys.lists(), (old) => {
        if (!old?.data?.data) return old;
        const updatedData = old.data.data.map((lesson) =>
          lesson.id === id ? data.data : lesson
        );
        return {
          data: {
            ...old.data,
            data: updatedData
          }
        };
      });
    },
  });
};

export const useLessonSyllabuses = (id) => {
  return useQuery({
    queryKey: lessonKeys.syllabuses(id),
    queryFn: () => lessonService.getLessonSyllabuses(id),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      // Only retry once if it's not a 4xx error
      return failureCount < 1 && !(error?.response?.status >= 400 && error?.response?.status < 500);
    },
    staleTime: 30000, // Data remains fresh for 30 seconds
    cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });
};
