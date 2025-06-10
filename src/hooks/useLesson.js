import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lessonService from '@api/services/lessonService';

// Query keys
export const lessonKeys = {
  all: ['lesson'],
  lists: () => [...lessonKeys.all, 'getLessonList'],
  create: () => [...lessonKeys.all, 'createLesson'],
  update: (id) => [...lessonKeys.all, 'updateLesson', id],
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
