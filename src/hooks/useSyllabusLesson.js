import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as syllabusLessonService from '@api/services/syllabusLessonService';

/**
 * Query keys for syllabus lesson operations
 */
export const syllabusLessonKeys = {
    all: ['syllabusLesson'],
    unassigned: (id) => [...syllabusLessonKeys.all, 'unassigned', id],
    assigned: (id) => [...syllabusLessonKeys.all, 'assigned', id],
};

/**
 * Hook to fetch unassigned lessons for a syllabus
 * @param {string|number} id - The ID of the syllabus
 */
export const useUnassignedLessons = (id) => {
    return useQuery({
        queryKey: syllabusLessonKeys.unassigned(id),
        queryFn: () => syllabusLessonService.getUnassignedLessons(id),
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

/**
 * Hook to fetch assigned lessons for a syllabus
 * @param {string|number} id - The ID of the syllabus
 */
export const useAssignedLessons = (id) => {
    return useQuery({
        queryKey: syllabusLessonKeys.assigned(id),
        queryFn: () => syllabusLessonService.getAssignedLessons(id),
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

/**
 * Hook to assign lessons to a syllabus
 */
export const useAssignLessons = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, lessonNames }) => {
            // Chỉ kiểm id; lessonNames phải được truyền (có thể là []), không cần kiểm length > 0
            if (!id || lessonNames == null || !Array.isArray(lessonNames)) {
                throw new Error('Invalid parameters: id and lessonNames are required');
            }

            try {
                // Nếu backend không hỗ trợ mảng rỗng (clear assignments), bạn có thể:
                // - Nếu lessonNames.length === 0, gọi API unassign toàn bộ trong hook useUnassignLessons
                // - Hoặc backend tự xử lý mảng rỗng như "clear all"
                const response = await syllabusLessonService.assignLessons(id, lessonNames);
                return response.data;
            } catch (error) {
//                 console.error('Error assigning lessons:', error);
                if (error.response?.status === 404) {
                    throw new Error('Syllabus or lessons not found');
                } else if (error.response?.status === 403) {
                    throw new Error('You do not have permission to assign lessons');
                }
                throw error;
            }
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: syllabusLessonKeys.assigned(id)
            });
            queryClient.invalidateQueries({
                queryKey: syllabusLessonKeys.unassigned(id)
            });
        },
        onError: (error) => {
//             console.error('Mutation error:', error);
            throw error;
        }
    });
};


/**
 * Hook to unassign lessons from a syllabus
 */
export const useUnassignLessons = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, lessonNames }) => {
            if (!id || !lessonNames?.length) {
                throw new Error('Invalid parameters: id and lessonNames are required');
            }

            try {
                const response = await syllabusLessonService.unassignLessons(id, lessonNames);
                return response.data;
            } catch (error) {
//                 console.error('Error unassigning lessons:', error);
                // Enhance error message for client
                if (error.response?.status === 404) {
                    throw new Error('Syllabus or lessons not found');
                } else if (error.response?.status === 403) {
                    throw new Error('You do not have permission to unassign lessons');
                }
                throw error;
            }
        },
        onSuccess: (_, { id }) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: syllabusLessonKeys.assigned(id)
            });
            queryClient.invalidateQueries({
                queryKey: syllabusLessonKeys.unassigned(id)
            });
        },
        onError: (error) => {
//             console.error('Mutation error:', error);
            throw error;
        }
    });
}; 