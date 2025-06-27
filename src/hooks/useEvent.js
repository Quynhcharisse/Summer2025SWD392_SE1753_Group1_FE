import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventService from '@api/services/eventService';

// Query keys
export const eventKeys = {
  all: ['event'],
  lists: () => [...eventKeys.all, 'getEventList'],
  detail: (id) => [...eventKeys.all, 'getEventDetail', id],
  create: () => [...eventKeys.all, 'createEvent'],
  update: (id) => [...eventKeys.all, 'updateEvent', id],
};

// Custom hooks for event operations
export const useEventList = () => {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: eventService.getEventList,
  });
};

export const useEventDetail = (id) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventDetail(id),
    enabled: !!id, // Only fetch when id is available
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: eventKeys.create(),
    mutationFn: async (data) => {
      const response = await eventService.createEvent(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch event list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      
      // Optionally update the cache directly
      queryClient.setQueryData(eventKeys.lists(), (old) => {
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

export const useCancelEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['cancelEvent'],
    mutationFn: async (id) => {
      const response = await eventService.cancelEvent(id);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: eventKeys.detail(id)
      });
      queryClient.setQueryData(eventKeys.lists(), (old) => {
        if (!old?.data?.data) return old;
        const updatedData = old.data.data.map((event) => 
          event.id === id ? data : event
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

export const useEventTeachers = (eventId) => {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), 'teachers'],
    queryFn: () => eventService.getEventTeachers(eventId),
    enabled: !!eventId,
  });
};

export const useEventActive = () => {
  return useQuery({
    queryKey: [...eventKeys.all, 'getEventActive'],
    queryFn: eventService.getEventActive,
  });
};

export const useEventActiveDetail = (id) => {
  return useQuery({
    queryKey: [...eventKeys.all, 'getEventActiveDetail', id],
    queryFn: () => eventService.getEventActiveDetail(id),
    enabled: !!id,
  });
};

export const useRegisterEvent = () => {
  return useMutation({
    mutationFn: ({ eventId, studentIds }) => eventService.registerEvent({ eventId, studentIds }),
  });
};

export const useChildren = () => {
  return useQuery({
    queryKey: ['children'],
    queryFn: eventService.getChildren,
  });
};
