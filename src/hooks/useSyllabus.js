import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as syllabusService from '@api/services/syllabusService';

// Query keys
export const syllabusKeys = {
  all: ['syllabus'],
  lists: () => [...syllabusKeys.all, 'getSyllabusList'],
  detail: (id) => [...syllabusKeys.all, 'getSyllabusDetail', id],
  create: () => [...syllabusKeys.all, 'createSyllabus'],
  update: (id) => [...syllabusKeys.all, 'updateSyllabus', id],
  delete: (id) => [...syllabusKeys.all, 'deleteSyllabus', id],
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
    mutationFn: syllabusService.createSyllabus,
    onSuccess: (newSyllabus) => {
      // Invalidate and refetch syllabus list
      queryClient.invalidateQueries({ queryKey: syllabusKeys.lists() });
      
      // Optionally update the cache directly
      queryClient.setQueryData(syllabusKeys.lists(), (old) => {
        return old ? [...old, newSyllabus] : [newSyllabus];
      });
    },
  });
};

export const useUpdateSyllabus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: syllabusKeys.update(),
    mutationFn: async ({ id, data }) => {
      try {
        const response = await syllabusService.updateSyllabus(id, {
          ...data,
          id // Include ID in the request body
        });
        if (!response.data.success) {
          throw new Error(response.data.message || 'Update failed');
        }
        return response.data;
      } catch (error) {
        throw error;
      }
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
          syllabus.id === id ? data.data : syllabus
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

export const useDeleteSyllabus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: syllabusKeys.delete(),
    mutationFn: (id) => syllabusService.deleteSyllabus(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: syllabusKeys.lists() });
      
      // Optionally update the cache directly
      queryClient.setQueryData(syllabusKeys.lists(), (old) => {
        return old?.filter((syllabus) => syllabus.id !== deletedId);
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