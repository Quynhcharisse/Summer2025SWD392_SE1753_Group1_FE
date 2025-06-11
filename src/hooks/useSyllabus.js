import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as syllabusService from '@api/services/syllabusService';

// Query keys
export const syllabusKeys = {
  all: ['syllabus'],
  lists: () => [...syllabusKeys.all, 'getSyllabusList'],
  detail: (id) => [...syllabusKeys.all, 'getSyllabusDetail', id],
  create: () => [...syllabusKeys.all, 'createSyllabus'],
  update: (id) => [...syllabusKeys.all, 'updateSyllabus', id],
  classes: () => [...syllabusKeys.all, 'getClasses'],
};

// Custom hooks for syllabus operations
export const useSyllabusList = () => {
  return useQuery({
    queryKey: syllabusKeys.lists(),
    queryFn: syllabusService.getSyllabusList,
  });
};

export const useSyllabusDetail = (id) => {
  return useQuery({
    queryKey: syllabusKeys.detail(id),
    queryFn: () => syllabusService.getSyllabusDetail(id),
    enabled: !!id, // Only fetch when id is available
  });
};

export const useCreateSyllabus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: syllabusKeys.create(),
    mutationFn: async (data) => {
      const response = await syllabusService.createSyllabus(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch syllabus list
      queryClient.invalidateQueries({ queryKey: syllabusKeys.lists() });
      
      // Optionally update the cache directly
      queryClient.setQueryData(syllabusKeys.lists(), (old) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: [...old.data.data, data]
          }
        };
      });
    },
  });
};

export const useUpdateSyllabus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: syllabusKeys.update(),
    mutationFn: async ({ id, data }) => {
      const response = await syllabusService.updateSyllabus(id, data);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: syllabusKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: syllabusKeys.detail(id)
      });

      // Optionally update the cache directly
      queryClient.setQueryData(syllabusKeys.lists(), (old) => {
        if (!old?.data?.data) return old;
        const updatedData = old.data.data.map((syllabus) => 
          syllabus.id === id ? data : syllabus
        );
        return {
          ...old,
          data: {
            ...old.data,
            data: updatedData
          }
        };
      });
    },
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: syllabusKeys.classes(),
    mutationFn: syllabusService.createClass,
    onSuccess: () => {
      // Invalidate and refetch classes list
      queryClient.invalidateQueries({ queryKey: syllabusKeys.classes() });
    },
  });
}; 